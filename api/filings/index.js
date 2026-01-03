import Filing from '../../server/models/Filing.js';
import AuditLog from '../../server/models/AuditLog.js';
import { connectDB } from '../../server/config/database.js';
import { authenticateRequest } from '../_middleware.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    
    // Authenticate user
    const user = await authenticateRequest(req, res);
    if (!user) return; // Response already sent by authenticate

    if (req.method === 'GET') {
      const { status, type, priority, page = 1, limit = 10 } = req.query;
      
      const filter = {};
      if (status) filter.status = status;
      if (type) filter.type = type;
      if (priority) filter.priority = priority;

      const filings = await Filing.find(filter)
        .sort({ dueDate: 1, createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Filing.countDocuments(filter);

      res.status(200).json({
        success: true,
        data: filings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } else if (req.method === 'POST') {
      const filing = new Filing({
        ...req.body,
        createdBy: user.email,
        updatedBy: user.email
      });
      
      await filing.save();

      // Create audit log
      await AuditLog.create({
        user: user.email,
        action: 'CREATED',
        entity: `Filing: ${filing.title}`,
        entityId: filing._id,
        entityType: 'Filing',
        status: 'success'
      });

      res.status(201).json({
        success: true,
        data: filing,
        message: 'Filing created successfully'
      });

    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }

  } catch (error) {
    console.error('Filings API error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}
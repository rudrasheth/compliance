import AuditLog from '../../server/models/AuditLog.js';
import { connectDB } from '../../server/config/database.js';
import { authenticateRequest } from '../_middleware.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    
    // Authenticate user
    const user = await authenticateRequest(req, res);
    if (!user) return;

    if (req.method === 'GET') {
      const { user: filterUser, action, status, page = 1, limit = 20 } = req.query;
      
      const filter = {};
      if (filterUser) filter.user = filterUser;
      if (action) filter.action = action;
      if (status) filter.status = status;

      const auditLogs = await AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await AuditLog.countDocuments(filter);

      res.status(200).json({
        success: true,
        data: auditLogs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }

  } catch (error) {
    console.error('Audit logs API error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}
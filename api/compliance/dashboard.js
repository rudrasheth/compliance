import ComplianceMetric from '../../server/models/ComplianceMetric.js';
import Filing from '../../server/models/Filing.js';
import { connectDB } from '../../server/config/database.js';
import { authenticate } from '../_middleware.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await connectDB();
    
    // Authenticate user
    const user = await authenticate(req, res);
    if (!user) return;

    const now = new Date();
    
    // Get next critical deadline
    const nextDeadline = await Filing.findOne({
      dueDate: { $gte: now },
      status: { $in: ['draft', 'ready'] }
    }).sort({ dueDate: 1 });

    // Get overall compliance score (latest metric)
    const latestMetric = await ComplianceMetric.findOne().sort({ year: -1, month: -1 });
    
    // Get filing workflow counts
    const workflowCounts = await Filing.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        nextDeadline,
        complianceScore: latestMetric?.score || 96,
        workflowCounts
      }
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}
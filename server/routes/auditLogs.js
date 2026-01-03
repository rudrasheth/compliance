import express from 'express';
import AuditLog from '../models/AuditLog.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all audit logs (protected)
router.get('/', authenticate, async (req, res) => {
  try {
    const { user, action, status, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (user) filter.user = { $regex: user, $options: 'i' };
    if (action) filter.action = action;
    if (status) filter.status = status;

    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await AuditLog.countDocuments(filter);

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching audit logs',
      error: error.message
    });
  }
});

// Get audit statistics (protected)
router.get('/stats', authenticate, async (req, res) => {
  try {
    const totalActions = await AuditLog.countDocuments();
    
    const successRate = await AuditLog.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const actionCounts = await AuditLog.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentActivity = await AuditLog.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalActions,
        successRate,
        actionCounts,
        recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching audit statistics',
      error: error.message
    });
  }
});

export default router;
import express from 'express';
import ComplianceMetric from '../models/ComplianceMetric.js';
import Filing from '../models/Filing.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get compliance metrics (protected)
router.get('/metrics', authenticate, async (req, res) => {
  try {
    const { months = 7 } = req.query;
    
    const metrics = await ComplianceMetric.find()
      .sort({ year: -1, month: -1 })
      .limit(parseInt(months));

    res.json({
      success: true,
      data: metrics.reverse() // Show chronological order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching compliance metrics',
      error: error.message
    });
  }
});

// Get health matrix data (protected)
router.get('/health-matrix', authenticate, async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Get compliance areas with their current status
    const complianceAreas = await Promise.all([
      // GST Compliance
      Filing.findOne({
        type: 'GST',
        dueDate: { $gte: now }
      }).sort({ dueDate: 1 }),
      
      // Income Tax
      Filing.findOne({
        type: 'Income Tax',
        dueDate: { $gte: now }
      }).sort({ dueDate: 1 }),
      
      // Professional Tax
      Filing.findOne({
        type: 'Professional Tax',
        dueDate: { $gte: now }
      }).sort({ dueDate: 1 }),
      
      // License
      Filing.findOne({
        type: 'License',
        dueDate: { $gte: now }
      }).sort({ dueDate: 1 })
    ]);

    const getComplianceStatus = (filing) => {
      if (!filing) return 'compliant';
      
      const daysUntilDue = Math.ceil((filing.dueDate - now) / (1000 * 60 * 60 * 24));
      
      if (filing.status === 'overdue' || daysUntilDue < 0) return 'overdue';
      if (daysUntilDue <= 7) return 'due-soon';
      return 'compliant';
    };

    const healthMatrix = [
      {
        id: 'gst',
        title: 'GST Compliance',
        subtitle: 'Quarterly Returns',
        status: getComplianceStatus(complianceAreas[0])
      },
      {
        id: 'income-tax',
        title: 'Income Tax',
        subtitle: 'Annual Filing',
        status: getComplianceStatus(complianceAreas[1])
      },
      {
        id: 'professional-tax',
        title: 'Professional Tax',
        subtitle: 'Monthly Deductions',
        status: getComplianceStatus(complianceAreas[2])
      },
      {
        id: 'local-license',
        title: 'Local License',
        subtitle: 'Trade Registration',
        status: getComplianceStatus(complianceAreas[3])
      }
    ];

    res.json({
      success: true,
      data: healthMatrix
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching health matrix',
      error: error.message
    });
  }
});

// Get dashboard overview (protected)
router.get('/dashboard', authenticate, async (req, res) => {
  try {
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

    res.json({
      success: true,
      data: {
        nextDeadline,
        complianceScore: latestMetric?.score || 96,
        workflowCounts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
});

export default router;
import express from 'express';
import { body, validationResult } from 'express-validator';
import Filing from '../models/Filing.js';
import AuditLog from '../models/AuditLog.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all filings (protected)
router.get('/', authenticate, async (req, res) => {
  try {
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

    res.json({
      success: true,
      data: filings,
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
      message: 'Error fetching filings',
      error: error.message
    });
  }
});

// Get filing by ID (protected)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const filing = await Filing.findById(req.params.id);
    
    if (!filing) {
      return res.status(404).json({
        success: false,
        message: 'Filing not found'
      });
    }

    res.json({
      success: true,
      data: filing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching filing',
      error: error.message
    });
  }
});

// Create new filing (protected)
router.post('/', authenticate, [
  body('title').notEmpty().withMessage('Title is required'),
  body('type').isIn(['GST', 'Income Tax', 'Professional Tax', 'License', 'Other']).withMessage('Invalid filing type'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('priority').isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('createdBy').notEmpty().withMessage('Created by is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const filing = new Filing(req.body);
    await filing.save();

    // Create audit log
    await AuditLog.create({
      user: req.user.email,
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating filing',
      error: error.message
    });
  }
});

// Update filing (protected)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const filing = await Filing.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.body.updatedBy },
      { new: true, runValidators: true }
    );

    if (!filing) {
      return res.status(404).json({
        success: false,
        message: 'Filing not found'
      });
    }

    // Create audit log
    await AuditLog.create({
      user: req.user.email,
      action: 'UPDATED',
      entity: `Filing: ${filing.title}`,
      entityId: filing._id,
      entityType: 'Filing',
      status: 'success'
    });

    res.json({
      success: true,
      data: filing,
      message: 'Filing updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating filing',
      error: error.message
    });
  }
});

// Delete filing (protected)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const filing = await Filing.findByIdAndDelete(req.params.id);

    if (!filing) {
      return res.status(404).json({
        success: false,
        message: 'Filing not found'
      });
    }

    // Create audit log
    await AuditLog.create({
      user: req.user.email,
      action: 'DELETED',
      entity: `Filing: ${filing.title}`,
      entityId: filing._id,
      entityType: 'Filing',
      status: 'success'
    });

    res.json({
      success: true,
      message: 'Filing deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting filing',
      error: error.message
    });
  }
});

// Get compliance status overview (protected)
router.get('/status/overview', authenticate, async (req, res) => {
  try {
    const statusCounts = await Filing.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const typeCounts = await Filing.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const upcomingDeadlines = await Filing.find({
      dueDate: { $gte: new Date(), $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      status: { $in: ['draft', 'ready'] }
    }).sort({ dueDate: 1 }).limit(5);

    res.json({
      success: true,
      data: {
        statusCounts,
        typeCounts,
        upcomingDeadlines
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching overview',
      error: error.message
    });
  }
});

export default router;
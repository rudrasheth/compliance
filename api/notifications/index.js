import Notification from '../../server/models/Notification.js';
import { connectDB } from '../../server/config/database.js';
import { authenticate } from '../_middleware.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    
    // Authenticate user
    const user = await authenticate(req, res);
    if (!user) return;

    if (req.method === 'GET') {
      const { read, type, page = 1, limit = 20 } = req.query;
      const userId = user.email;
      
      const filter = { userId };
      if (read !== undefined) filter.read = read === 'true';
      if (type) filter.type = type;

      const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Notification.countDocuments(filter);
      const unreadCount = await Notification.countDocuments({ userId, read: false });

      res.status(200).json({
        success: true,
        data: notifications,
        unreadCount,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } else if (req.method === 'POST') {
      const notification = new Notification({
        ...req.body,
        userId: user.email
      });
      
      await notification.save();

      res.status(201).json({
        success: true,
        data: notification,
        message: 'Notification created successfully'
      });

    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }

  } catch (error) {
    console.error('Notifications API error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}
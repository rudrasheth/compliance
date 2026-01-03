import Filing from '../../server/models/Filing.js';
import { connectDB } from '../../server/config/database.js';
import { authenticateRequest } from '../_middleware.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await connectDB();
    
    // Authenticate user
    const user = await authenticateRequest(req, res);
    if (!user) return;

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

    res.status(200).json({
      success: true,
      data: healthMatrix
    });

  } catch (error) {
    console.error('Health matrix API error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}
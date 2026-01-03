import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Filing from '../models/Filing.js';
import AuditLog from '../models/AuditLog.js';
import Notification from '../models/Notification.js';
import ComplianceMetric from '../models/ComplianceMetric.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const seedFilings = async () => {
  const filings = [
    {
      title: 'GST Return Q1 2026',
      type: 'GST',
      dueDate: new Date('2026-04-20'),
      status: 'draft',
      priority: 'high',
      description: 'Quarterly GST return filing for Q1 2026',
      createdBy: 'admin@company.com'
    },
    {
      title: 'Professional Tax January 2026',
      type: 'Professional Tax',
      dueDate: new Date('2026-01-15'),
      status: 'ready',
      priority: 'urgent',
      description: 'Monthly professional tax payment',
      createdBy: 'admin@company.com'
    },
    {
      title: 'Income Tax Return FY 2024-25',
      type: 'Income Tax',
      dueDate: new Date('2026-07-31'),
      status: 'filed',
      priority: 'medium',
      description: 'Annual income tax return filing',
      createdBy: 'admin@company.com',
      filedDate: new Date('2026-01-02'),
      acknowledgmentNumber: 'ITR123456789'
    },
    {
      title: 'Trade License Renewal',
      type: 'License',
      dueDate: new Date('2026-03-31'),
      status: 'verified',
      priority: 'medium',
      description: 'Annual trade license renewal',
      createdBy: 'admin@company.com'
    },
    {
      title: 'GST Return Q4 2025',
      type: 'GST',
      dueDate: new Date('2026-01-20'),
      status: 'filed',
      priority: 'high',
      description: 'Quarterly GST return filing for Q4 2025',
      createdBy: 'admin@company.com',
      filedDate: new Date('2026-01-03'),
      acknowledgmentNumber: 'GST987654321'
    }
  ];

  await Filing.deleteMany({});
  await Filing.insertMany(filings);
  console.log('✅ Filings seeded');
};

const seedAuditLogs = async () => {
  const logs = [
    {
      user: 'admin@company.com',
      action: 'FILED',
      entity: 'GST Return Q4 2025',
      status: 'success',
      details: 'Successfully filed GST return with acknowledgment number GST987654321'
    },
    {
      user: 'admin@company.com',
      action: 'UPLOADED',
      entity: 'Invoice Batch #2025-1203',
      status: 'success',
      details: 'Uploaded 25 invoices for processing'
    },
    {
      user: 'admin@company.com',
      action: 'VERIFIED',
      entity: 'Trade License 2025',
      status: 'success',
      details: 'Trade license verification completed'
    },
    {
      user: 'system',
      action: 'REMINDER',
      entity: 'Professional Tax Jan 2026',
      status: 'pending',
      details: 'Automated reminder sent for upcoming deadline'
    },
    {
      user: 'system',
      action: 'SYNC_FAILED',
      entity: 'Income Tax Portal',
      status: 'failed',
      details: 'Failed to sync with income tax portal - connection timeout'
    },
    {
      user: 'admin@company.com',
      action: 'EXPORTED',
      entity: 'Annual Compliance Report',
      status: 'success',
      details: 'Generated and exported annual compliance report'
    }
  ];

  await AuditLog.deleteMany({});
  await AuditLog.insertMany(logs);
  console.log('✅ Audit logs seeded');
};

const seedNotifications = async () => {
  const notifications = [
    {
      title: 'Professional Tax Payment Due',
      message: 'Professional Tax payment for January 2026 is due in 12 days.',
      type: 'warning',
      priority: 'high',
      read: false,
      userId: 'admin@company.com'
    },
    {
      title: 'GST Return Filed Successfully',
      message: 'GST Return for Q4 2025 has been successfully filed and acknowledged.',
      type: 'success',
      priority: 'medium',
      read: false,
      userId: 'admin@company.com'
    },
    {
      title: 'Document Upload Required',
      message: 'Please upload supporting documents for Income Tax Return FY 2024-25.',
      type: 'info',
      priority: 'medium',
      read: true,
      userId: 'admin@company.com'
    },
    {
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance on January 5th, 2026 from 2:00 AM to 4:00 AM IST.',
      type: 'info',
      priority: 'low',
      read: true,
      userId: 'admin@company.com'
    },
    {
      title: 'Trade License Renewal Reminder',
      message: 'Trade License renewal is due in 88 days. Start preparing required documents.',
      type: 'warning',
      priority: 'medium',
      read: true,
      userId: 'admin@company.com'
    }
  ];

  await Notification.deleteMany({});
  await Notification.insertMany(notifications);
  console.log('✅ Notifications seeded');
};

const seedComplianceMetrics = async () => {
  const metrics = [
    { month: 'Jul', year: 2025, score: 72, totalFilings: 8, onTimeFilings: 6, lateFilings: 2, pendingFilings: 0 },
    { month: 'Aug', year: 2025, score: 78, totalFilings: 10, onTimeFilings: 8, lateFilings: 1, pendingFilings: 1 },
    { month: 'Sep', year: 2025, score: 85, totalFilings: 12, onTimeFilings: 11, lateFilings: 1, pendingFilings: 0 },
    { month: 'Oct', year: 2025, score: 82, totalFilings: 9, onTimeFilings: 7, lateFilings: 2, pendingFilings: 0 },
    { month: 'Nov', year: 2025, score: 90, totalFilings: 11, onTimeFilings: 10, lateFilings: 1, pendingFilings: 0 },
    { month: 'Dec', year: 2025, score: 94, totalFilings: 13, onTimeFilings: 12, lateFilings: 1, pendingFilings: 0 },
    { month: 'Jan', year: 2026, score: 96, totalFilings: 15, onTimeFilings: 14, lateFilings: 0, pendingFilings: 1 }
  ];

  await ComplianceMetric.deleteMany({});
  await ComplianceMetric.insertMany(metrics);
  console.log('✅ Compliance metrics seeded');
};

const seedAll = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    await seedFilings();
    await seedAuditLogs();
    await seedNotifications();
    await seedComplianceMetrics();
    
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedAll();
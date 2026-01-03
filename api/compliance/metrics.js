import ComplianceMetric from '../../server/models/ComplianceMetric.js';
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

    const { months = 7 } = req.query;
    
    const metrics = await ComplianceMetric.find()
      .sort({ year: -1, month: -1 })
      .limit(parseInt(months));

    res.status(200).json({
      success: true,
      data: metrics.reverse() // Show chronological order
    });

  } catch (error) {
    console.error('Compliance metrics API error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();

    // 1. Total Revenue (from PAID orders)
    const orders = await Order.find({ paymentStatus: 'PAID' });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    // 2. Order Counts (Today, Week, Month)
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayOrders = await Order.countDocuments({ createdAt: { $gte: startOfToday } });
    const weekOrders = await Order.countDocuments({ createdAt: { $gte: startOfWeek } });
    const totalOrders = await Order.countDocuments({});

    // 3. User Counts
    const totalUsers = await User.countDocuments({ role: 'CUSTOMER' });
    const adminUsers = await User.countDocuments({ role: { $ne: 'CUSTOMER' } });

    // 4. Product Stock Alerts (Stock < 10)
    const stockAlerts = await Product.countDocuments({ stock: { $lt: 10 } });

    // 5. Category-wise Sales (Complex aggregation)
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalStock: { $sum: '$stock' } } }
    ]);

    // 6. Recent Sales (Last 7 days for chart)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0,0,0,0);
        const end = new Date(d);
        end.setHours(23,59,59,999);

        const dayRevenue = orders
            .filter(o => o.createdAt >= d && o.createdAt <= end)
            .reduce((acc, o) => acc + o.totalAmount, 0);

        last7Days.push({
            name: d.toLocaleDateString('en-US', { weekday: 'short' }),
            revenue: dayRevenue
        });
    }

    return NextResponse.json({
        stats: {
            totalRevenue,
            totalOrders,
            todayOrders,
            totalUsers,
            stockAlerts,
            categoryStats,
            last7Days
        }
    });

  } catch (error) {
    console.error('Stats API failed:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}

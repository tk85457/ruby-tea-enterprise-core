import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Product';
// import Order from '../../../models/Order'; // Pending Order model creation

export async function GET() {
  await dbConnect();

  try {
    // 1. Fetch Product Stats
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 20 } });

    // 2. Fetch Order Stats (Mocked for now until Order model is fully integrated)
    // const totalOrders = await Order.countDocuments();
    // const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    // Mock Data for Prototype Phase
    const stats = {
      revenue: 125430, // Mocked total revenue
      orders: 87,      // Mocked order count
      customers: 342,  // Mocked customer count
      products: totalProducts,
      lowStock: lowStockProducts,
    };

    const recentActivity = [
      { id: 'ORD-001', text: 'New Order from Priya S.', time: '2 mins ago', amount: 450 },
      { id: 'ORD-002', text: 'New Order from Rahul K.', time: '15 mins ago', amount: 1200 },
      { id: 'ORD-003', text: 'Stock Alert: Assam Tea low', time: '1 hour ago', amount: null },
    ];

    return NextResponse.json({ success: true, stats, recentActivity });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}

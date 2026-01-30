import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Category from '@/models/Category';
import { pusherServer } from '@/lib/pusher';
import { logActivity } from '@/lib/logger';

export async function POST(req: Request) {
  try {
    const { entity, action, ids, data } = await req.json();
    await dbConnect();

    let result;
    if (entity === 'Product') {
      if (action === 'DELETE') {
        result = await Product.deleteMany({ _id: { $in: ids } });
      } else if (action === 'UPDATE_STATUS') {
        result = await Product.updateMany({ _id: { $in: ids } }, { status: data.status });
      } else if (action === 'UPDATE_CATEGORY') {
        result = await Product.updateMany({ _id: { $in: ids } }, { category: data.category });
      }
    } else if (entity === 'Order') {
      if (action === 'UPDATE_STATUS') {
        result = await Order.updateMany({ _id: { $in: ids } }, { status: data.status });
      }
    }

    // Real-time Update
    await pusherServer.trigger('admin-events', 'bulk_operation_completed', { entity, action, ids });

    // Activity Log
    await logActivity({
      userId: 'system',
      action: `BULK_${action}_${entity.toUpperCase()}`,
      entity: entity,
      details: { count: ids.length, ids }
    });

    return NextResponse.json({ success: true, count: ids.length });
  } catch (error) {
    console.error('Bulk operation failed:', error);
    return NextResponse.json({ error: 'Bulk operation failed' }, { status: 500 });
  }
}

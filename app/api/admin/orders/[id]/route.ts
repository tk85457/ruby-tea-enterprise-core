import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { pusherServer } from '@/lib/pusher';
import { logActivity } from '@/lib/logger';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, paymentStatus } = await req.json();

    await dbConnect();

    const update: any = {};
    if (status) update.status = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;

    const updatedOrder = await Order.findByIdAndUpdate(id, update, { new: true })
      .populate('userId', 'name email');

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Real-time Update
    await pusherServer.trigger('admin-events', 'order_updated', { order: updatedOrder });

    // Activity Log
    await logActivity({
      userId: 'system', // Should be replaced with actual admin ID in real scenario
      action: 'UPDATE_ORDER_STATUS',
      entity: 'Order',
      entityId: id,
      details: { status: updatedOrder.status, paymentStatus: updatedOrder.paymentStatus }
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Update order failed:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

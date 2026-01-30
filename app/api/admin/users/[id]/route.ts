import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { pusherServer } from '@/lib/pusher';
import { logActivity } from '@/lib/logger';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { role, status } = await req.json();

    await dbConnect();

    const update: any = {};
    if (role) update.role = role;
    if (status) update.status = status;

    const updatedUser = await User.findByIdAndUpdate(id, update, { new: true }).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Real-time Update
    await pusherServer.trigger('admin-events', 'user_updated', { user: updatedUser });

    // Activity Log
    await logActivity({
      userId: 'system',
      action: 'UPDATE_USER_PERMISSIONS',
      entity: 'User',
      entityId: id,
      details: { role: updatedUser.role, status: updatedUser.status }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update user failed:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

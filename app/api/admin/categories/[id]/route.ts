import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import { pusherServer } from '@/lib/pusher';
import { logActivity } from '@/lib/logger';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, description, order, isActive } = await req.json();
    await dbConnect();

    const update: any = { name, description, order, isActive };
    if (name) {
      update.slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, update, { new: true });

    await pusherServer.trigger('admin-events', 'category_updated', { category: updatedCategory });
    await logActivity({
      userId: 'system',
      action: 'UPDATE_CATEGORY',
      entity: 'Category',
      entityId: id,
      details: { name: updatedCategory.name }
    });

    return NextResponse.json({ success: true, category: updatedCategory });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const category = await Category.findById(id);
    await Category.findByIdAndDelete(id);

    await pusherServer.trigger('admin-events', 'category_deleted', { categoryId: id });
    await logActivity({
      userId: 'system',
      action: 'DELETE_CATEGORY',
      entity: 'Category',
      entityId: id,
      details: { name: category?.name }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

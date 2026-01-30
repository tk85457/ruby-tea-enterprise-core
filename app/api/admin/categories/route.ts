import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import { pusherServer } from '@/lib/pusher';
import { logActivity } from '@/lib/logger';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ order: 1, name: 1 }).lean();
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, description } = await req.json();
    await dbConnect();

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const newCategory = await Category.create({ name, slug, description });

    await pusherServer.trigger('admin-events', 'category_created', { category: newCategory });
    await logActivity({
      userId: 'system',
      action: 'CREATE_CATEGORY',
      entity: 'Category',
      entityId: newCategory._id,
      details: { name }
    });

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

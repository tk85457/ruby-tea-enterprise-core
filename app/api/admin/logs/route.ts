import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ActivityLog from '@/models/ActivityLog';

export async function GET() {
  try {
    await dbConnect();
    const logs = await ActivityLog.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

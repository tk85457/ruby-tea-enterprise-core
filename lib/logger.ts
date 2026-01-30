import dbConnect from './dbConnect';
import ActivityLog from '@/models/ActivityLog';

export async function logActivity({
  userId,
  userName,
  action,
  entity,
  entityId,
  details,
}: {
  userId: string;
  userName?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: any;
}) {
  try {
    await dbConnect();
    await ActivityLog.create({
      userId,
      userName,
      action,
      entity,
      entityId,
      details,
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

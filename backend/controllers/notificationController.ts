import { Request, Response } from 'express';
import * as db from '../db';

/**
 * 1. SEND BROADCAST
 * POST /api/broadcast/send
 */
export const sendBroadcast = async (req: Request, res: Response) => {
  try {
    // Cast req to any to fix property 'body'
    const { treeId, senderId, eventType, message } = (req as any).body;

    if (!treeId || !senderId || !eventType) {
      // Cast res to any to fix property 'status'
      return (res as any).status(400).json({ success: false, error: "Missing required fields" });
    }

    const sql = `
      INSERT INTO notifications (tree_id, sender_id, event_type, message, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;

    const result = await db.query(sql, [treeId, senderId, eventType, message]);

    // Cast res to any to fix property 'status'
    return (res as any).status(201).json({
      success: true,
      message: "Broadcast sent successfully",
      data: result.rows[0]
    });

  } catch (err: any) {
    console.error("Send Broadcast Error:", err);
    // Cast res to any to fix property 'status'
    return (res as any).status(500).json({ success: false, error: "Internal Server Error" });
  }
};

/**
 * 2. GET NOTIFICATIONS
 * GET /api/notifications
 * Fetches notifications for a specific tree (or user context)
 */
export const getNotifications = async (req: Request, res: Response) => {
  try {
    // Cast req to any to fix property 'query'
    const { treeId } = (req as any).query;

    if (!treeId) {
      // Cast res to any to fix property 'status'
      return (res as any).status(400).json({ success: false, error: "Tree ID is required" });
    }

    // Join with Users table to get sender name
    const sql = `
      SELECT n.*, u.full_name as sender_name 
      FROM notifications n
      LEFT JOIN users u ON n.sender_id = u.id
      WHERE n.tree_id = $1
      ORDER BY n.created_at DESC
      LIMIT 20;
    `;

    const result = await db.query(sql, [treeId]);

    // Format for frontend (snake_case -> camelCase mapping handled here or in frontend util)
    const formatted = result.rows.map(row => ({
      id: row.id,
      treeId: row.tree_id,
      senderId: row.sender_id,
      senderName: row.sender_name || 'Family Member',
      eventType: row.event_type,
      message: row.message,
      isRead: row.is_read,
      createdAt: row.created_at
    }));

    // Cast res to any to fix property 'status'
    return (res as any).status(200).json({
      success: true,
      data: formatted
    });

  } catch (err: any) {
    console.error("Get Notifications Error:", err);
    // Cast res to any to fix property 'status'
    return (res as any).status(500).json({ success: false, error: "Internal Server Error" });
  }
};
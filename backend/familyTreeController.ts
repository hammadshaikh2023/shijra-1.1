import { Request as ExpressRequest, Response, NextFunction } from 'express';

// --- MOCK DATABASE & MODELS ---
// In a real app, these would be Mongoose models or SQL repositories
const DB = {
  members: {
    findById: async (id: string) => ({ id, name: "Sample Member", role: "MEMBER" }),
    update: async (id: string, updates: any) => console.log(`DB: Updated member ${id}`, updates)
  },
  editRequests: {
    create: async (data: any) => ({ id: `req_${Date.now()}`, ...data })
  },
  notifications: {
    create: async (data: any) => console.log(`DB: Notification created`, data)
  }
};

// --- TYPES ---
interface AuthRequest extends ExpressRequest {
  params: any;
  body: any;
  user?: {
    id: string;
    role: 'ADMIN' | 'EDITOR' | 'VIEWER';
    familyId: string;
  };
}

/**
 * Middleware: Role-Based Access Control
 * Ensures the user has at least Editor permissions to attempt an edit.
 */
export const checkEditPermissions = (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  
  if (!user || !['ADMIN', 'EDITOR'].includes(user.role)) {
    // Cast to any to fix property status error
    return (res as any).status(403).json({
      error: "Access Denied",
      message: "You do not have permission to edit the family tree."
    });
  }
  
  next();
};

/**
 * Controller: Handle Member Update
 * - ADMIN: Updates directly.
 * - EDITOR: Creates a 'Pending Approval' request and notifies Admins.
 */
export const updateFamilyMember = async (req: AuthRequest, res: Response) => {
  try {
    const { memberId } = req.params;
    const { name, img, details } = req.body;
    const { role, id: userId, familyId } = req.user!;

    // 1. Validation: Check if member exists
    const member = await DB.members.findById(memberId);
    if (!member) {
      // Cast to any to fix property status error
      return (res as any).status(404).json({ error: "Member not found" });
    }

    // 2. Logic Flow based on Role
    if (role === 'ADMIN') {
      // --- PATH A: ADMIN (Direct Update) ---
      const updatedMember = await DB.members.update(memberId, { name, img, details });
      
      // Cast to any to fix property status error
      return (res as any).status(200).json({
        success: true,
        message: "Member updated successfully.",
        data: updatedMember
      });

    } else {
      // --- PATH B: EDITOR (Approval Workflow) ---
      
      // Create an Edit Request ticket
      const editRequest = await DB.editRequests.create({
        memberId,
        requesterId: userId,
        changes: { name, img, details },
        status: 'PENDING',
        createdAt: new Date()
      });

      // Backend Notification Logic
      // Trigger a notification for all Family Admins
      await DB.notifications.create({
        type: 'APPROVAL_NEEDED',
        familyId,
        recipientRole: 'ADMIN', 
        title: "New Edit Request",
        message: `User ${userId} requested changes for ${name || 'a member'}.`,
        metadata: { requestId: editRequest.id }
      });

      // Cast to any to fix property status error
      return (res as any).status(202).json({
        success: true,
        status: 'PENDING_APPROVAL',
        message: "Your changes have been submitted for Admin approval.",
        requestId: editRequest.id
      });
    }

  } catch (error) {
    console.error("Update failed:", error);
    // Cast to any to fix property status error
    (res as any).status(500).json({ error: "Internal Server Error" });
  }
};
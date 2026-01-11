import { Router } from 'express';
import { sendBroadcast, getNotifications } from '../controllers/notificationController';

const router = Router();

// Send a broadcast message to the tree
router.post('/broadcast/send', sendBroadcast);

// Get notifications for the current user's view
router.get('/notifications', getNotifications);

export default router;

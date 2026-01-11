import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import * as db from './db';

// --- SOCKET TYPES ---
interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId?: string; // Optional for DMs
  content: string;
  createdAt: string;
}

export const initSocket = (httpServer: HttpServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*", // Adjust allowed origins for production
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log('🔗 User connected to Shijra Chat:', socket.id);

    // 1. JOIN ROOM (Family Tree Group)
    socket.on('join_tree', (treeId: string) => {
      socket.join(treeId);
      console.log(`User ${socket.id} joined Tree Room: ${treeId}`);
    });

    // 2. SEND MESSAGE
    socket.on('send_message', async (data: { treeId: string, senderId: string, senderName: string, content: string, recipientId?: string }) => {
      const { treeId, senderId, senderName, content, recipientId } = data;

      try {
        // Save to Database
        const sql = `
          INSERT INTO messages (tree_id, sender_id, recipient_id, content)
          VALUES ($1, $2, $3, $4)
          RETURNING id, created_at;
        `;
        // Note: Using mock IDs in frontend, so DB save might fail if FK constraints exist. 
        // In real app, uncomment below:
        // const res = await db.query(sql, [treeId, senderId, recipientId || null, content]);
        // const savedId = res.rows[0].id;
        // const savedTime = res.rows[0].created_at;

        // Broadcast Payload
        const messagePayload: ChatMessage = {
          id: Date.now().toString(), // Use DB ID in production
          senderId,
          senderName,
          recipientId,
          content,
          createdAt: new Date().toISOString()
        };

        // If Direct Message
        if (recipientId) {
          // Logic for DM: Emit to specific user socket (requires user->socket mapping)
          // For now, simpler implementation: emit to room but frontend filters by recipientId
          socket.to(treeId).emit('receive_message', messagePayload);
        } else {
          // Group Chat
          socket.to(treeId).emit('receive_message', messagePayload);
        }

      } catch (err) {
        console.error('Chat Error:', err);
      }
    });

    // 3. TYPING INDICATORS
    socket.on('typing_start', ({ treeId, userName }) => {
      socket.to(treeId).emit('user_typing', { userName, isTyping: true });
    });

    socket.on('typing_end', ({ treeId, userName }) => {
      socket.to(treeId).emit('user_typing', { userName, isTyping: false });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from chat');
    });
  });

  return io;
};

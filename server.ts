import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("coders_in.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT,
    email TEXT UNIQUE,
    coders_count INTEGER DEFAULT 0,
    avatar TEXT
  );

  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    name TEXT,
    is_group INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS conversation_members (
    conversation_id TEXT,
    user_id TEXT,
    PRIMARY KEY (conversation_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id TEXT,
    sender_id TEXT,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    title TEXT,
    thumbnail TEXT,
    author_id TEXT,
    language TEXT,
    views INTEGER DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS internship_progress (
    user_id TEXT,
    week_number INTEGER,
    completed INTEGER DEFAULT 0,
    test_score INTEGER DEFAULT NULL,
    PRIMARY KEY (user_id, week_number)
  );
`);

// Populate mock videos
const videoCount = db.prepare("SELECT COUNT(*) as count FROM videos").get().count;
if (videoCount === 0) {
  const mockVideos = [
    ['1', 'Mastering React in 2024', 'https://picsum.photos/seed/react/800/450', 'user1', 'JavaScript', 1200],
    ['2', 'Python for Data Science', 'https://picsum.photos/seed/python/800/450', 'user2', 'Python', 850],
    ['3', 'Advanced C# Patterns', 'https://picsum.photos/seed/csharp/800/450', 'user3', 'C#', 2300],
    ['4', 'Rust vs Go: The Ultimate Showdown', 'https://picsum.photos/seed/rust/800/450', 'user4', 'Rust', 5000],
    ['5', 'Java Spring Boot Tutorial', 'https://picsum.photos/seed/java/800/450', 'user5', 'Java', 3400],
    ['6', 'C++ Game Engine Dev', 'https://picsum.photos/seed/cpp/800/450', 'user6', 'C++', 1500],
    ['7', 'TypeScript Best Practices', 'https://picsum.photos/seed/ts/800/450', 'user7', 'TypeScript', 900],
    ['8', 'Go Microservices Guide', 'https://picsum.photos/seed/go/800/450', 'user8', 'Go', 2100],
    ['9', 'SwiftUI for Beginners', 'https://picsum.photos/seed/swift/800/450', 'user9', 'Swift', 1100],
    ['10', 'Kotlin Multiplatform', 'https://picsum.photos/seed/kotlin/800/450', 'user10', 'Kotlin', 750]
  ];
  const insertVideo = db.prepare("INSERT INTO videos (id, title, thumbnail, author_id, language, views) VALUES (?, ?, ?, ?, ?, ?)");
  mockVideos.forEach(v => insertVideo.run(...v));
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/videos", (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 8;
    const offset = (page - 1) * limit;
    
    // In a real app, we'd have more data. Here we'll just return mock data repeatedly for infinite scroll demo
    const videos = db.prepare("SELECT * FROM videos ORDER BY timestamp DESC LIMIT ? OFFSET ?").all(limit, offset);
    res.json(videos);
  });

  app.post("/api/login", (req, res) => {
    const { email, username } = req.body;
    const id = Buffer.from(email).toString('base64');
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    
    if (!user) {
      db.prepare("INSERT INTO users (id, username, email, avatar) VALUES (?, ?, ?, ?)").run(
        id, username, email, `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
      );
      
      // Create a default global group for new users
      const globalGroupId = 'global-dev-chat';
      const existingGroup = db.prepare("SELECT * FROM conversations WHERE id = ?").get(globalGroupId);
      if (!existingGroup) {
        db.prepare("INSERT INTO conversations (id, name, is_group) VALUES (?, ?, ?)").run(globalGroupId, 'Global Dev Chat', 1);
      }
      db.prepare("INSERT OR IGNORE INTO conversation_members (conversation_id, user_id) VALUES (?, ?)").run(globalGroupId, id);
    }
    
    const finalUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    res.json(finalUser);
  });

  app.get("/api/users", (req, res) => {
    const users = db.prepare("SELECT id, username, avatar, coders_count FROM users").all();
    res.json(users);
  });

  app.get("/api/conversations/:userId", (req, res) => {
    const { userId } = req.params;
    const conversations = db.prepare(`
      SELECT c.*, 
      (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY timestamp DESC LIMIT 1) as last_message
      FROM conversations c
      JOIN conversation_members cm ON c.id = cm.conversation_id
      WHERE cm.user_id = ?
    `).all(userId);
    res.json(conversations);
  });

  app.get("/api/messages/:conversationId", (req, res) => {
    const { conversationId } = req.params;
    const messages = db.prepare("SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC").all(conversationId);
    res.json(messages);
  });

  app.post("/api/conversations", (req, res) => {
    const { name, is_group, members } = req.body;
    const id = Math.random().toString(36).substring(7);
    db.prepare("INSERT INTO conversations (id, name, is_group) VALUES (?, ?, ?)").run(id, name, is_group ? 1 : 0);
    
    const stmt = db.prepare("INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?)");
    members.forEach((userId: string) => stmt.run(id, userId));
    
    res.json({ id, name, is_group });
  });

  app.get("/api/internship/progress/:userId", (req, res) => {
    const { userId } = req.params;
    const progress = db.prepare("SELECT * FROM internship_progress WHERE user_id = ?").all(userId);
    res.json(progress);
  });

  app.post("/api/internship/progress", (req, res) => {
    const { user_id, week_number, completed, test_score } = req.body;
    db.prepare(`
      INSERT INTO internship_progress (user_id, week_number, completed, test_score)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, week_number) DO UPDATE SET
        completed = excluded.completed,
        test_score = COALESCE(excluded.test_score, test_score)
    `).run(user_id, week_number, completed ? 1 : 0, test_score);
    res.json({ status: "ok" });
  });

  // Socket.io logic
  io.on("connection", (socket) => {
    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("send_message", (data) => {
      const { conversation_id, sender_id, content } = data;
      db.prepare("INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)").run(
        conversation_id, sender_id, content
      );
      io.to(conversation_id).emit("receive_message", {
        ...data,
        timestamp: new Date().toISOString()
      });
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist/index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

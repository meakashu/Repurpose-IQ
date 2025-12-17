import db from '../database/db.js';

export class ConversationService {
  static createConversation(userId, title = null) {
    const timestamp = new Date().toISOString();
    const defaultTitle = title || `Chat ${new Date().toLocaleDateString()}`;
    
    const result = db.prepare(`
      INSERT INTO conversations (user_id, title, created_at, updated_at)
      VALUES (?, ?, ?, ?)
    `).run(userId, defaultTitle, timestamp, timestamp);
    
    return result.lastInsertRowid;
  }

  static addMessage(conversationId, role, content, agentsUsed = []) {
    const timestamp = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO messages (conversation_id, role, content, agents, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(conversationId, role, content, JSON.stringify(agentsUsed), timestamp);
    
    // Update conversation title from first user message
    const conv = db.prepare('SELECT title FROM conversations WHERE id = ?').get(conversationId);
    if (conv && conv.title.startsWith('Chat ') && role === 'user') {
      const newTitle = content.substring(0, 50) + (content.length > 50 ? '...' : '');
      db.prepare('UPDATE conversations SET title = ?, updated_at = ? WHERE id = ?')
        .run(newTitle, timestamp, conversationId);
    }
  }

  static getUserConversations(userId, limit = 10) {
    return db.prepare(`
      SELECT id, title, created_at, updated_at
      FROM conversations
      WHERE user_id = ?
      ORDER BY updated_at DESC
      LIMIT ?
    `).all(userId, limit);
  }

  static getConversation(conversationId) {
    const conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(conversationId);
    if (!conv) return null;

    const messages = db.prepare(`
      SELECT role, content, agents, created_at
      FROM messages
      WHERE conversation_id = ?
      ORDER BY created_at ASC
    `).all(conversationId);

    return {
      id: conv.id,
      title: conv.title,
      created_at: conv.created_at,
      updated_at: conv.updated_at,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
        agents: m.agents ? JSON.parse(m.agents) : []
      }))
    };
  }
}


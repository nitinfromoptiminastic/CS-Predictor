import { AuditLog } from '@/types';

// In a production environment, this would be stored in a database
// For now, we'll use in-memory storage (will be lost on restart)
const auditLogs: AuditLog[] = [];

export class AuditService {
  static async logAction(
    userId: string,
    userEmail: string,
    action: string,
    platforms: string[],
    fileName?: string,
    fileType?: string
  ): Promise<void> {
    const log: AuditLog = {
      id: crypto.randomUUID(),
      userId,
      userEmail,
      action,
      timestamp: new Date(),
      platforms,
      fileName,
      fileType,
    };

    auditLogs.push(log);
    
    // In production, save to database
    console.log('Audit log:', log);
  }

  static async getLogs(limit = 100): Promise<AuditLog[]> {
    return auditLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  static async getLogsByUser(userId: string, limit = 50): Promise<AuditLog[]> {
    return auditLogs
      .filter(log => log.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

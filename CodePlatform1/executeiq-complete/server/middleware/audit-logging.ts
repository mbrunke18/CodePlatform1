import type { Request, Response, NextFunction } from 'express';

interface AuditLog {
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  userAgent?: string;
  ip: string;
  userId?: string;
  requestId: string;
  requestSize?: number;
  responseSize?: number;
}

export function auditLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  // Add request ID to headers
  req.headers['x-request-id'] = requestId;
  
  // Capture response details
  const originalSend = res.send;
  let responseSize = 0;
  
  res.send = function(body: any) {
    responseSize = Buffer.byteLength(body || '', 'utf8');
    return originalSend.call(this, body);
  };

  // Log on response finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    const auditLog: AuditLog = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress || 'unknown',
      userId: (req as any).user?.id || 'anonymous',
      requestId,
      requestSize: req.get('Content-Length') ? parseInt(req.get('Content-Length') || '0') : undefined,
      responseSize,
    };

    // Enterprise-grade audit logging
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(auditLog));
    } else {
      // Development logging - shorter format
      const logLine = `[AUDIT] ${req.method} ${req.path} ${res.statusCode} in ${duration}ms (${requestId})`;
      console.log(logLine);
    }
  });

  next();
}
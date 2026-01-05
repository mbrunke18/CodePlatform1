/**
 * Raw Body Parser Middleware
 * Captures raw request body for webhook signature verification
 * Must be applied BEFORE express.json() middleware
 */

import type { Request, Response, NextFunction } from 'express';

export function rawBodyParser(req: Request, res: Response, next: NextFunction) {
  // Only capture raw body for webhook endpoints
  if (!req.path.startsWith('/api/webhooks/')) {
    return next();
  }

  const chunks: Buffer[] = [];

  req.on('data', (chunk: Buffer) => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    const rawBody = Buffer.concat(chunks);
    
    // Store raw body for signature verification
    (req as any).rawBody = rawBody.toString('utf8');
    
    // Parse JSON if content-type is application/json
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('application/json')) {
      try {
        req.body = JSON.parse((req as any).rawBody);
      } catch (error) {
        console.error('Failed to parse JSON body:', error);
        req.body = {};
      }
    }
    // Parse XML if content-type is text/xml or application/xml
    else if (contentType.includes('xml')) {
      req.body = {
        _raw: (req as any).rawBody,
        _contentType: contentType
      };
    }
    
    next();
  });

  req.on('error', (error) => {
    console.error('Error reading request body:', error);
    next(error);
  });
}

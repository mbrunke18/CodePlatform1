import { WebSocketServer, WebSocket } from 'ws';
import pino from 'pino';
import { nanoid } from 'nanoid';

const logger = pino({ name: 'collaboration-service' });

export interface CollaborationUser {
  id: string;
  username: string;
  email?: string;
  role: 'facilitator' | 'participant' | 'observer';
  joinedAt: Date;
}

export interface DecisionRoom {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  facilitatorId: string;
  status: 'planning' | 'active' | 'voting' | 'concluded';
  createdAt: Date;
  participantCount: number;
  currentPhase?: {
    name: string;
    description: string;
    timeLimit?: number;
    startedAt: Date;
  };
  decisions: DecisionItem[];
}

export interface DecisionItem {
  id: string;
  title: string;
  description?: string;
  options: DecisionOption[];
  votes: Vote[];
  status: 'discussing' | 'voting' | 'decided';
  createdAt: Date;
  decidedAt?: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface DecisionOption {
  id: string;
  text: string;
  description?: string;
  proposedBy: string;
  supportCount: number;
  riskAssessment?: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
}

export interface Vote {
  id: string;
  userId: string;
  optionId: string;
  confidence: number; // 1-10 scale
  comment?: string;
  votedAt: Date;
}

export interface CollaborationMessage {
  type: 'room_update' | 'user_joined' | 'user_left' | 'decision_created' | 'vote_cast' | 'phase_changed' | 'chat_message' | 'room_closed';
  roomId: string;
  userId?: string;
  timestamp: Date;
  data: any;
}

export class CollaborationService {
  private static instance: CollaborationService;
  private rooms: Map<string, DecisionRoom> = new Map();
  private userConnections: Map<string, { ws: WebSocket; user: CollaborationUser; roomId: string }[]> = new Map();
  private roomConnections: Map<string, Set<WebSocket>> = new Map();

  public static getInstance(): CollaborationService {
    if (!CollaborationService.instance) {
      CollaborationService.instance = new CollaborationService();
    }
    return CollaborationService.instance;
  }

  /**
   * Setup WebSocket server with collaboration features
   */
  setupWebSocketServer(wss: WebSocketServer): void {
    wss.on('connection', (ws: WebSocket) => {
      logger.info('New WebSocket connection established');

      ws.on('message', async (message: Buffer) => {
        try {
          const data = JSON.parse(message.toString());
          await this.handleWebSocketMessage(ws, data);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          logger.error({ error: errorMessage }, 'Error handling WebSocket message');
          ws.send(JSON.stringify({ 
            type: 'error', 
            message: 'Invalid message format' 
          }));
        }
      });

      ws.on('close', () => {
        this.handleUserDisconnect(ws);
        logger.info('WebSocket connection closed');
      });

      ws.on('error', (error) => {
        logger.error({ error: error.message }, 'WebSocket connection error');
      });
    });
  }

  /**
   * Handle incoming WebSocket messages
   */
  private async handleWebSocketMessage(ws: WebSocket, data: any): Promise<void> {
    switch (data.type) {
      case 'join_room':
        await this.handleJoinRoom(ws, data);
        break;
      case 'leave_room':
        await this.handleLeaveRoom(ws, data);
        break;
      case 'create_decision':
        await this.handleCreateDecision(ws, data);
        break;
      case 'cast_vote':
        await this.handleCastVote(ws, data);
        break;
      case 'change_phase':
        await this.handleChangePhase(ws, data);
        break;
      case 'chat_message':
        await this.handleChatMessage(ws, data);
        break;
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong' }));
        break;
      default:
        logger.warn({ messageType: data.type }, 'Unknown WebSocket message type');
    }
  }

  /**
   * Create a new decision room
   */
  async createRoom(room: Omit<DecisionRoom, 'id' | 'createdAt' | 'participantCount' | 'decisions'>): Promise<DecisionRoom> {
    const newRoom: DecisionRoom = {
      ...room,
      id: nanoid(),
      createdAt: new Date(),
      participantCount: 0,
      decisions: []
    };

    this.rooms.set(newRoom.id, newRoom);
    this.roomConnections.set(newRoom.id, new Set());

    logger.info({ roomId: newRoom.id, name: newRoom.name }, 'Created new decision room');
    return newRoom;
  }

  /**
   * Get room by ID
   */
  getRoom(roomId: string): DecisionRoom | undefined {
    return this.rooms.get(roomId);
  }

  /**
   * Get all rooms for an organization
   */
  getRoomsByOrganization(organizationId: string): DecisionRoom[] {
    return Array.from(this.rooms.values())
      .filter(room => room.organizationId === organizationId);
  }

  /**
   * Handle user joining a room
   */
  private async handleJoinRoom(ws: WebSocket, data: { roomId: string; user: CollaborationUser }): Promise<void> {
    const { roomId, user } = data;
    const room = this.rooms.get(roomId);

    if (!room) {
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'Room not found' 
      }));
      return;
    }

    // Add user to room connections
    if (!this.userConnections.has(user.id)) {
      this.userConnections.set(user.id, []);
    }
    
    this.userConnections.get(user.id)!.push({ ws, user, roomId });
    this.roomConnections.get(roomId)!.add(ws);
    
    // Update room participant count
    room.participantCount = this.roomConnections.get(roomId)!.size;

    // Notify user of successful join
    ws.send(JSON.stringify({
      type: 'room_joined',
      room: room,
      message: `Welcome to ${room.name}`
    }));

    // Broadcast user joined to other room participants
    this.broadcastToRoom(roomId, {
      type: 'user_joined',
      roomId,
      userId: user.id,
      timestamp: new Date(),
      data: { user, participantCount: room.participantCount }
    }, ws);

    logger.info({ roomId, userId: user.id, username: user.username }, 'User joined room');
  }

  /**
   * Handle user leaving a room
   */
  private async handleLeaveRoom(ws: WebSocket, data: { roomId: string; userId: string }): Promise<void> {
    const { roomId, userId } = data;
    await this.removeUserFromRoom(ws, roomId, userId);
  }

  /**
   * Handle creating a new decision
   */
  private async handleCreateDecision(ws: WebSocket, data: { roomId: string; decision: Omit<DecisionItem, 'id' | 'votes' | 'createdAt'> }): Promise<void> {
    const { roomId, decision } = data;
    const room = this.rooms.get(roomId);

    if (!room) {
      ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
      return;
    }

    const newDecision: DecisionItem = {
      ...decision,
      id: nanoid(),
      votes: [],
      createdAt: new Date()
    };

    room.decisions.push(newDecision);

    // Broadcast decision creation to room
    this.broadcastToRoom(roomId, {
      type: 'decision_created',
      roomId,
      timestamp: new Date(),
      data: { decision: newDecision }
    });

    logger.info({ roomId, decisionId: newDecision.id, title: newDecision.title }, 'Created new decision');
  }

  /**
   * Handle vote casting
   */
  private async handleCastVote(ws: WebSocket, data: { roomId: string; decisionId: string; vote: Omit<Vote, 'id' | 'votedAt'> }): Promise<void> {
    const { roomId, decisionId, vote } = data;
    const room = this.rooms.get(roomId);

    if (!room) {
      ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
      return;
    }

    const decision = room.decisions.find(d => d.id === decisionId);
    if (!decision) {
      ws.send(JSON.stringify({ type: 'error', message: 'Decision not found' }));
      return;
    }

    // Remove existing vote from same user
    decision.votes = decision.votes.filter(v => v.userId !== vote.userId);

    // Add new vote
    const newVote: Vote = {
      ...vote,
      id: nanoid(),
      votedAt: new Date()
    };
    decision.votes.push(newVote);

    // Update option support count
    const option = decision.options.find(o => o.id === vote.optionId);
    if (option) {
      option.supportCount = decision.votes.filter(v => v.optionId === vote.optionId).length;
    }

    // Broadcast vote to room
    this.broadcastToRoom(roomId, {
      type: 'vote_cast',
      roomId,
      userId: vote.userId,
      timestamp: new Date(),
      data: { decisionId, vote: newVote, totalVotes: decision.votes.length }
    });

    logger.info({ roomId, decisionId, userId: vote.userId, optionId: vote.optionId }, 'Vote cast');
  }

  /**
   * Handle phase change
   */
  private async handleChangePhase(ws: WebSocket, data: { roomId: string; phase: DecisionRoom['currentPhase'] }): Promise<void> {
    const { roomId, phase } = data;
    const room = this.rooms.get(roomId);

    if (!room) {
      ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
      return;
    }

    room.currentPhase = phase;

    this.broadcastToRoom(roomId, {
      type: 'phase_changed',
      roomId,
      timestamp: new Date(),
      data: { phase }
    });

    logger.info({ roomId, phaseName: phase?.name }, 'Room phase changed');
  }

  /**
   * Handle chat messages
   */
  private async handleChatMessage(ws: WebSocket, data: { roomId: string; userId: string; message: string }): Promise<void> {
    const { roomId, userId, message } = data;
    
    this.broadcastToRoom(roomId, {
      type: 'chat_message',
      roomId,
      userId,
      timestamp: new Date(),
      data: { message }
    });
  }

  /**
   * Remove user from room on disconnect
   */
  private async removeUserFromRoom(ws: WebSocket, roomId: string, userId: string): Promise<void> {
    const roomConnections = this.roomConnections.get(roomId);
    if (roomConnections) {
      roomConnections.delete(ws);
      
      const room = this.rooms.get(roomId);
      if (room) {
        room.participantCount = roomConnections.size;
        
        // Broadcast user left
        this.broadcastToRoom(roomId, {
          type: 'user_left',
          roomId,
          userId,
          timestamp: new Date(),
          data: { participantCount: room.participantCount }
        }, ws);
      }
    }

    // Remove from user connections
    const userConnections = this.userConnections.get(userId);
    if (userConnections) {
      const connectionIndex = userConnections.findIndex(conn => conn.ws === ws && conn.roomId === roomId);
      if (connectionIndex >= 0) {
        userConnections.splice(connectionIndex, 1);
      }
    }
  }

  /**
   * Handle user disconnect from WebSocket
   */
  private handleUserDisconnect(ws: WebSocket): void {
    for (const [userId, connections] of Array.from(this.userConnections.entries())) {
      for (let i = connections.length - 1; i >= 0; i--) {
        if (connections[i].ws === ws) {
          const connection = connections[i];
          this.removeUserFromRoom(ws, connection.roomId, userId);
          connections.splice(i, 1);
        }
      }
      
      if (connections.length === 0) {
        this.userConnections.delete(userId);
      }
    }
  }

  /**
   * Broadcast message to all users in a room
   */
  private broadcastToRoom(roomId: string, message: CollaborationMessage, excludeWs?: WebSocket): void {
    const connections = this.roomConnections.get(roomId);
    if (!connections) return;

    const messageString = JSON.stringify(message);
    
    connections.forEach(ws => {
      if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(messageString);
        } catch (error) {
          logger.error({ error: error instanceof Error ? error.message : 'Unknown error', roomId }, 'Error broadcasting message');
        }
      }
    });
  }

  /**
   * Get room statistics
   */
  getRoomStatistics(roomId: string): {
    participantCount: number;
    activeDecisions: number;
    completedDecisions: number;
    totalVotes: number;
    roomStatus: string;
  } | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const activeDecisions = room.decisions.filter(d => d.status !== 'decided').length;
    const completedDecisions = room.decisions.filter(d => d.status === 'decided').length;
    const totalVotes = room.decisions.reduce((sum, d) => sum + d.votes.length, 0);

    return {
      participantCount: room.participantCount,
      activeDecisions,
      completedDecisions,
      totalVotes,
      roomStatus: room.status
    };
  }

  /**
   * Close a decision room
   */
  async closeRoom(roomId: string): Promise<boolean> {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    // Notify all participants
    this.broadcastToRoom(roomId, {
      type: 'room_closed',
      roomId,
      timestamp: new Date(),
      data: { message: 'This decision room has been closed' }
    });

    // Close all connections
    const connections = this.roomConnections.get(roomId);
    if (connections) {
      connections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      });
    }

    // Clean up
    this.rooms.delete(roomId);
    this.roomConnections.delete(roomId);

    logger.info({ roomId, name: room.name }, 'Decision room closed');
    return true;
  }
}

export const collaborationService = CollaborationService.getInstance();
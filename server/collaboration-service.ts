import { Server as SocketIOServer, Socket } from 'socket.io';
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
  confidence: number;
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
  private userConnections: Map<string, { socket: Socket; user: CollaborationUser; roomId: string }[]> = new Map();
  private roomConnections: Map<string, Set<Socket>> = new Map();
  private io: SocketIOServer | null = null;

  public static getInstance(): CollaborationService {
    if (!CollaborationService.instance) {
      CollaborationService.instance = new CollaborationService();
    }
    return CollaborationService.instance;
  }

  setupSocketIOHandlers(io: SocketIOServer): void {
    this.io = io;
    
    io.on('connection', (socket: Socket) => {
      logger.info({ socketId: socket.id }, 'Collaboration client connected');

      socket.on('collab:join_room', (data) => this.handleJoinRoom(socket, data));
      socket.on('collab:leave_room', (data) => this.handleLeaveRoom(socket, data));
      socket.on('collab:create_decision', (data) => this.handleCreateDecision(socket, data));
      socket.on('collab:cast_vote', (data) => this.handleCastVote(socket, data));
      socket.on('collab:change_phase', (data) => this.handleChangePhase(socket, data));
      socket.on('collab:chat_message', (data) => this.handleChatMessage(socket, data));
      socket.on('collab:ping', () => socket.emit('collab:pong'));

      socket.on('disconnect', () => {
        this.handleUserDisconnect(socket);
        logger.info({ socketId: socket.id }, 'Collaboration client disconnected');
      });
    });

    logger.info('Collaboration handlers registered with Socket.IO');
  }

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

  getRoom(roomId: string): DecisionRoom | undefined {
    return this.rooms.get(roomId);
  }

  getRoomsByOrganization(organizationId: string): DecisionRoom[] {
    return Array.from(this.rooms.values())
      .filter(room => room.organizationId === organizationId);
  }

  private async handleJoinRoom(socket: Socket, data: { roomId: string; user: CollaborationUser }): Promise<void> {
    const { roomId, user } = data;
    const room = this.rooms.get(roomId);

    if (!room) {
      socket.emit('collab:error', { message: 'Room not found' });
      return;
    }

    if (!this.userConnections.has(user.id)) {
      this.userConnections.set(user.id, []);
    }
    
    this.userConnections.get(user.id)!.push({ socket, user, roomId });
    this.roomConnections.get(roomId)!.add(socket);
    
    socket.join(`collab-room-${roomId}`);
    room.participantCount = this.roomConnections.get(roomId)!.size;

    socket.emit('collab:room_joined', {
      room: room,
      message: `Welcome to ${room.name}`
    });

    this.broadcastToRoom(roomId, {
      type: 'user_joined',
      roomId,
      userId: user.id,
      timestamp: new Date(),
      data: { user, participantCount: room.participantCount }
    }, socket);

    logger.info({ roomId, userId: user.id, username: user.username }, 'User joined room');
  }

  private async handleLeaveRoom(socket: Socket, data: { roomId: string; userId: string }): Promise<void> {
    const { roomId, userId } = data;
    await this.removeUserFromRoom(socket, roomId, userId);
  }

  private async handleCreateDecision(socket: Socket, data: { roomId: string; decision: Omit<DecisionItem, 'id' | 'votes' | 'createdAt'> }): Promise<void> {
    const { roomId, decision } = data;
    const room = this.rooms.get(roomId);

    if (!room) {
      socket.emit('collab:error', { message: 'Room not found' });
      return;
    }

    const newDecision: DecisionItem = {
      ...decision,
      id: nanoid(),
      votes: [],
      createdAt: new Date()
    };

    room.decisions.push(newDecision);

    this.broadcastToRoom(roomId, {
      type: 'decision_created',
      roomId,
      timestamp: new Date(),
      data: { decision: newDecision }
    });

    logger.info({ roomId, decisionId: newDecision.id, title: newDecision.title }, 'Created new decision');
  }

  private async handleCastVote(socket: Socket, data: { roomId: string; decisionId: string; vote: Omit<Vote, 'id' | 'votedAt'> }): Promise<void> {
    const { roomId, decisionId, vote } = data;
    const room = this.rooms.get(roomId);

    if (!room) {
      socket.emit('collab:error', { message: 'Room not found' });
      return;
    }

    const decision = room.decisions.find(d => d.id === decisionId);
    if (!decision) {
      socket.emit('collab:error', { message: 'Decision not found' });
      return;
    }

    decision.votes = decision.votes.filter(v => v.userId !== vote.userId);

    const newVote: Vote = {
      ...vote,
      id: nanoid(),
      votedAt: new Date()
    };
    decision.votes.push(newVote);

    const option = decision.options.find(o => o.id === vote.optionId);
    if (option) {
      option.supportCount = decision.votes.filter(v => v.optionId === vote.optionId).length;
    }

    this.broadcastToRoom(roomId, {
      type: 'vote_cast',
      roomId,
      userId: vote.userId,
      timestamp: new Date(),
      data: { decisionId, vote: newVote, totalVotes: decision.votes.length }
    });

    logger.info({ roomId, decisionId, userId: vote.userId, optionId: vote.optionId }, 'Vote cast');
  }

  private async handleChangePhase(socket: Socket, data: { roomId: string; phase: DecisionRoom['currentPhase'] }): Promise<void> {
    const { roomId, phase } = data;
    const room = this.rooms.get(roomId);

    if (!room) {
      socket.emit('collab:error', { message: 'Room not found' });
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

  private async handleChatMessage(socket: Socket, data: { roomId: string; userId: string; message: string }): Promise<void> {
    const { roomId, userId, message } = data;
    
    this.broadcastToRoom(roomId, {
      type: 'chat_message',
      roomId,
      userId,
      timestamp: new Date(),
      data: { message }
    });
  }

  private async removeUserFromRoom(socket: Socket, roomId: string, userId: string): Promise<void> {
    const roomConnections = this.roomConnections.get(roomId);
    if (roomConnections) {
      roomConnections.delete(socket);
      socket.leave(`collab-room-${roomId}`);
      
      const room = this.rooms.get(roomId);
      if (room) {
        room.participantCount = roomConnections.size;
        
        this.broadcastToRoom(roomId, {
          type: 'user_left',
          roomId,
          userId,
          timestamp: new Date(),
          data: { participantCount: room.participantCount }
        }, socket);
      }
    }

    const userConnections = this.userConnections.get(userId);
    if (userConnections) {
      const connectionIndex = userConnections.findIndex(conn => conn.socket === socket && conn.roomId === roomId);
      if (connectionIndex >= 0) {
        userConnections.splice(connectionIndex, 1);
      }
    }
  }

  private handleUserDisconnect(socket: Socket): void {
    for (const [userId, connections] of Array.from(this.userConnections.entries())) {
      for (let i = connections.length - 1; i >= 0; i--) {
        if (connections[i].socket === socket) {
          const connection = connections[i];
          this.removeUserFromRoom(socket, connection.roomId, userId);
          connections.splice(i, 1);
        }
      }
      
      if (connections.length === 0) {
        this.userConnections.delete(userId);
      }
    }
  }

  private broadcastToRoom(roomId: string, message: CollaborationMessage, excludeSocket?: Socket): void {
    if (!this.io) return;
    
    const roomName = `collab-room-${roomId}`;
    if (excludeSocket) {
      excludeSocket.to(roomName).emit(`collab:${message.type}`, message);
    } else {
      this.io.to(roomName).emit(`collab:${message.type}`, message);
    }
  }

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

  async closeRoom(roomId: string): Promise<boolean> {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    this.broadcastToRoom(roomId, {
      type: 'room_closed',
      roomId,
      timestamp: new Date(),
      data: { message: 'This decision room has been closed' }
    });

    const connections = this.roomConnections.get(roomId);
    if (connections) {
      connections.forEach(socket => {
        socket.leave(`collab-room-${roomId}`);
      });
    }

    this.rooms.delete(roomId);
    this.roomConnections.delete(roomId);

    logger.info({ roomId, name: room.name }, 'Decision room closed');
    return true;
  }
}

export const collaborationService = CollaborationService.getInstance();

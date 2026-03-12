import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  MessageSquare, 
  Video, 
  Share, 
  Bell,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  FileText,
  Calendar,
  Target,
  Zap,
  Edit,
  Send,
  Phone,
  Monitor,
  Globe,
  Link,
  Settings,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { BrandStamp } from "@/components/BrandStamp";

interface CollaborationSession {
  id: string;
  title: string;
  type: 'meeting' | 'planning' | 'crisis' | 'review';
  status: 'active' | 'scheduled' | 'completed';
  participants: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    status: 'online' | 'offline' | 'busy';
  }[];
  startTime: string;
  duration: string;
  description: string;
  agenda?: string[];
  decisions?: string[];
  actionItems?: {
    id: string;
    description: string;
    assignee: string;
    dueDate: string;
    status: 'pending' | 'in-progress' | 'completed';
  }[];
}

interface LiveUpdate {
  id: string;
  type: 'message' | 'decision' | 'action' | 'status' | 'alert';
  title: string;
  content: string;
  user: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  relatedTo?: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  avatar?: string;
  currentActivity?: string;
  timezone: string;
}

export default function RealTimeCollaboration({ embedded }: { embedded?: boolean }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collaborationSessions, setCollaborationSessions] = useState<CollaborationSession[]>([]);
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdate[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState(24);

  useEffect(() => {
    // Initialize collaboration data
    const sessions: CollaborationSession[] = [
      {
        id: 'session-001',
        title: 'Q2 Strategic Planning Review',
        type: 'planning',
        status: 'active',
        participants: [
          { id: '1', name: 'Chief Executive', role: 'CEO', status: 'online' },
          { id: '2', name: 'Chief Technology', role: 'CTO', status: 'online' },
          { id: '3', name: 'VP Strategy', role: 'VP Strategy', status: 'online' },
          { id: '4', name: 'Chief Financial', role: 'CFO', status: 'busy' }
        ],
        startTime: '2024-02-20 14:00',
        duration: '90 minutes',
        description: 'Review Q2 strategic initiatives and budget allocation decisions',
        agenda: [
          'Digital transformation progress review',
          'Market expansion strategy approval',
          'Budget reallocation for new initiatives',
          'Risk assessment and mitigation plans'
        ],
        decisions: [
          'Approved $2.5M budget for digital transformation Phase 2',
          'Greenlit market expansion into APAC region',
          'Established Q2 performance targets'
        ],
        actionItems: [
          {
            id: 'ai-001',
            description: 'Finalize APAC market entry timeline',
            assignee: 'VP Strategy',
            dueDate: '2024-02-25',
            status: 'in-progress'
          },
          {
            id: 'ai-002',
            description: 'Update digital transformation roadmap',
            assignee: 'Chief Technology Officer',
            dueDate: '2024-02-22',
            status: 'pending'
          }
        ]
      },
      {
        id: 'session-002',
        title: 'Crisis Response Coordination',
        type: 'crisis',
        status: 'active',
        participants: [
          { id: '5', name: 'Chief Operations', role: 'COO', status: 'online' },
          { id: '6', name: 'Communications Lead', role: 'Head of Communications', status: 'online' },
          { id: '7', name: 'General Counsel', role: 'Legal Counsel', status: 'online' }
        ],
        startTime: '2024-02-20 15:30',
        duration: '60 minutes',
        description: 'Coordinate response to supply chain disruption',
        agenda: [
          'Impact assessment review',
          'Communication strategy approval',
          'Alternative supplier activation',
          'Customer notification plan'
        ]
      },
      {
        id: 'session-003',
        title: 'Innovation Pipeline Review',
        type: 'review',
        status: 'scheduled',
        participants: [
          { id: '8', name: 'VP Innovation', role: 'VP Innovation', status: 'offline' },
          { id: '9', name: 'R&D Director', role: 'R&D Director', status: 'offline' }
        ],
        startTime: '2024-02-21 10:00',
        duration: '120 minutes',
        description: 'Monthly review of innovation projects and breakthrough opportunities'
      }
    ];

    const updates: LiveUpdate[] = [
      {
        id: 'update-001',
        type: 'decision',
        title: 'Strategic Decision Made',
        content: 'Approved $2.5M budget allocation for digital transformation Phase 2',
        user: 'Chief Executive Officer',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        priority: 'high',
        relatedTo: 'Q2 Strategic Planning'
      },
      {
        id: 'update-002',
        type: 'action',
        title: 'Action Item Created',
        content: 'Finalize APAC market entry timeline assigned to VP Strategy',
        user: 'System',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        priority: 'medium',
        relatedTo: 'Q2 Strategic Planning'
      },
      {
        id: 'update-003',
        type: 'alert',
        title: 'Crisis Response Activated',
        content: 'Supply chain disruption protocol initiated by Operations team',
        user: 'Chief Operations Officer',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        priority: 'urgent',
        relatedTo: 'Crisis Response'
      },
      {
        id: 'update-004',
        type: 'message',
        title: 'Team Communication',
        content: 'Digital transformation metrics show 45% completion rate - on track for Q2 targets',
        user: 'Chief Technology Officer',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        priority: 'low',
        relatedTo: 'Digital Transformation'
      }
    ];

    const team: TeamMember[] = [
      {
        id: 'tm-001',
        name: 'Chief Executive',
        role: 'Chief Executive Officer',
        department: 'Executive',
        status: 'online',
        currentActivity: 'Strategic Planning Session',
        timezone: 'PST'
      },
      {
        id: 'tm-002',
        name: 'Chief Technology',
        role: 'Chief Technology Officer',
        department: 'Technology',
        status: 'online',
        currentActivity: 'Digital Transformation Review',
        timezone: 'PST'
      },
      {
        id: 'tm-003',
        name: 'VP Strategy',
        role: 'VP Strategy',
        department: 'Strategy',
        status: 'busy',
        currentActivity: 'APAC Market Analysis',
        timezone: 'EST'
      },
      {
        id: 'tm-004',
        name: 'Chief Financial',
        role: 'Chief Financial Officer',
        department: 'Finance',
        status: 'online',
        currentActivity: 'Budget Review',
        timezone: 'CST'
      },
      {
        id: 'tm-005',
        name: 'Chief Operations',
        role: 'Chief Operating Officer',
        department: 'Operations',
        status: 'online',
        currentActivity: 'Crisis Response Coordination',
        timezone: 'PST'
      }
    ];

    setCollaborationSessions(sessions);
    setLiveUpdates(updates);
    setTeamMembers(team);

    // Simulate real-time updates
    const interval = setInterval(() => {
      // setActiveUsers(prev => prev + Math.floor(Math.random() * 6 - 3));
      
      // Add random live update
      if (false) {
        const newUpdate: LiveUpdate = {
          id: `update-${Date.now()}`,
          type: ['message', 'action', 'status'][Math.floor(Math.random() * 3)] as any,
          title: 'Live Update',
          content: 'Real-time collaboration activity detected',
          user: 'System',
          timestamp: new Date().toISOString(),
          priority: ['low', 'medium'][Math.floor(Math.random() * 2)] as any
        };
        
        setLiveUpdates(prev => [newUpdate, ...prev.slice(0, 9)]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-[#2B8A6E]';
      case 'busy': return 'bg-[#C9A84C]';
      case 'away': return 'bg-[#DFC178]';
      case 'offline': return 'bg-[#6B7280]';
      default: return 'bg-[#6B7280]';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'planning': return 'bg-[#0A0F2E]/20 text-[#0A0F2E] dark:text-[#C9A84C] border-[#0A0F2E]/30';
      case 'crisis': return 'bg-[#0A0F2E]/10 text-[#0A0F2E] dark:text-[#C9A84C] border-[#0A0F2E]/30';
      case 'meeting': return 'bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30';
      case 'review': return 'bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30';
      default: return 'bg-[#E8E4DC] text-[#6B7280] border-[#E8E4DC]';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-[#0A0F2E]/10 text-[#0A0F2E] dark:text-[#C9A84C] border-[#0A0F2E]/30';
      case 'high': return 'bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30';
      case 'medium': return 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20';
      case 'low': return 'bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30';
      default: return 'bg-[#E8E4DC] text-[#6B7280] border-[#E8E4DC]';
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: LiveUpdate = {
        id: `msg-${Date.now()}`,
        type: 'message',
        title: 'Team Message',
        content: newMessage,
        user: 'You',
        timestamp: new Date().toISOString(),
        priority: 'medium'
      };
      
      setLiveUpdates(prev => [message, ...prev]);
      setNewMessage('');
    }
  };

  return (
    <PageLayout embedded={embedded}>
      <div className="flex-1 bg-[#F8F7F4] dark:bg-[#0A0F2E] overflow-y-auto p-8 space-y-8">
        
        {/* Collaboration Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0A0F2E] dark:text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Real-Time Collaboration Center</h1>
            <p className="text-[#6B7280]">Enterprise-grade team coordination and live decision management</p>
          </div>
          <div className="flex items-center gap-4">
            <BrandStamp variant="dual" size="md" className="mb-8" />
            <Badge className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">
              <Activity className="w-4 h-4 mr-2" />
              {activeUsers} Active Users
            </Badge>
            <Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]">
              <Video className="w-4 h-4 mr-2" />
              Start Session
            </Button>
          </div>
        </div>

        {/* Live Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E] dark:text-white">Active Sessions</h3>
                <Users className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <div className="text-2xl font-bold text-[#0A0F2E] dark:text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{collaborationSessions.filter(s => s.status === 'active').length}</div>
              <div className="text-sm text-[#6B7280]">Live collaboration</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E] dark:text-white">Team Online</h3>
                <Activity className="h-5 w-5 text-[#2B8A6E]" />
              </div>
              <div className="text-2xl font-bold text-[#0A0F2E] dark:text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{teamMembers.filter(m => m.status === 'online').length}</div>
              <div className="text-sm text-[#6B7280]">Members available</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E] dark:text-white">Live Updates</h3>
                <Bell className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <div className="text-2xl font-bold text-[#0A0F2E] dark:text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{liveUpdates.length}</div>
              <div className="text-sm text-[#6B7280]">Recent activity</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0A0F2E] dark:text-white">Decisions Today</h3>
                <CheckCircle className="h-5 w-5 text-[#2B8A6E]" />
              </div>
              <div className="text-2xl font-bold text-[#0A0F2E] dark:text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>7</div>
              <div className="text-sm text-[#6B7280]">Executive decisions</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Collaboration Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-white/5 border border-[#E8E4DC] dark:border-white/10">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">Live Dashboard</TabsTrigger>
            <TabsTrigger value="sessions" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">Active Sessions</TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">Team Status</TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">Live Feed</TabsTrigger>
            <TabsTrigger value="decisions" className="data-[state=active]:bg-[#0A0F2E] data-[state=active]:text-white">Decision Tracking</TabsTrigger>
          </TabsList>

          {/* Live Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Real-Time Activity Feed */}
              <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
                <CardHeader>
                  <CardTitle className="text-[#0A0F2E] dark:text-white flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <Activity className="h-5 w-5 text-[#C9A84C]" />
                    Live Activity Stream
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                  {liveUpdates.slice(0, 8).map((update) => (
                    <div key={update.id} className="p-3 bg-[#F8F7F4] dark:bg-white/5 rounded-lg border border-[#E8E4DC] dark:border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(update.priority)}>
                            {update.priority.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-[#6B7280]">
                            {new Date(update.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-semibold text-[#0A0F2E] dark:text-white text-sm mb-1">{update.title}</h4>
                      <p className="text-[#0A0F2E]/80 dark:text-white/80 text-sm mb-2">{update.content}</p>
                      <div className="text-xs text-[#6B7280]">By: {update.user}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Communication */}
              <Card className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
                <CardHeader>
                  <CardTitle className="text-[#0A0F2E] dark:text-white flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <MessageSquare className="h-5 w-5 text-[#C9A84C]" />
                    Quick Communication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Send a message to the team..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="bg-[#F8F7F4] dark:bg-white/5 border-[#E8E4DC] dark:border-white/10 text-[#0A0F2E] dark:text-white"
                    />
                    <Button onClick={sendMessage} className="bg-[#0A0F2E] text-white hover:bg-[#141B45]">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button size="sm" className="bg-[#2B8A6E] text-white hover:bg-[#3BAF8A]">
                      <Video className="w-4 h-4 mr-2" />
                      Start Video Call
                    </Button>
                    <Button size="sm" className="bg-[#C9A84C] text-[#0A0F2E] font-bold hover:bg-[#DFC178]">
                      <Share className="w-4 h-4 mr-2" />
                      Share Screen
                    </Button>
                    <Button size="sm" className="bg-[#0A0F2E] text-white hover:bg-[#141B45]">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button size="sm" variant="outline" className="border-[#E8E4DC] text-[#0A0F2E] dark:text-white">
                      <FileText className="w-4 h-4 mr-2" />
                      Create Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Active Sessions */}
          <TabsContent value="sessions" className="space-y-6">
            <div className="space-y-4">
              {collaborationSessions.map((session) => (
                <Card key={session.id} className="bg-white dark:bg-white/5 border-[#E8E4DC] dark:border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-[#0A0F2E] dark:text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{session.title}</h3>
                          <Badge className={getTypeColor(session.type)}>
                            {session.type.toUpperCase()}
                          </Badge>
                          <Badge className={session.status === 'active' ? 'bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30' : 'bg-[#E8E4DC] text-[#6B7280] border-[#E8E4DC]'}>
                            {session.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-[#6B7280] mb-4">{session.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-[#6B7280]">Duration</div>
                        <div className="text-[#0A0F2E] dark:text-[#C9A84C] font-bold">{session.duration}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-[#0A0F2E] dark:text-white mb-2">Participants</h4>
                        <div className="space-y-2">
                          {session.participants.map((participant) => (
                            <div key={participant.id} className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-8 w-8 border border-[#E8E4DC]">
                                  <AvatarFallback className="bg-[#F8F7F4] text-[#0A0F2E] text-xs">
                                    {participant.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(participant.status)} rounded-full border border-white`} />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-[#0A0F2E] dark:text-white">{participant.name}</div>
                                <div className="text-xs text-[#6B7280]">{participant.role}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {session.agenda && (
                        <div>
                          <h4 className="font-semibold text-[#0A0F2E] dark:text-white mb-2">Agenda</h4>
                          <div className="space-y-1">
                            {session.agenda.map((item, index) => (
                              <div key={index} className="text-sm text-[#0A0F2E]/80 dark:text-white/80 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {session.decisions && (
                        <div>
                          <h4 className="font-semibold text-[#0A0F2E] dark:text-white mb-2">Decisions</h4>
                          <div className="space-y-1">
                            {session.decisions.map((decision, index) => (
                              <div key={index} className="text-sm text-[#0A0F2E]/80 dark:text-white/80 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-[#2B8A6E] flex-shrink-0" />
                                {decision}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-[#E8E4DC] dark:border-white/10 flex gap-3">
                      <Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45]">
                        <Video className="w-4 h-4 mr-2" />
                        Join Session
                      </Button>
                      <Button variant="outline" className="border-[#E8E4DC] text-[#0A0F2E] dark:text-white">
                        <FileText className="w-4 h-4 mr-2" />
                        View Notes
                      </Button>
                      <Button variant="outline" className="border-[#E8E4DC] text-[#0A0F2E] dark:text-white">
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Team Status */}
          <TabsContent value="team" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.id} className="bg-white border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gray-50 text-gray-900">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-gray-200`} />
                      </div>
                      <div className="flex-1 page-background">
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-800 dark:text-slate-200">{member.role}</p>
                        <Badge variant="outline" className="bg-transparent border-slate-600 text-gray-800 text-xs mt-1">
                          {member.department}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-800 dark:text-slate-200">Status:</span>
                        <span className="text-gray-900 capitalize">{member.status}</span>
                      </div>
                      {member.currentActivity && (
                        <div className="flex justify-between">
                          <span className="text-gray-800 dark:text-slate-200">Activity:</span>
                          <span className="text-gray-900 text-xs">{member.currentActivity}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-800 dark:text-slate-200">Timezone:</span>
                        <span className="text-gray-900">{member.timezone}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="flex-1 bg-[#0A0F2E] text-white hover:bg-[#141B45]">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline" className="bg-transparent border-[#E8E4DC] dark:border-white/10 text-[#0A0F2E] dark:text-white hover:bg-[#F8F7F4] dark:hover:bg-white/5">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="bg-transparent border-[#E8E4DC] dark:border-white/10 text-[#0A0F2E] dark:text-white hover:bg-[#F8F7F4] dark:hover:bg-white/5">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Live Feed */}
          <TabsContent value="messages" className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Live Communication Feed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="bg-[#F8F7F4] dark:bg-white/5 border-[#E8E4DC] dark:border-white/10 text-[#0A0F2E] dark:text-white"
                  />
                  <Button onClick={sendMessage} className="bg-[#0A0F2E] text-white hover:bg-[#141B45]">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {liveUpdates.map((update) => (
                    <div key={update.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 text-sm">{update.user}</span>
                          <Badge className={getPriorityColor(update.priority)}>
                            {update.priority}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-800 dark:text-slate-200">
                          {new Date(update.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-800 text-sm">{update.content}</p>
                      {update.relatedTo && (
                        <div className="mt-2">
                          <Badge variant="outline" className="bg-transparent border-slate-600 text-gray-800 dark:text-slate-200 text-xs">
                            Related to: {update.relatedTo}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Decision Tracking */}
          <TabsContent value="decisions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Today's Decisions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-[#F8F7F4] dark:bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#0A0F2E] dark:text-white font-medium">Digital Transformation Budget</span>
                      <Badge className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">APPROVED</Badge>
                    </div>
                    <p className="text-sm text-[#0A0F2E]/80 dark:text-white/80">$2.5M allocated for Phase 2 implementation</p>
                    <div className="text-xs text-[#6B7280] mt-1">Decided by: Chief Executive Officer</div>
                  </div>
                  
                  <div className="p-3 bg-[#F8F7F4] dark:bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#0A0F2E] dark:text-white font-medium">APAC Market Expansion</span>
                      <Badge className="bg-[#2B8A6E]/20 text-[#2B8A6E] border-[#2B8A6E]/30">APPROVED</Badge>
                    </div>
                    <p className="text-sm text-[#0A0F2E]/80 dark:text-white/80">Greenlit market entry strategy</p>
                    <div className="text-xs text-[#6B7280] mt-1">Decided by: VP Strategy</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Decisions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-[#F8F7F4] dark:bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#0A0F2E] dark:text-white font-medium">Q3 Hiring Plan</span>
                      <Badge className="bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30">PENDING</Badge>
                    </div>
                    <p className="text-sm text-[#0A0F2E]/80 dark:text-white/80">25 new positions across departments</p>
                    <div className="text-xs text-[#6B7280] mt-1">Assigned to: Chief Financial Officer</div>
                  </div>
                  
                  <div className="p-3 bg-[#F8F7F4] dark:bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#0A0F2E] dark:text-white font-medium">Office Expansion</span>
                      <Badge className="bg-[#0A0F2E]/20 text-[#0A0F2E] dark:text-[#C9A84C] border-[#0A0F2E]/30">REVIEW</Badge>
                    </div>
                    <p className="text-sm text-[#0A0F2E]/80 dark:text-white/80">Additional office space in Austin</p>
                    <div className="text-xs text-[#6B7280] mt-1">Assigned to: Chief Operations Officer</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
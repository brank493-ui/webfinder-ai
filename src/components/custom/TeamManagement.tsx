'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  UserPlus,
  Shield,
  Edit,
  Trash2,
  Mail,
  MoreHorizontal,
  Crown,
  Star,
  Eye,
  Settings,
  Globe,
  CreditCard,
  BarChart3,
  Briefcase,
  Loader2,
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'developer' | 'sales' | 'viewer';
  avatar?: string;
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
  lastActive: string;
  projects: number;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@webfinder.ai',
    role: 'owner',
    status: 'active',
    joinedAt: '2023-01-01',
    lastActive: '2 minutes ago',
    projects: 15,
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@webfinder.ai',
    role: 'admin',
    status: 'active',
    joinedAt: '2023-03-15',
    lastActive: '1 hour ago',
    projects: 8,
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@webfinder.ai',
    role: 'developer',
    status: 'active',
    joinedAt: '2023-06-20',
    lastActive: '3 hours ago',
    projects: 12,
  },
  {
    id: '4',
    name: 'Emily Brown',
    email: 'emily@webfinder.ai',
    role: 'sales',
    status: 'active',
    joinedAt: '2023-08-10',
    lastActive: '30 minutes ago',
    projects: 0,
  },
  {
    id: '5',
    name: 'Alex Johnson',
    email: 'alex@webfinder.ai',
    role: 'developer',
    status: 'pending',
    joinedAt: '2024-01-20',
    lastActive: 'Never',
    projects: 0,
  },
];

const rolePermissions: Record<TeamMember['role'], string[]> = {
  owner: ['All permissions'],
  admin: ['Manage team', 'Manage projects', 'View analytics', 'Manage billing'],
  developer: ['Create websites', 'Edit websites', 'Deploy websites', 'View projects'],
  sales: ['View leads', 'Create conversations', 'View analytics'],
  viewer: ['View projects', 'View analytics'],
};

const roleColors: Record<TeamMember['role'], string> = {
  owner: 'bg-purple-500',
  admin: 'bg-blue-500',
  developer: 'bg-green-500',
  sales: 'bg-orange-500',
  viewer: 'bg-gray-500',
};

export function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [newMember, setNewMember] = useState({
    email: '',
    role: 'developer' as TeamMember['role'],
    name: '',
  });

  const inviteMember = async () => {
    setInviting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const member: TeamMember = {
      id: `member_${Date.now()}`,
      name: newMember.name || newMember.email.split('@')[0],
      email: newMember.email,
      role: newMember.role,
      status: 'pending',
      joinedAt: new Date().toISOString().split('T')[0],
      lastActive: 'Never',
      projects: 0,
    };

    setTeamMembers([...teamMembers, member]);
    setInviting(false);
    setShowInviteModal(false);
    setNewMember({ email: '', role: 'developer', name: '' });
  };

  const removeMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const changeRole = (id: string, role: TeamMember['role']) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role } : m))
    );
  };

  const getRoleIcon = (role: TeamMember['role']) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'developer':
        return <Globe className="h-4 w-4" />;
      case 'sales':
        return <BarChart3 className="h-4 w-4" />;
      case 'viewer':
        return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Team Management
          </h2>
          <p className="text-muted-foreground">
            Manage your team members and their permissions
          </p>
        </div>
        <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to add a new team member
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  placeholder="Enter name"
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select
                  value={newMember.role}
                  onValueChange={(v) =>
                    setNewMember({ ...newMember, role: v as TeamMember['role'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Permissions:</p>
                <ul className="mt-2 space-y-1">
                  {rolePermissions[newMember.role].map((perm, i) => (
                    <li key={i} className="text-xs text-muted-foreground">
                      • {perm}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowInviteModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={inviteMember} disabled={inviting || !newMember.email}>
                {inviting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{teamMembers.length}</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {teamMembers.filter((m) => m.role === 'admin' || m.role === 'owner').length}
                </p>
                <p className="text-sm text-muted-foreground">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {teamMembers.filter((m) => m.role === 'developer').length}
                </p>
                <p className="text-sm text-muted-foreground">Developers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                <Mail className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {teamMembers.filter((m) => m.status === 'pending').length}
                </p>
                <p className="text-sm text-muted-foreground">Pending Invites</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.name}</p>
                      <Badge
                        className={`${roleColors[member.role]} text-white text-xs`}
                      >
                        {getRoleIcon(member.role)}
                        <span className="ml-1 capitalize">{member.role}</span>
                      </Badge>
                      {member.status === 'pending' && (
                        <Badge variant="secondary" className="text-xs">
                          Pending
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span>Joined: {member.joinedAt}</span>
                      <span>•</span>
                      <span>Last active: {member.lastActive}</span>
                      <span>•</span>
                      <span>{member.projects} projects</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {member.role !== 'owner' && (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Team Member</DialogTitle>
                            <DialogDescription>
                              Change role for {member.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4 space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Role</label>
                              <Select
                                value={member.role}
                                onValueChange={(v) => changeRole(member.id, v as TeamMember['role'])}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="developer">Developer</SelectItem>
                                  <SelectItem value="sales">Sales</SelectItem>
                                  <SelectItem value="viewer">Viewer</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                              <p className="text-sm font-medium">Permissions:</p>
                              <ul className="mt-2 space-y-1">
                                {rolePermissions[member.role].map((perm, i) => (
                                  <li key={i} className="text-xs text-muted-foreground">
                                    • {perm}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => removeMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Roles & Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Roles & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(rolePermissions).map(([role, permissions]) => (
              <div key={role} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className={`p-2 rounded-lg ${roleColors[role as TeamMember['role']]}`}>
                  {getRoleIcon(role as TeamMember['role'])}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium capitalize">{role}</p>
                    <Badge variant="outline" className="text-xs">
                      {teamMembers.filter((m) => m.role === role).length} members
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {permissions.map((perm, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { X, UserPlus } from 'lucide-react'
import { useActionTracking } from '@/hooks/useActionTracking'

interface TeamSetupProps {
  data: {
    team: {
      invites: Array<{
        email: string
        role: string
      }>
      roles: Record<string, any>
    }
    [key: string]: any
  }
  setData: React.Dispatch<React.SetStateAction<any>>
}

const roles = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full access to all features and settings'
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Can manage team members and access most features'
  },
  {
    id: 'member',
    name: 'Team Member',
    description: 'Basic access to features and content'
  }
]

export function TeamSetup({ data, setData }: TeamSetupProps) {
  const { trackAction } = useActionTracking()
  const [newInvite, setNewInvite] = useState({
    email: '',
    role: 'member'
  })

  const handleAddInvite = async () => {
    if (!newInvite.email) return

    setData(prev => ({
      ...prev,
      team: {
        ...prev.team,
        invites: [...prev.team.invites, { ...newInvite }]
      }
    }))

    await trackAction('setup_team_invite_add', {
      email: newInvite.email,
      role: newInvite.role
    })

    setNewInvite({
      email: '',
      role: 'member'
    })
  }

  const handleRemoveInvite = async (email: string) => {
    setData(prev => ({
      ...prev,
      team: {
        ...prev.team,
        invites: prev.team.invites.filter(invite => invite.email !== email)
      }
    }))

    await trackAction('setup_team_invite_remove', {
      email
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewInvite(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleRoleChange = (value: string) => {
    setNewInvite(prev => ({
      ...prev,
      role: value
    }))
  }

  return (
    <div className="space-y-8">
      <div>
        <Label>Invite Team Members</Label>
        <div className="mt-4 flex items-end space-x-4">
          <div className="flex-1">
            <Label htmlFor="email" className="sr-only">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="team@company.com"
              value={newInvite.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-48">
            <Select
              value={newInvite.role}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleAddInvite}
            disabled={!newInvite.email}
            className="flex-shrink-0"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {data.team.invites.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Pending Invites ({data.team.invites.length})
          </h3>
          <div className="space-y-3">
            {data.team.invites.map((invite, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{invite.email}</p>
                    <p className="text-sm text-gray-500">
                      {roles.find(r => r.id === invite.role)?.name}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveInvite(invite.email)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Available Roles</h3>
        <div className="space-y-4">
          {roles.map(role => (
            <div key={role.id} className="flex items-start">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{role.name}</p>
                <p className="text-sm text-gray-500">{role.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 
import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useActionTracking } from '@/hooks/useActionTracking'

interface AccountDetailsStepProps {
  formData: {
    email: string
    password: string
    [key: string]: string
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
}

export function AccountDetailsStep({ formData, setFormData }: AccountDetailsStepProps) {
  const { trackAction } = useActionTracking()

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'email') {
      await trackAction('registration_email_input', {
        valid: value.includes('@')
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          className="mt-1"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={formData.password}
          onChange={handleInputChange}
          className="mt-1"
          placeholder="••••••••"
        />
        <p className="mt-2 text-sm text-gray-500">
          Password must be at least 8 characters long
        </p>
      </div>
    </div>
  )
} 
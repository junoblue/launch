import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useActionTracking } from '@/hooks/useActionTracking'

interface CompanyInfoStepProps {
  formData: {
    companyName: string
    industry?: string
    size?: string
    [key: string]: string | undefined
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
}

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Other'
]

const companySizes = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+'
]

export function CompanyInfoStep({ formData, setFormData }: CompanyInfoStepProps) {
  const { trackAction } = useActionTracking()

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    await trackAction('registration_company_input', {
      field: name,
      value
    })
  }

  const handleSelectChange = async (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))

    await trackAction('registration_company_select', {
      field: name,
      value
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="companyName">Company name</Label>
        <Input
          id="companyName"
          name="companyName"
          type="text"
          required
          value={formData.companyName}
          onChange={handleInputChange}
          className="mt-1"
          placeholder="Acme Inc."
        />
      </div>

      <div>
        <Label htmlFor="industry">Industry</Label>
        <Select
          value={formData.industry}
          onValueChange={(value) => handleSelectChange('industry', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select an industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry.toLowerCase()}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="size">Company size</Label>
        <Select
          value={formData.size}
          onValueChange={(value) => handleSelectChange('size', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select company size" />
          </SelectTrigger>
          <SelectContent>
            {companySizes.map((size) => (
              <SelectItem key={size} value={size.toLowerCase()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 
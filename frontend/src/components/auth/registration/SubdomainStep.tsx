import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useActionTracking } from '@/hooks/useActionTracking'
import { tenantService } from '@/services/tenant/TenantService'

interface SubdomainStepProps {
  formData: {
    subdomain: string
    [key: string]: string
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
}

export function SubdomainStep({ formData, setFormData }: SubdomainStepProps) {
  const { trackAction } = useActionTracking()
  const [validationResult, setValidationResult] = useState<{
    valid: boolean
    reason?: string
  } | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    const validateSubdomain = async () => {
      if (!formData.subdomain) {
        setValidationResult(null)
        return
      }

      setIsChecking(true)
      try {
        const result = await tenantService.validateSubdomain(formData.subdomain)
        setValidationResult(result)

        await trackAction('registration_subdomain_validation', {
          subdomain: formData.subdomain,
          valid: result.valid,
          reason: result.reason
        })
      } catch (error) {
        console.error('Subdomain validation failed:', error)
        setValidationResult({
          valid: false,
          reason: 'Failed to validate subdomain'
        })
      } finally {
        setIsChecking(false)
      }
    }

    const debounceTimer = setTimeout(validateSubdomain, 500)
    return () => clearTimeout(debounceTimer)
  }, [formData.subdomain, trackAction])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    // Only allow lowercase letters, numbers, and hyphens
    const sanitizedValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }))
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="subdomain">Choose your subdomain</Label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <Input
            id="subdomain"
            name="subdomain"
            type="text"
            required
            value={formData.subdomain}
            onChange={handleInputChange}
            className={`rounded-none rounded-l-md ${
              validationResult?.valid ? 'border-green-500' : ''
            }`}
            placeholder="your-company"
          />
          <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            .tokyoflo.com
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          This will be your unique URL for accessing the platform
        </p>
      </div>

      {isChecking && (
        <p className="text-sm text-gray-500">Checking availability...</p>
      )}

      {validationResult && !isChecking && (
        <Alert variant={validationResult.valid ? "success" : "destructive"}>
          <AlertDescription>
            {validationResult.valid
              ? 'This subdomain is available!'
              : validationResult.reason}
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-900">Requirements:</h4>
        <ul className="mt-2 text-sm text-gray-500 list-disc list-inside">
          <li>Only lowercase letters, numbers, and hyphens allowed</li>
          <li>Must be between 3 and 63 characters long</li>
          <li>Cannot start or end with a hyphen</li>
          <li>Must be unique across all tenants</li>
        </ul>
      </div>
    </div>
  )
} 
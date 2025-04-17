import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useActionTracking } from '@/hooks/useActionTracking'
import { tenantService } from '@/services/tenant/TenantService'

interface RegistrationStep {
  title: string
  description: string
}

const steps: RegistrationStep[] = [
  {
    title: 'Account Details',
    description: 'Create your admin account'
  },
  {
    title: 'Company Information',
    description: 'Tell us about your company'
  },
  {
    title: 'Subdomain Selection',
    description: 'Choose your unique subdomain'
  },
  {
    title: 'Plan Selection',
    description: 'Choose your subscription plan'
  }
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const { trackAction } = useActionTracking()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    subdomain: '',
    plan: 'basic'
  })

  const handleNext = async () => {
    await trackAction('registration_step_complete', {
      step: currentStep,
      stepName: steps[currentStep].title
    })

    if (currentStep === steps.length - 1) {
      try {
        // Create tenant
        const tenant = await tenantService.createTenant(
          formData.companyName,
          formData.subdomain
        )

        await trackAction('registration_complete', {
          tenantUild: tenant.uild
        })

        // Redirect to setup wizard
        navigate(`/setup?tenant=${tenant.uild}`)
      } catch (error) {
        console.error('Registration failed:', error)
      }
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <AccountDetailsStep formData={formData} setFormData={setFormData} />
      case 1:
        return <CompanyInfoStep formData={formData} setFormData={setFormData} />
      case 2:
        return <SubdomainStep formData={formData} setFormData={setFormData} />
      case 3:
        return <PlanSelectionStep formData={formData} setFormData={setFormData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-8">
            <h3 className="text-lg font-medium">{steps[currentStep].title}</h3>
            <p className="text-sm text-gray-500">{steps[currentStep].description}</p>
          </div>

          {renderStep()}

          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
} 
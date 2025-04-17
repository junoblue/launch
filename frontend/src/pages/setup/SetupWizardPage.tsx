import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useActionTracking } from '@/hooks/useActionTracking'
import { tenantService } from '@/services/tenant/TenantService'
import { UILD } from '@/lib/uild'

interface SetupStep {
  id: string
  title: string
  description: string
  isRequired: boolean
}

const setupSteps: SetupStep[] = [
  {
    id: 'branding',
    title: 'Brand Settings',
    description: 'Configure your company branding and appearance',
    isRequired: true
  },
  {
    id: 'team',
    title: 'Team Setup',
    description: 'Invite your team members and set their roles',
    isRequired: true
  },
  {
    id: 'features',
    title: 'Feature Configuration',
    description: 'Enable and configure your selected features',
    isRequired: true
  },
  {
    id: 'integrations',
    title: 'Integrations',
    description: 'Set up your third-party integrations',
    isRequired: false
  }
]

export default function SetupWizardPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { trackAction } = useActionTracking()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [setupData, setSetupData] = useState({
    branding: {
      logo: '',
      colors: {
        primary: '#000000',
        secondary: '#ffffff'
      },
      theme: 'light'
    },
    team: {
      invites: [],
      roles: {}
    },
    features: {
      ecommerce: true,
      crm: true,
      erp: false,
      accounting: false
    },
    integrations: {
      stripe: false,
      google: false,
      slack: false
    }
  })

  useEffect(() => {
    const initializeSetup = async () => {
      const tenantUild = searchParams.get('tenant')
      if (!tenantUild || !UILD.isValid(tenantUild)) {
        navigate('/login')
        return
      }

      try {
        // Load tenant data
        const tenant = await tenantService.loadTenant(tenantUild)
        
        // Track setup wizard start
        await trackAction('setup_wizard_start', {
          tenantUild: tenant.uild
        })

        setIsLoading(false)
      } catch (error) {
        console.error('Failed to initialize setup:', error)
        navigate('/login')
      }
    }

    initializeSetup()
  }, [navigate, searchParams, trackAction])

  const handleNext = async () => {
    const currentStepData = setupSteps[currentStep]
    
    await trackAction('setup_step_complete', {
      step: currentStepData.id,
      isRequired: currentStepData.isRequired
    })

    if (currentStep === setupSteps.length - 1) {
      try {
        // Save all setup data
        await tenantService.updateTenantSettings(searchParams.get('tenant')!, {
          ...setupData
        })

        await trackAction('setup_complete')

        // Redirect to dashboard
        navigate('/')
      } catch (error) {
        console.error('Failed to complete setup:', error)
      }
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
  }

  const renderStep = () => {
    switch (setupSteps[currentStep].id) {
      case 'branding':
        return <BrandingSetup data={setupData} setData={setSetupData} />
      case 'team':
        return <TeamSetup data={setupData} setData={setSetupData} />
      case 'features':
        return <FeatureSetup data={setupData} setData={setSetupData} />
      case 'integrations':
        return <IntegrationSetup data={setupData} setData={setSetupData} />
      default:
        return null
    }
  }

  if (isLoading) {
    return <div>Loading setup wizard...</div>
  }

  const progress = ((currentStep + 1) / setupSteps.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Launch
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Let's get your workspace set up. This will only take a few minutes.
          </p>
        </div>

        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>Step {currentStep + 1} of {setupSteps.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </div>

        <Card className="bg-white shadow-sm rounded-lg">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-900">
              {setupSteps[currentStep].title}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {setupSteps[currentStep].description}
            </p>

            <div className="mt-8">
              {renderStep()}
            </div>

            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              <Button onClick={handleNext}>
                {currentStep === setupSteps.length - 1 ? 'Complete Setup' : 'Next Step'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 
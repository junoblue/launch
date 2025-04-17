import React from 'react'
import { Card } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Check } from 'lucide-react'
import { useActionTracking } from '@/hooks/useActionTracking'

interface PlanSelectionStepProps {
  formData: {
    plan: string
    [key: string]: string
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
}

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$49',
    features: [
      'Up to 5 users',
      'Basic eCommerce features',
      'Standard support',
      '5GB storage'
    ]
  },
  {
    id: 'pro',
    name: 'Professional',
    price: '$99',
    features: [
      'Up to 20 users',
      'Advanced eCommerce features',
      'Priority support',
      '20GB storage',
      'API access'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$299',
    features: [
      'Unlimited users',
      'Full feature access',
      '24/7 support',
      'Unlimited storage',
      'Custom integrations',
      'Dedicated account manager'
    ]
  }
]

export function PlanSelectionStep({ formData, setFormData }: PlanSelectionStepProps) {
  const { trackAction } = useActionTracking()

  const handlePlanChange = async (value: string) => {
    setFormData(prev => ({ ...prev, plan: value }))

    await trackAction('registration_plan_select', {
      plan: value
    })
  }

  return (
    <div className="space-y-6">
      <RadioGroup
        value={formData.plan}
        onValueChange={handlePlanChange}
        className="grid grid-cols-1 gap-4"
      >
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative p-6 cursor-pointer ${
              formData.plan === plan.id
                ? 'border-primary ring-2 ring-primary'
                : 'border-gray-200'
            }`}
          >
            <RadioGroupItem
              value={plan.id}
              id={plan.id}
              className="absolute right-4 top-4"
            />
            <div className="flex flex-col h-full">
              <div>
                <h3 className="text-lg font-medium">{plan.name}</h3>
                <p className="mt-1 text-2xl font-bold">{plan.price}</p>
                <p className="mt-1 text-sm text-gray-500">per month</p>
              </div>

              <div className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </RadioGroup>

      <p className="text-sm text-gray-500 mt-4">
        All plans include a 14-day free trial. No credit card required.
      </p>
    </div>
  )
} 
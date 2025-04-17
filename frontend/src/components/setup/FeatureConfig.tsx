import React from 'react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card } from '@/components/ui/card'
import { useActionTracking } from '@/hooks/useActionTracking'

interface FeatureConfigProps {
  data: {
    features: Record<string, boolean>
    plan: string
    [key: string]: any
  }
  setData: React.Dispatch<React.SetStateAction<any>>
}

const features = {
  basic: [
    {
      id: 'inventory',
      name: 'Inventory Management',
      description: 'Track and manage your product inventory'
    },
    {
      id: 'orders',
      name: 'Order Processing',
      description: 'Process and fulfill customer orders'
    },
    {
      id: 'customers',
      name: 'Customer Management',
      description: 'Manage customer information and history'
    }
  ],
  professional: [
    {
      id: 'analytics',
      name: 'Advanced Analytics',
      description: 'Detailed insights and reporting'
    },
    {
      id: 'automation',
      name: 'Workflow Automation',
      description: 'Automate repetitive tasks and processes'
    }
  ],
  enterprise: [
    {
      id: 'api',
      name: 'API Access',
      description: 'Integrate with external systems'
    },
    {
      id: 'customization',
      name: 'Advanced Customization',
      description: 'Customize features and workflows'
    }
  ]
}

export function FeatureConfig({ data, setData }: FeatureConfigProps) {
  const { trackAction } = useActionTracking()

  const handleFeatureToggle = async (featureId: string, enabled: boolean) => {
    setData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [featureId]: enabled
      }
    }))

    await trackAction('setup_feature_toggle', {
      feature: featureId,
      enabled
    })
  }

  const getAvailableFeatures = () => {
    switch (data.plan) {
      case 'enterprise':
        return [...features.basic, ...features.professional, ...features.enterprise]
      case 'professional':
        return [...features.basic, ...features.professional]
      default:
        return features.basic
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium text-gray-900">
          Configure Features
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Enable and configure the features you want to use. Available features are based on your selected plan.
        </p>
      </div>

      <div className="space-y-4">
        {getAvailableFeatures().map(feature => (
          <Card key={feature.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label
                  htmlFor={feature.id}
                  className="text-sm font-medium text-gray-900"
                >
                  {feature.name}
                </Label>
                <p className="text-sm text-gray-500">
                  {feature.description}
                </p>
              </div>
              <Switch
                id={feature.id}
                checked={data.features[feature.id] || false}
                onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked)}
              />
            </div>
          </Card>
        ))}
      </div>

      {data.plan === 'basic' && (
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Upgrade Available
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Upgrade to Professional or Enterprise plan to access additional features
                  like advanced analytics, automation, and API access.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useActionTracking } from '@/hooks/useActionTracking'

interface BrandingSetupProps {
  data: {
    branding: {
      logo: string
      colors: {
        primary: string
        secondary: string
      }
      theme: string
    }
    [key: string]: any
  }
  setData: React.Dispatch<React.SetStateAction<any>>
}

export function BrandingSetup({ data, setData }: BrandingSetupProps) {
  const { trackAction } = useActionTracking()

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real implementation, you would upload the file to your storage service
      // For now, we'll just use a placeholder URL
      const logoUrl = URL.createObjectURL(file)
      setData(prev => ({
        ...prev,
        branding: {
          ...prev.branding,
          logo: logoUrl
        }
      }))

      await trackAction('setup_branding_logo_upload', {
        fileName: file.name,
        fileSize: file.size
      })
    }
  }

  const handleColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        colors: {
          ...prev.branding.colors,
          [name]: value
        }
      }
    }))

    await trackAction('setup_branding_color_change', {
      color: name,
      value
    })
  }

  const handleThemeChange = async (value: string) => {
    setData(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        theme: value
      }
    }))

    await trackAction('setup_branding_theme_change', {
      theme: value
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <Label>Company Logo</Label>
        <div className="mt-2">
          <div className="flex items-center space-x-4">
            {data.branding.logo && (
              <img
                src={data.branding.logo}
                alt="Company logo"
                className="h-12 w-12 object-contain"
              />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="flex-1"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Recommended size: 512x512px. Max file size: 2MB.
          </p>
        </div>
      </div>

      <div>
        <Label>Brand Colors</Label>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="primary" className="text-sm">Primary Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                id="primary"
                name="primary"
                value={data.branding.colors.primary}
                onChange={handleColorChange}
                className="w-12 h-12 p-1"
              />
              <Input
                type="text"
                value={data.branding.colors.primary}
                onChange={handleColorChange}
                name="primary"
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="secondary" className="text-sm">Secondary Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                id="secondary"
                name="secondary"
                value={data.branding.colors.secondary}
                onChange={handleColorChange}
                className="w-12 h-12 p-1"
              />
              <Input
                type="text"
                value={data.branding.colors.secondary}
                onChange={handleColorChange}
                name="secondary"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label>Default Theme</Label>
        <RadioGroup
          value={data.branding.theme}
          onValueChange={handleThemeChange}
          className="mt-2"
        >
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System</Label>
            </div>
          </div>
        </RadioGroup>
        <p className="mt-2 text-sm text-gray-500">
          Users can override this setting in their preferences.
        </p>
      </div>
    </div>
  )
} 
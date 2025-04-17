import * as React from 'react'
import { UILD } from '@/lib/uild'
import { Frame } from '@/components/templates/Frame'

export default function CRMPage() {
  const pageUild = UILD.generate('page', { type: 'crm' })

  return (
    <Frame>
      <div data-uild={pageUild} className="p-6">
        <h1 className="text-2xl font-bold mb-6">CRM Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Contacts</h2>
            <p className="text-gray-600">Manage your customer contacts</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Leads</h2>
            <p className="text-gray-600">Track and convert sales leads</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Opportunities</h2>
            <p className="text-gray-600">Monitor sales pipeline</p>
          </div>
        </div>
      </div>
    </Frame>
  )
} 
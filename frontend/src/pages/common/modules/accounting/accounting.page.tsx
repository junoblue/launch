import * as React from 'react'
import { UILD } from '@/lib/uild'
import { Frame } from '@/components/templates/Frame'

export default function AccountingPage() {
  const pageUild = UILD.generate('page', { type: 'accounting' })

  return (
    <Frame>
      <div data-uild={pageUild} className="p-6">
        <h1 className="text-2xl font-bold mb-6">Accounting Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Transactions</h2>
            <p className="text-gray-600">View and manage transactions</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Reports</h2>
            <p className="text-gray-600">Generate financial reports</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Budgets</h2>
            <p className="text-gray-600">Track budgets and expenses</p>
          </div>
        </div>
      </div>
    </Frame>
  )
} 
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import AccountHead from '#models/account_head'
import AccountSubHead from '#models/account_sub_head'
import AccountName from '#models/account_name'

const heads = [
  { id: 1, slug: 'coa-assets-1', name: 'ASSETS' },
  { id: 2, slug: 'coa-liabilities-2', name: 'LIABILITIES' },
  { id: 3, slug: 'coa-equity-3', name: 'EQUITY' },
  { id: 4, slug: 'coa-revenue-4', name: 'REVENUE' },
  { id: 5, slug: 'coa-cogs-5', name: 'COST OF GOODS SOLD' },
  { id: 6, slug: 'coa-expenses-6', name: 'EXPENSES' },
]

const subHeads = [
  [1, 'Cash & Bank Balances'],
  [1, 'Accounts Receivable (Customers)'],
  [1, 'Pharmacy Inventory & Stock'],
  [1, 'Advances & Prepayments'],
  [1, 'Property, Plant & Equipment (Fixed Assets)'],
  [2, 'Accounts Payable (Suppliers / Distributors)'],
  [2, 'Accrued Expenses & Payables'],
  [2, 'Tax Payables (GST / WHT)'],
  [2, 'Short-Term Working Capital Financing'],
  [3, 'Owner / Shareholder Capital'],
  [3, 'Retained Earnings'],
  [3, 'Owner Drawings & Distributions'],
  [4, 'Counter & Retail Sales'],
  [4, 'Prescription Sales'],
  [4, 'Wholesale & Institutional Sales'],
  [4, 'Discounts & Sales Returns'],
  [5, 'Medicine & Stock Purchases'],
  [5, 'Freight Inward & Carriage'],
  [5, 'Purchase Discounts & Rebates'],
  [5, 'Inventory Damaged & Expired Write-Offs'],
  [6, 'Salaries, Wages & Benefits'],
  [6, 'Rent, Rates & Taxes'],
  [6, 'Utilities (Electricity, Water, Gas)'],
  [6, 'Office, IT & Software Subscriptions'],
  [6, 'Marketing, Packaging & Bags'],
  [6, 'Repair & Maintenance'],
] as const

const namesBySubHead: Record<string, string[]> = {
  '1:Cash & Bank Balances': [
    'Cash in Hand (Counter POS)',
    'Petty Cash Reserve',
    'HBL Operating A/c (1029384756)',
    'Meezan Collection A/c (9928374650)',
    'Standard Chartered Reserve (5544332211)',
  ],
  '1:Accounts Receivable (Customers)': [
    'Credit Customer Accounts',
    'Corporate & Insurance Receivables',
    'Online Delivery Aggregator Receivables',
  ],
  '1:Pharmacy Inventory & Stock': [
    'Prescription Medicines Stock',
    'OTC & General Healthcare Items',
    'Cold-Chain Refrigerated Inventory',
  ],
  '1:Advances & Prepayments': [
    'Advance Rent for Premises',
    'Supplier Advance Payments',
    'Prepaid Insurance',
  ],
  '1:Property, Plant & Equipment (Fixed Assets)': [
    'Pharmacy Racks, Counters & Furniture',
    'Refrigeration & Cold Storage Units',
    'POS Computers, Barcode Scanners & Printers',
    'Accumulated Depreciation',
  ],
  '6:Salaries, Wages & Benefits': [
    'Pharmacist Salaries',
    'Sales Staff & Counter Helpers',
    'Staff Overtime & Bonuses',
  ],
  '6:Rent, Rates & Taxes': [
    'Pharmacy Building Monthly Rent',
    'Commercial Property Tax',
  ],
}

export default class CoaSeeder extends BaseSeeder {
  async run() {
    for (const head of heads) {
      await AccountHead.updateOrCreate({ id: head.id }, { ...head, status: 'active' })
    }

    for (const [accountHeadId, name] of subHeads) {
      const subHead = await AccountSubHead.updateOrCreate(
        { accountHeadId, name },
        { accountHeadId, name, status: 'active' }
      )
      const names = namesBySubHead[`${accountHeadId}:${name}`] ?? []
      for (const accountName of names) {
        await AccountName.updateOrCreate(
          { accountSubHeadId: subHead.id, name: accountName },
          { accountSubHeadId: subHead.id, name: accountName, status: 'active' }
        )
      }
    }
  }
}

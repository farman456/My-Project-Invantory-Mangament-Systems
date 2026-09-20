export const STAFF_PERMISSION_CATALOG = [
  ['sales', 'sale_order'], ['sales', 'sale_invoice'], ['sales', 'delivery_voucher'], ['sales', 'sale_return'],
  ['purchase', 'purchase_order'], ['purchase', 'purchase_invoice'], ['purchase', 'purchase_return'],
  ['product', 'products'], ['product', 'stock_movement'], ['product', 'expiry_damage'], ['product', 'batch_holdings'], ['product', 'inventory_levels'],
  ['accounts', 'expenses'], ['accounts', 'salaries'], ['accounts', 'payments'], ['accounts', 'journals'],
  ['human_resource', 'staff'], ['human_resource', 'payroll'], ['human_resource', 'attendance'], ['human_resource', 'leaves'],
  ['reports', 'inventory'], ['reports', 'sales'], ['reports', 'compliance'], ['reports', 'purchase'], ['reports', 'financials'],
  ['configurations', 'customers'], ['configurations', 'suppliers'], ['configurations', 'manufacturers'], ['configurations', 'distributors'], ['configurations', 'categories'], ['configurations', 'types'], ['configurations', 'department_designation'], ['configurations', 'coa'],
  ['settings', 'general_settings'],
] as const

export const BASIC_STAFF_PERMISSIONS = [
  { module: 'human_resource', feature: 'attendance', accessType: 'view', compulsory: true },
  { module: 'human_resource', feature: 'leaves', accessType: 'view', compulsory: true },
  { module: 'human_resource', feature: 'loan_advance', accessType: 'view', compulsory: true },
] as const

export const STAFF_PERMISSION_ACCESS_TYPES = ['view', 'edit', 'delete', 'both'] as const

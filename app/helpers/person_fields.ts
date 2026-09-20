type PartyPayload = Record<string, unknown>

const fieldMap: Record<string, string> = {
  name: 'name',
  contactPerson: 'contact_person',
  phone: 'phone',
  email: 'email',
  areaCity: 'area_city',
  licenseNumber: 'license_number',
  licenseExpiryDate: 'license_expiry_date',
  taxNumber: 'tax_number',
  taxType: 'tax_type',
  taxStatus: 'tax_status',
  gstStatus: 'gst_status',
  isActive: 'is_active',
  alsoCustomer: 'also_customer',
  alsoSupplier: 'also_supplier',
  status: 'status',
  actions: 'actions',
}

export const toPersonData = (payload: PartyPayload) =>
  Object.fromEntries(
    Object.entries(fieldMap)
      .filter(([key]) => payload[key] !== undefined)
      .map(([key, column]) => [column, payload[key]])
  )

export const personConfigurationSelect = [
  'persons.license_number as licenseNumber',
  'persons.license_expiry_date as licenseExpiryDate',
  'persons.tax_number as taxNumber',
  'persons.tax_type as taxType',
  'persons.tax_status as taxStatus',
  'persons.gst_status as gstStatus',
  'persons.is_active as isActive',
  'persons.also_customer as alsoCustomer',
  'persons.also_supplier as alsoSupplier',
]

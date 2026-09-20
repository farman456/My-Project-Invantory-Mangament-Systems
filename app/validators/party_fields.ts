import vine from '@vinejs/vine'

export const partyFields = {
  name: vine.string().trim().minLength(1).maxLength(150),
  contactPerson: vine.string().trim().maxLength(150).optional(),
  phone: vine.string().trim().maxLength(30).optional(),
  email: vine.string().trim().email().maxLength(150).optional(),
  areaCity: vine.string().trim().maxLength(150).optional(),
  licenseNumber: vine.string().trim().maxLength(100).optional(),
  licenseExpiryDate: vine.string().trim().maxLength(20).optional(),
  taxNumber: vine.string().trim().maxLength(100).optional(),
  taxType: vine.enum(['Corporate', 'Individual', 'AOP']).optional(),
  taxStatus: vine.enum(['active', 'de-active']).optional(),
  gstStatus: vine.enum(['active', 'de-active', 'no-show']).optional(),
  isActive: vine.boolean().optional(),
  alsoCustomer: vine.boolean().optional(),
  alsoSupplier: vine.boolean().optional(),
  status: vine.string().trim().maxLength(20).optional(),
  actions: vine.string().trim().maxLength(50).optional(),
}

export const partyPatchFields = {
  name: partyFields.name.optional(),
  contactPerson: partyFields.contactPerson,
  phone: partyFields.phone,
  email: partyFields.email,
  areaCity: partyFields.areaCity,
  licenseNumber: partyFields.licenseNumber,
  licenseExpiryDate: partyFields.licenseExpiryDate,
  taxNumber: partyFields.taxNumber,
  taxType: partyFields.taxType,
  taxStatus: partyFields.taxStatus,
  gstStatus: partyFields.gstStatus,
  isActive: partyFields.isActive,
  alsoCustomer: partyFields.alsoCustomer,
  alsoSupplier: partyFields.alsoSupplier,
  status: partyFields.status,
  actions: partyFields.actions,
}

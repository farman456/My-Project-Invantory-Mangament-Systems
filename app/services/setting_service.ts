import Setting from '#models/setting'
import type { IdPreviewPayload, SettingsPayload, TestPrintPayload } from '#validators/setting_validator'

export const entities = [
  'products', 'categories', 'companies', 'vendors', 'distributors', 'manufacturers', 'productTypes',
  'saleInvoices', 'saleOrders', 'saleReturns', 'deliveryVouchers', 'purchaseInvoices', 'purchaseOrders', 'purchaseReturns',
] as const

const defaults = {
  businessInformation: { currency: 'PKR', language: 'en' },
  idConfigs: Object.fromEntries(entities.map((entity) => [entity, { prefix: '', infix: '-', digits: 4, paddingDigits: 4 }])),
  signStamps: {},
  warrantyTerms: { thermalPos: true, a4: true, a5: true },
  invoiceTemplates: { preset: 'default', headerTitle: '', subtitle: '', thankYouNote: '', themeAccentColor: '#000000', medicineColumns: [], hiddenMedicineColumns: [], columnOrder: [], layoutSectionOrder: [], sections: Object.fromEntries(Array.from({ length: 11 }, (_, index) => [String(index + 1), { enabled: true }])) },
  paperPrinters: { mappings: { posReceipt: { format: 'Thermal POS-80' }, salesTaxInvoice: { format: 'A4/A5' }, saleReturn: { format: 'Thermal POS-80' }, purchaseOrder: { format: 'A4/A5' }, purchaseInvoice: { format: 'A4/A5' }, deliveryVoucher: { format: 'A4/A5' }, barcodeLabels: { format: '50x25mm' } }, printers: [{ name: 'Thermal POS-80', type: 'thermal', connection: '', paper: 'Thermal POS-80', isDefault: false }, { name: 'Mini Thermal POS-58', type: 'thermal', connection: '', paper: 'Thermal POS-58', isDefault: false }, { name: 'Office Laser Jet A4/A5', type: 'laser', connection: '', paper: 'A4/A5', isDefault: false }, { name: 'Barcode & Sticker Printer 50x25mm', type: 'barcode', connection: '', paper: '50x25mm', isDefault: false }] },
}

const merge = (base: Record<string, any>, patch: Record<string, any>) => {
  const result = { ...base }
  for (const [key, value] of Object.entries(patch)) {
    result[key] = value && typeof value === 'object' && !Array.isArray(value) ? merge(base[key] ?? {}, value) : value
  }
  return result
}

export const getSettings = async () => {
  const current = await Setting.find(1)
  if (current) return current
  return Setting.create({ id: 1, ...defaults })
}

export const updateSettings = async (payload: SettingsPayload) => {
  const current = await getSettings()
  const data = {
    businessInformation: merge(merge(defaults.businessInformation, current.businessInformation), payload.businessInformation ?? {}),
    idConfigs: merge(merge(defaults.idConfigs, current.idConfigs), payload.idConfigs ?? {}),
    signStamps: merge(merge(defaults.signStamps, current.signStamps), payload.signStamps ?? {}),
    warrantyTerms: merge(merge(defaults.warrantyTerms, current.warrantyTerms), payload.warrantyTerms ?? {}),
    invoiceTemplates: merge(merge(defaults.invoiceTemplates, current.invoiceTemplates), payload.invoiceTemplates ?? {}),
    paperPrinters: merge(merge(defaults.paperPrinters, current.paperPrinters), payload.paperPrinters ?? {}),
  }
  return current.merge(data).save()
}

export const resetSettings = async () => {
  const current = await getSettings()
  return current.merge(defaults).save()
}

export const previewId = async ({ entity, sequence = 1 }: IdPreviewPayload) => {
  if (!entities.includes(entity as (typeof entities)[number])) throw new Error(`Unsupported ID entity: ${entity}`)
  const settings = await getSettings()
  const config = (settings.idConfigs[entity] as Record<string, unknown> | undefined) ?? defaults.idConfigs[entity]
  const prefix = String(config.prefix ?? '')
  const infix = String(config.infix ?? '')
  const digits = Number(config.digits ?? config.paddingDigits ?? 4)
  return { entity, sequence, preview: `${prefix}${infix}${String(sequence).padStart(digits, '0')}`, config }
}

export const testPrintConfiguration = async ({ transactionType, format, printer }: TestPrintPayload) => {
  const settings = await getSettings()
  const mappings = settings.paperPrinters.mappings as Record<string, unknown>
  const mapping = mappings[transactionType] ?? null
  return { transactionType, format, printer: printer ?? null, mapping, printable: false, message: 'Test-print configuration returned; no physical print was performed' }
}

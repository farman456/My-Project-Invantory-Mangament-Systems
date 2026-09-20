import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

const text = vine.string().trim().maxLength(255)
const content = vine.string().maxLength(10000)
const idConfig = vine.object({
  prefix: text.optional(),
  infix: text.optional(),
  digits: vine.number().positive().withoutDecimals().max(12).optional(),
  paddingDigits: vine.number().positive().withoutDecimals().max(12).optional(),
})

export const settingsValidator = vine.compile(vine.object({
  businessInformation: vine.object({
    name: text.optional(), email: vine.string().email().optional(), helpline: text.optional(), whatsapp: text.optional(),
    country: text.optional(), stateProvince: text.optional(), city: text.optional(), postalCode: text.optional(), address: text.optional(),
    logo: vine.record(vine.any()).optional(), currency: text.optional(), language: text.optional(),
  }).optional(),
  idConfigs: vine.record(idConfig).optional(),
  signStamps: vine.object({
    preparedBy: text.optional(), authorizedSignatory: text.optional(), authorizedSignatoryName: text.optional(), authorizedSignatoryTitle: text.optional(), designation: text.optional(),
    signature: vine.record(vine.any()).optional(), stamp: vine.record(vine.any()).optional(),
  }).optional(),
  warrantyTerms: vine.object({
    termsAndConditions: content.optional(), warrantyPolicy: content.optional(), thermalPos: vine.boolean().optional(), a4: vine.boolean().optional(), a5: vine.boolean().optional(),
  }).optional(),
  invoiceTemplates: vine.object({
    preset: text.optional(), headerTitle: text.optional(), subtitle: text.optional(), thankYouNote: content.optional(), themeAccentColor: text.optional(), medicineColumns: vine.array(text).optional(),
    hiddenMedicineColumns: vine.array(text).optional(), columnOrder: vine.array(text).optional(), layoutSectionOrder: vine.array(text).optional(),
    sections: vine.record(vine.any()).optional(), a4: vine.record(vine.any()).optional(), a5: vine.record(vine.any()).optional(), thermalPos: vine.record(vine.any()).optional(),
  }).optional(),
  paperPrinters: vine.object({
    mappings: vine.record(vine.object({ format: text, printer: text.optional() })).optional(),
    printers: vine.array(vine.object({ name: text, type: text, connection: text, paper: text, isDefault: vine.boolean().optional() })).optional(),
  }).optional(),
}))

export const idPreviewValidator = vine.compile(vine.object({
  entity: text,
  sequence: vine.number().positive().withoutDecimals().optional(),
}))

export const testPrintValidator = vine.compile(vine.object({
  transactionType: text,
  format: text,
  printer: text.optional(),
}))

export type SettingsPayload = Infer<typeof settingsValidator>
export type IdPreviewPayload = Infer<typeof idPreviewValidator>
export type TestPrintPayload = Infer<typeof testPrintValidator>

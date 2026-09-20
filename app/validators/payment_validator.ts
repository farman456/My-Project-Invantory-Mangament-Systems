import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'
const fields = { paymentDirection: vine.enum(['in', 'out']), voucherNumber: vine.string().trim().minLength(1).maxLength(80), paymentDate: vine.date({ formats: ['YYYY-MM-DD'] }), transactionType: vine.string().trim().minLength(1), partyBeneficiary: vine.string().trim().minLength(1), paymentMode: vine.string().trim().minLength(1), bankAccount: vine.string().trim().optional(), value: vine.number().min(1), referenceNumber: vine.string().trim().optional(), status: vine.string().trim().optional() }
export const createPaymentValidator = vine.compile(vine.object(fields))
export const updatePaymentValidator = vine.compile(vine.object(Object.fromEntries(Object.entries(fields).map(([key, rule]) => [key, rule.optional()]))))
export const paymentIdValidator = vine.compile(vine.object({ id: vine.number().positive().withoutDecimals() }))
export type PaymentPayload = Infer<typeof createPaymentValidator>

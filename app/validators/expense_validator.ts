import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

const amount = vine.number().min(0)
const item = vine.object({ code: vine.string().trim().minLength(1), itemName: vine.string().trim().minLength(1), qty: vine.number().min(1), price: amount, tax: amount, disc: amount, amount: amount, actions: vine.string().trim().optional() })
const documentDate = vine.date({ formats: ['YYYY-MM-DD'] })
const billingSummary = vine.object({ gross: amount, discount: amount, tax: amount, payable: amount, extraDiscount: amount, totalBill: amount })
const payment = vine.object({ cash: amount, online: amount, cheque: amount, paid: amount, due: amount })
const paymentMethods = vine.object({ cashDrawer: vine.boolean().optional(), digital: vine.boolean().optional(), draftsCheques: vine.boolean().optional() })
export const createExpenseValidator = vine.compile(vine.object({ expenseId: vine.string().trim().minLength(1).maxLength(80), documentRef: vine.string().trim().optional(), documentDate, documents: vine.record(vine.any()).optional(), items: vine.array(item).minLength(1), billingSummary, payment, paymentMethods: paymentMethods.optional(), status: vine.string().trim().optional() }))
export const updateExpenseValidator = vine.compile(vine.object({ documentRef: vine.string().trim().optional(), documentDate: documentDate.optional(), documents: vine.record(vine.any()).optional(), items: vine.array(item).minLength(1).optional(), billingSummary: billingSummary.optional(), payment: payment.optional(), paymentMethods: paymentMethods.optional(), status: vine.string().trim().optional() }))
export const expenseIdValidator = vine.compile(vine.object({ id: vine.number().positive().withoutDecimals() }))
export type ExpensePayload = Infer<typeof createExpenseValidator>

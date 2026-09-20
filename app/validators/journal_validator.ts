import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'
const line = vine.object({
  accountHeadId: vine.number().positive().withoutDecimals().exists({ table: 'account_heads', column: 'id' }),
  accountSubHeadId: vine.number().positive().withoutDecimals().exists({ table: 'account_sub_heads', column: 'id' }),
  narration: vine.string().trim().optional(),
  debit: vine.number().min(0),
  credit: vine.number().min(0),
})
const journalDate = vine.date({ formats: ['YYYY-MM-DD'] })
export const createJournalValidator = vine.compile(vine.object({ journalNumber: vine.string().trim().minLength(1).maxLength(80), journalDate, journalType: vine.string().trim().minLength(1), transactionType: vine.string().trim().minLength(1), partyHeads: vine.string().trim().optional(), description: vine.string().trim().optional(), status: vine.string().trim().optional(), lines: vine.array(line).minLength(2) }))
export const updateJournalValidator = vine.compile(vine.object({ journalDate: journalDate.optional(), journalType: vine.string().trim().optional(), transactionType: vine.string().trim().optional(), partyHeads: vine.string().trim().optional(), description: vine.string().trim().optional(), status: vine.string().trim().optional(), lines: vine.array(line).minLength(2).optional() }))
export const journalIdValidator = vine.compile(vine.object({ id: vine.number().positive().withoutDecimals() }))
export type JournalPayload = Infer<typeof createJournalValidator>

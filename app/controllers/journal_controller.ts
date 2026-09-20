import type { HttpContext } from '@adonisjs/core/http'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import { createJournalValidator, journalIdValidator, updateJournalValidator } from '#validators/journal_validator'
import { createJournal, deleteJournal, getJournal, listJournals, updateJournal } from '#services/journal_service'
export default class JournalController {
  async index(ctx: HttpContext) { try { return sendSuccess('Journals listed successfully', await listJournals()) } catch (e) { return ErrorService.handleError(ctx, e) } }
  async show(ctx: HttpContext) { try { const { id } = await journalIdValidator.validate(ctx.params); return sendSuccess('Journal retrieved successfully', await getJournal(id)) } catch (e) { return ErrorService.handleError(ctx, e) } }
  async create(ctx: HttpContext) { try { return sendSuccess('Journal created successfully', await createJournal(await createJournalValidator.validate(ctx.request.body()))) } catch (e) { return ErrorService.handleError(ctx, e) } }
  async update(ctx: HttpContext) { try { const { id } = await journalIdValidator.validate(ctx.params); return sendSuccess('Journal updated successfully', await updateJournal(id, await updateJournalValidator.validate(ctx.request.body()))) } catch (e) { return ErrorService.handleError(ctx, e) } }
  async delete(ctx: HttpContext) { try { const { id } = await journalIdValidator.validate(ctx.params); await deleteJournal(id); return sendSuccess('Journal deleted successfully') } catch (e) { return ErrorService.handleError(ctx, e) } }
}

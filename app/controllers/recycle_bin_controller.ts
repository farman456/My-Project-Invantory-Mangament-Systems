import type { HttpContext } from '@adonisjs/core/http'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import { getDeletedRecord, listDeletedRecords, permanentlyDeleteRecord, restoreDeletedRecord } from '#services/recycle_bin_service'
import { recycleBinIdValidator } from '#validators/recycle_bin_validator'

export default class RecycleBinController {
  async index(ctx: HttpContext) { try { return sendSuccess('Deleted records listed successfully', await listDeletedRecords()) } catch (error) { return ErrorService.handleError(ctx, error) } }
  async show(ctx: HttpContext) { try { const { id } = await recycleBinIdValidator.validate(ctx.params); return sendSuccess('Deleted record retrieved successfully', await getDeletedRecord(id)) } catch (error) { return ErrorService.handleError(ctx, error) } }
  async restore(ctx: HttpContext) { try { const { id } = await recycleBinIdValidator.validate(ctx.params); return sendSuccess('Record restored successfully', await restoreDeletedRecord(id)) } catch (error) { return ErrorService.handleError(ctx, error) } }
  async permanentDelete(ctx: HttpContext) { try { const { id } = await recycleBinIdValidator.validate(ctx.params); return sendSuccess('Record permanently deleted successfully', await permanentlyDeleteRecord(id)) } catch (error) { return ErrorService.handleError(ctx, error) } }
}

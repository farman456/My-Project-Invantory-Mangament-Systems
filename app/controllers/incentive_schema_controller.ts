import type { HttpContext } from '@adonisjs/core/http'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import { createIncentiveSchemaValidator, incentiveSchemaIdValidator, updateIncentiveSchemaValidator } from '#validators/incentive_schema_validator'
import { createIncentiveSchema, deleteIncentiveSchema, getIncentiveSchema, listIncentiveSchemas, updateIncentiveSchema } from '#services/incentive_schema_service'

export default class IncentiveSchemaController {
  async index(ctx: HttpContext) { try { return sendSuccess('Incentive schemas listed successfully', await listIncentiveSchemas()) } catch (error) { return ErrorService.handleError(ctx, error) } }
  async create(ctx: HttpContext) { try { return sendSuccess('Incentive schema created successfully', await createIncentiveSchema(await createIncentiveSchemaValidator.validate(ctx.request.body()))) } catch (error) { return ErrorService.handleError(ctx, error) } }
  async show(ctx: HttpContext) { try { const { incentiveSchemaId } = await incentiveSchemaIdValidator.validate(ctx.params); return sendSuccess('Incentive schema retrieved successfully', await getIncentiveSchema(incentiveSchemaId)) } catch (error) { return ErrorService.handleError(ctx, error) } }
  async update(ctx: HttpContext) { try { const { incentiveSchemaId } = await incentiveSchemaIdValidator.validate(ctx.params); return sendSuccess('Incentive schema updated successfully', await updateIncentiveSchema(incentiveSchemaId, await updateIncentiveSchemaValidator.validate(ctx.request.body()))) } catch (error) { return ErrorService.handleError(ctx, error) } }
  async delete(ctx: HttpContext) { try { const { incentiveSchemaId } = await incentiveSchemaIdValidator.validate(ctx.params); await deleteIncentiveSchema(incentiveSchemaId); return sendSuccess('Incentive schema deleted successfully') } catch (error) { return ErrorService.handleError(ctx, error) } }
}

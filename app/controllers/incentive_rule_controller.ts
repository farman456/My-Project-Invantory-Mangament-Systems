import type { HttpContext } from '@adonisjs/core/http'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import { createIncentiveRuleValidator, incentiveRuleIdValidator, updateIncentiveRuleValidator } from '#validators/incentive_rule_validator'
import { createIncentiveRule, deleteIncentiveRule, getIncentiveRule, listIncentiveRules, updateIncentiveRule } from '#services/incentive_rule_service'

export default class IncentiveRuleController {
  async index(ctx: HttpContext) { try { return sendSuccess('Incentive rules listed successfully', await listIncentiveRules()) } catch (error) { return ErrorService.handleError(ctx, error) } }
  async create(ctx: HttpContext) { try { return sendSuccess('Incentive rule created successfully', await createIncentiveRule(await createIncentiveRuleValidator.validate(ctx.request.body()))) } catch (error) { return ErrorService.handleError(ctx, error) } }
  async show(ctx: HttpContext) { try { const { incentiveRuleId } = await incentiveRuleIdValidator.validate(ctx.params); return sendSuccess('Incentive rule retrieved successfully', await getIncentiveRule(incentiveRuleId)) } catch (error) { return ErrorService.handleError(ctx, error) } }
  async update(ctx: HttpContext) { try { const { incentiveRuleId } = await incentiveRuleIdValidator.validate(ctx.params); return sendSuccess('Incentive rule updated successfully', await updateIncentiveRule(incentiveRuleId, await updateIncentiveRuleValidator.validate(ctx.request.body()))) } catch (error) { return ErrorService.handleError(ctx, error) } }
  async delete(ctx: HttpContext) { try { const { incentiveRuleId } = await incentiveRuleIdValidator.validate(ctx.params); await deleteIncentiveRule(incentiveRuleId); return sendSuccess('Incentive rule deleted successfully') } catch (error) { return ErrorService.handleError(ctx, error) } }
}

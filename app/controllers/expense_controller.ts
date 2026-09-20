import type { HttpContext } from '@adonisjs/core/http'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import { createExpenseValidator, expenseIdValidator, updateExpenseValidator } from '#validators/expense_validator'
import { createExpense, deleteExpense, getExpense, listExpenses, updateExpense } from '#services/expense_service'
export default class ExpenseController {
  async index(ctx: HttpContext) { try { const { sortBy, sortOrder } = ctx.request.qs(); return sendSuccess('Expenses listed successfully', await listExpenses({ sortBy, sortOrder })) } catch (e) { return ErrorService.handleError(ctx, e) } }
  async show(ctx: HttpContext) { try { const { id } = await expenseIdValidator.validate(ctx.params); return sendSuccess('Expense retrieved successfully', await getExpense(id)) } catch (e) { return ErrorService.handleError(ctx, e) } }
  async create(ctx: HttpContext) { try { return sendSuccess('Expense created successfully', await createExpense(await createExpenseValidator.validate(ctx.request.body()))) } catch (e) { return ErrorService.handleError(ctx, e) } }
  async update(ctx: HttpContext) { try { const { id } = await expenseIdValidator.validate(ctx.params); return sendSuccess('Expense updated successfully', await updateExpense(id, await updateExpenseValidator.validate(ctx.request.body()))) } catch (e) { return ErrorService.handleError(ctx, e) } }
  async delete(ctx: HttpContext) { try { const { id } = await expenseIdValidator.validate(ctx.params); await deleteExpense(id); return sendSuccess('Expense deleted successfully') } catch (e) { return ErrorService.handleError(ctx, e) } }
}

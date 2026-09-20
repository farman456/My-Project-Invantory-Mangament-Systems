import Expense from '#models/expense'
export const createExpense = (payload: any) => Expense.create(payload)
export const listExpenses = ({ sortBy = 'id', sortOrder = 'desc' }: { sortBy?: string, sortOrder?: 'asc' | 'desc' } = {}) => {
  const column = sortBy === 'expenseId' ? 'expense_id' : 'id'
  return Expense.query().orderBy(column, sortOrder === 'asc' ? 'asc' : 'desc')
}
export const getExpense = async (id: number) => { const item = await Expense.find(id); if (!item) throw new Error(`Expense with ID: ${id} does not exist`); return item }
export const updateExpense = async (id: number, payload: any) => { const item = await getExpense(id); return item.merge(payload).save() }
export const deleteExpense = async (id: number) => { const item = await getExpense(id); await item.delete() }

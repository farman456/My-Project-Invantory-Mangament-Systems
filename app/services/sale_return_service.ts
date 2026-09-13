import SaleReturn from '#models/sale_return'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import { createSaleReturnValidatorInterface, updateSaleReturnValidatorInterface } from '#validators/sale_return_validator'

export const listSaleReturns = async (page = 1, perPage = 25, options: ListQueryOptions = {}) => {
  const query = applyListQuery(SaleReturn.query(), options, { searchColumns: ['sale_returns.name', 'sale_returns.return_details', 'sale_returns.status'], sortColumns: { id: 'sale_returns.id', name: 'sale_returns.name', refundValue: 'sale_returns.refund_value', status: 'sale_returns.status' } })
  if (options.status !== undefined) query.where('sale_returns.status', options.status)
  const paginator = await query.paginate(page, perPage)
  return { items: paginator.all(), pagination: { total: paginator.total, perPage: paginator.perPage, currentPage: paginator.currentPage, lastPage: paginator.lastPage } }
}
export const getSaleReturn = async (id: number) => { const record = await SaleReturn.find(id); if (!record) throw new Error(`Sale return with ID: ${id} does not exist`); return record }
export const createSaleReturn = async (payload: createSaleReturnValidatorInterface) => { try { return await SaleReturn.create(payload) } catch (error) { throw new Error(`Error creating sale return: ${error instanceof Error ? error.message : String(error)}`) } }
export const updateSaleReturn = async (payload: updateSaleReturnValidatorInterface, id: number) => { const record = await getSaleReturn(id); return record.merge(payload).save() }
export const deleteSaleReturn = async (id: number) => { const record = await getSaleReturn(id); await record.delete() }

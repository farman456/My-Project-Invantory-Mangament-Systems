import SaleOrder from '#models/sale_order'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import { createSaleOrderValidatorInterface, updateSaleOrderValidatorInterface } from '#validators/sale_order_validator'

export const listSaleOrders = async (page = 1, perPage = 25, options: ListQueryOptions = {}) => {
  const query = applyListQuery(SaleOrder.query(), options, {
    searchColumns: ['sale_orders.name', 'sale_orders.order_details', 'sale_orders.referral', 'sale_orders.status'],
    sortColumns: { id: 'sale_orders.id', name: 'sale_orders.name', orderValue: 'sale_orders.order_value', status: 'sale_orders.status' },
  })
  if (options.status !== undefined) query.where('sale_orders.status', options.status)
  const paginator = await query.paginate(page, perPage)
  return { items: paginator.all(), pagination: { total: paginator.total, perPage: paginator.perPage, currentPage: paginator.currentPage, lastPage: paginator.lastPage } }
}
export const getSaleOrder = async (id: number) => { const record = await SaleOrder.find(id); if (!record) throw new Error(`Sale order with ID: ${id} does not exist`); return record }
export const createSaleOrder = async (payload: createSaleOrderValidatorInterface) => { try { return await SaleOrder.create(payload) } catch (error) { throw new Error(`Error creating sale order: ${error instanceof Error ? error.message : String(error)}`) } }
export const updateSaleOrder = async (payload: updateSaleOrderValidatorInterface, id: number) => { const record = await getSaleOrder(id); return record.merge(payload).save() }
export const deleteSaleOrder = async (id: number) => { const record = await getSaleOrder(id); await record.delete() }

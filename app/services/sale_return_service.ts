import db from '@adonisjs/lucid/services/db'
import SaleReturn from '#models/sale_return'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import { createSaleReturnValidatorInterface, updateSaleReturnValidatorInterface } from '#validators/sale_return_validator'

const parseReturnDetails = (value: unknown) => {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return parsed && typeof parsed === 'object' ? parsed : {}
    } catch {
      return {}
    }
  }

  return value && typeof value === 'object' ? value : {}
}

export const listSaleReturns = async (page = 1, perPage = 25, options: ListQueryOptions = {}) => {
  const query = applyListQuery(SaleReturn.query(), options, { searchColumns: ['sale_returns.name', 'sale_returns.return_details', 'sale_returns.status'], sortColumns: { id: 'sale_returns.id', name: 'sale_returns.name', refundValue: 'sale_returns.refund_value', status: 'sale_returns.status' } })
  if (options.status !== undefined) query.where('sale_returns.status', options.status)
  const paginator = await query.paginate(page, perPage)
  return { items: paginator.all(), pagination: { total: paginator.total, perPage: paginator.perPage, currentPage: paginator.currentPage, lastPage: paginator.lastPage } }
}
export const getSaleReturn = async (id: number) => { const record = await SaleReturn.find(id); if (!record) throw new Error(`Sale return with ID: ${id} does not exist`); return record }
export const createSaleReturn = async (payload: createSaleReturnValidatorInterface) => {
  try {
    const details = parseReturnDetails(payload.returnDetails)
    const productIds = Array.isArray(details?.items)
      ? details.items.map((item: any) => Number(item?.productId)).filter((value: number) => Number.isFinite(value))
      : []

    if (productIds.length > 0) {
      const existingProducts = await db.from('products').whereIn('id', productIds).select('id')
      const validIds = new Set(existingProducts.map((product: { id: number }) => Number(product.id)))
      const invalidProductIds = [...new Set(productIds.filter((productId: number) => !validIds.has(productId)))]

      if (invalidProductIds.length > 0) {
        const error = new Error('Every sale return item productId must exist') as Error & {
          code?: string
          messages?: Array<{ message: string; rule: string; field: string }>
        }
        error.code = 'E_VALIDATION_ERROR'
        error.messages = [{ message: 'Every sale return item productId must exist', rule: 'exists', field: 'returnDetails.items.productId' }]
        throw error
      }
    }

    return await SaleReturn.create(payload)
  } catch (error) {
    if (error instanceof Error && (error as Error & { code?: string }).code === 'E_VALIDATION_ERROR') {
      throw error
    }
    throw new Error(`Error creating sale return: ${error instanceof Error ? error.message : String(error)}`)
  }
}
export const updateSaleReturn = async (payload: updateSaleReturnValidatorInterface, id: number) => {
  const record = await getSaleReturn(id)
  if (payload.returnDetails !== undefined) {
    const details = parseReturnDetails(payload.returnDetails)
    const productIds = Array.isArray(details?.items)
      ? details.items.map((item: any) => Number(item?.productId)).filter((value: number) => Number.isFinite(value))
      : []

    if (productIds.length > 0) {
      const existingProducts = await db.from('products').whereIn('id', productIds).select('id')
      const validIds = new Set(existingProducts.map((product: { id: number }) => Number(product.id)))
      const invalidProductIds = [...new Set(productIds.filter((productId: number) => !validIds.has(productId)))]

      if (invalidProductIds.length > 0) {
        const error = new Error('Every sale return item productId must exist') as Error & {
          code?: string
          messages?: Array<{ message: string; rule: string; field: string }>
        }
        error.code = 'E_VALIDATION_ERROR'
        error.messages = [{ message: 'Every sale return item productId must exist', rule: 'exists', field: 'returnDetails.items.productId' }]
        throw error
      }
    }
  }
  return record.merge(payload).save()
}
export const deleteSaleReturn = async (id: number) => { const record = await getSaleReturn(id); await record.delete() }

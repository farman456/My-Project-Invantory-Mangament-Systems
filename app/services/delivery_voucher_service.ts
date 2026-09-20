import db from '@adonisjs/lucid/services/db'
import DeliveryVoucher from '#models/delivery_voucher'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import { createDeliveryVoucherValidatorInterface, updateDeliveryVoucherValidatorInterface } from '#validators/delivery_voucher_validator'

const parseVoucherDetails = (value: unknown) => {
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

export const listDeliveryVouchers = async (page = 1, perPage = 25, options: ListQueryOptions = {}) => {
  const query = applyListQuery(DeliveryVoucher.query(), options, {
    searchColumns: ['delivery_vouchers.name', 'delivery_vouchers.transporters', 'delivery_vouchers.status'],
    sortColumns: { id: 'delivery_vouchers.id', name: 'delivery_vouchers.name', status: 'delivery_vouchers.status' },
  })
  if (options.status !== undefined) query.where('delivery_vouchers.status', options.status)
  const paginator = await query.paginate(page, perPage)
  return { items: paginator.all(), pagination: { total: paginator.total, perPage: paginator.perPage, currentPage: paginator.currentPage, lastPage: paginator.lastPage } }
}
export const getDeliveryVoucher = async (id: number) => { const record = await DeliveryVoucher.find(id); if (!record) throw new Error(`Delivery voucher with ID: ${id} does not exist`); return record }
export const createDeliveryVoucher = async (payload: createDeliveryVoucherValidatorInterface) => {
  try {
    const details = parseVoucherDetails(payload.voucherDetails)
    const productIds = Array.isArray(details?.items)
      ? details.items.map((item: any) => Number(item?.productId)).filter((value: number) => Number.isFinite(value))
      : []

    if (productIds.length > 0) {
      const existingProducts = await db.from('products').whereIn('id', productIds).select('id')
      const validIds = new Set(existingProducts.map((product: { id: number }) => Number(product.id)))
      const invalidProductIds = [...new Set(productIds.filter((productId: number) => !validIds.has(productId)))]

      if (invalidProductIds.length > 0) {
        const error = new Error('Every delivery voucher item productId must exist') as Error & {
          code?: string
          messages?: Array<{ message: string; rule: string; field: string }>
        }
        error.code = 'E_VALIDATION_ERROR'
        error.messages = [{ message: 'Every delivery voucher item productId must exist', rule: 'exists', field: 'voucherDetails.items.productId' }]
        throw error
      }
    }

    return await DeliveryVoucher.create(payload)
  } catch (error) {
    if (error instanceof Error && (error as Error & { code?: string }).code === 'E_VALIDATION_ERROR') {
      throw error
    }
    throw new Error(`Error creating delivery voucher: ${error instanceof Error ? error.message : String(error)}`)
  }
}
export const updateDeliveryVoucher = async (payload: updateDeliveryVoucherValidatorInterface, id: number) => { const record = await getDeliveryVoucher(id); return record.merge(payload).save() }
export const deleteDeliveryVoucher = async (id: number) => { const record = await getDeliveryVoucher(id); await record.delete() }

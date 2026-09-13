import DeliveryVoucher from '#models/delivery_voucher'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import { createDeliveryVoucherValidatorInterface, updateDeliveryVoucherValidatorInterface } from '#validators/delivery_voucher_validator'

export const listDeliveryVouchers = async (page = 1, perPage = 25, options: ListQueryOptions = {}) => {
  const query = applyListQuery(DeliveryVoucher.query(), options, { searchColumns: ['delivery_vouchers.name', 'delivery_vouchers.voucher_details', 'delivery_vouchers.transporters', 'delivery_vouchers.status'], sortColumns: { id: 'delivery_vouchers.id', name: 'delivery_vouchers.name', status: 'delivery_vouchers.status' } })
  if (options.status !== undefined) query.where('delivery_vouchers.status', options.status)
  const paginator = await query.paginate(page, perPage)
  return { items: paginator.all(), pagination: { total: paginator.total, perPage: paginator.perPage, currentPage: paginator.currentPage, lastPage: paginator.lastPage } }
}
export const getDeliveryVoucher = async (id: number) => { const record = await DeliveryVoucher.find(id); if (!record) throw new Error(`Delivery voucher with ID: ${id} does not exist`); return record }
export const createDeliveryVoucher = async (payload: createDeliveryVoucherValidatorInterface) => { try { return await DeliveryVoucher.create(payload) } catch (error) { throw new Error(`Error creating delivery voucher: ${error instanceof Error ? error.message : String(error)}`) } }
export const updateDeliveryVoucher = async (payload: updateDeliveryVoucherValidatorInterface, id: number) => { const record = await getDeliveryVoucher(id); return record.merge(payload).save() }
export const deleteDeliveryVoucher = async (id: number) => { const record = await getDeliveryVoucher(id); await record.delete() }

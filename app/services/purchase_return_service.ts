import PurchaseReturn from '#models/purchase_return'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import {
  createPurchaseReturnValidatorInterface,
  updatePurchaseReturnValidatorInterface,
} from '#validators/purchase_return_validator'

export const listPurchaseReturns = async (page = 1, perPage = 25, options: ListQueryOptions = {}) => {
  const query = applyListQuery(PurchaseReturn.query(), options, {
    searchColumns: ['purchase_returns.name', 'purchase_returns.return_details', 'purchase_returns.status'],
    sortColumns: { id: 'purchase_returns.id', name: 'purchase_returns.name', refundValue: 'purchase_returns.refund_value', status: 'purchase_returns.status' },
  })
  if (options.status !== undefined) query.where('purchase_returns.status', options.status)
  if (options.supplier !== undefined) query.where('purchase_returns.supplier_id', options.supplier)
  const paginator = await query.paginate(page, perPage)
  return { items: paginator.all(), pagination: { total: paginator.total, perPage: paginator.perPage, currentPage: paginator.currentPage, lastPage: paginator.lastPage } }
}

export const getPurchaseReturn = async (purchaseReturnId: number) => {
  const purchaseReturn = await PurchaseReturn.find(purchaseReturnId)
  if (!purchaseReturn) throw new Error(`Purchase return with ID: ${purchaseReturnId} does not exist`)
  return purchaseReturn
}

export const createPurchaseReturn = async (payload: createPurchaseReturnValidatorInterface) => {
  try {
    return await PurchaseReturn.create(payload)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error creating purchase return: ${message}`)
  }
}

export const updatePurchaseReturn = async (
  payload: updatePurchaseReturnValidatorInterface,
  purchaseReturnId: number
) => {
  const purchaseReturn = await getPurchaseReturn(purchaseReturnId)
  return await purchaseReturn.merge(payload).save()
}

export const deletePurchaseReturn = async (purchaseReturnId: number) => {
  const purchaseReturn = await getPurchaseReturn(purchaseReturnId)
  await purchaseReturn.delete()
}
import PurchaseOrder from '#models/purchase_order'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import {
  createPurchaseOrderValidatorInterface,
  updatePurchaseOrderValidatorInterface,
} from '#validators/purchase_order_validator'

export const listPurchaseOrders = async (page = 1, perPage = 25, options: ListQueryOptions = {}) => {
  const query = applyListQuery(PurchaseOrder.query(), options, {
    searchColumns: ['purchase_orders.name', 'purchase_orders.order_details', 'purchase_orders.status'],
    sortColumns: { id: 'purchase_orders.id', name: 'purchase_orders.name', orderValue: 'purchase_orders.order_value', status: 'purchase_orders.status' },
  })
  if (options.status !== undefined) query.where('purchase_orders.status', options.status)
  if (options.supplier !== undefined) query.where('purchase_orders.supplier_id', options.supplier)
  if (options.productId !== undefined) query.where('purchase_orders.product_id', options.productId)
  const paginator = await query.paginate(page, perPage)
  return { items: paginator.all(), pagination: { total: paginator.total, perPage: paginator.perPage, currentPage: paginator.currentPage, lastPage: paginator.lastPage } }
}

export const getPurchaseOrder = async (purchaseOrderId: number) => {
  const purchaseOrder = await PurchaseOrder.find(purchaseOrderId)
  if (!purchaseOrder) throw new Error(`Purchase order with ID: ${purchaseOrderId} does not exist`)
  return purchaseOrder
}

export const createPurchaseOrder = async (payload: createPurchaseOrderValidatorInterface) => {
  try {
    return await PurchaseOrder.create(payload)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error creating purchase order: ${message}`)
  }
}

export const updatePurchaseOrder = async (
  payload: updatePurchaseOrderValidatorInterface,
  purchaseOrderId: number
) => {
  const purchaseOrder = await getPurchaseOrder(purchaseOrderId)
  return await purchaseOrder.merge(payload).save()
}

export const deletePurchaseOrder = async (purchaseOrderId: number) => {
  const purchaseOrder = await getPurchaseOrder(purchaseOrderId)
  await purchaseOrder.delete()
}
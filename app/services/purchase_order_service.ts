import PurchaseOrder from '#models/purchase_order'
import {
  createPurchaseOrderValidatorInterface,
  updatePurchaseOrderValidatorInterface,
} from '#validators/purchase_order_validator'

export const listPurchaseOrders = async (page = 1, perPage = 25) => {
  const paginator = await PurchaseOrder.query().orderBy('id', 'asc').paginate(page, perPage)
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
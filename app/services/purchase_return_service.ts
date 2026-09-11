import PurchaseReturn from '#models/purchase_return'
import {
  createPurchaseReturnValidatorInterface,
  updatePurchaseReturnValidatorInterface,
} from '#validators/purchase_return_validator'

export const listPurchaseReturns = async (page = 1, perPage = 25) => {
  const paginator = await PurchaseReturn.query().orderBy('id', 'asc').paginate(page, perPage)
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
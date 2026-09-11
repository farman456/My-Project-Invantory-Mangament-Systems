import PurchaseInvoice from '#models/purchase_invoice'
import {
  createPurchaseInvoiceValidatorInterface,
  updatePurchaseInvoiceValidatorInterface,
} from '#validators/purchase_invoice_validator'

export const listPurchaseInvoices = async (page = 1, perPage = 25) => {
  const paginator = await PurchaseInvoice.query().orderBy('id', 'asc').paginate(page, perPage)
  return { items: paginator.all(), pagination: { total: paginator.total, perPage: paginator.perPage, currentPage: paginator.currentPage, lastPage: paginator.lastPage } }
}

export const getPurchaseInvoice = async (purchaseInvoiceId: number) => {
  const purchaseInvoice = await PurchaseInvoice.find(purchaseInvoiceId)
  if (!purchaseInvoice) throw new Error(`Purchase invoice with ID: ${purchaseInvoiceId} does not exist`)
  return purchaseInvoice
}

export const createPurchaseInvoice = async (payload: createPurchaseInvoiceValidatorInterface) => {
  try {
    return await PurchaseInvoice.create(payload)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error creating purchase invoice: ${message}`)
  }
}

export const updatePurchaseInvoice = async (
  payload: updatePurchaseInvoiceValidatorInterface,
  purchaseInvoiceId: number
) => {
  const purchaseInvoice = await getPurchaseInvoice(purchaseInvoiceId)
  return await purchaseInvoice.merge(payload).save()
}

export const deletePurchaseInvoice = async (purchaseInvoiceId: number) => {
  const purchaseInvoice = await getPurchaseInvoice(purchaseInvoiceId)
  await purchaseInvoice.delete()
}
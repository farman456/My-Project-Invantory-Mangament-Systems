import PurchaseInvoice from '#models/purchase_invoice'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import {
  createPurchaseInvoiceValidatorInterface,
  updatePurchaseInvoiceValidatorInterface,
} from '#validators/purchase_invoice_validator'

export const listPurchaseInvoices = async (page = 1, perPage = 25, options: ListQueryOptions = {}) => {
  const query = applyListQuery(PurchaseInvoice.query(), options, {
    searchColumns: ['purchase_invoices.name', 'purchase_invoices.invoice_details', 'purchase_invoices.status'],
    sortColumns: { id: 'purchase_invoices.id', name: 'purchase_invoices.name', invoiceValue: 'purchase_invoices.invoice_value', status: 'purchase_invoices.status' },
  })
  if (options.status !== undefined) query.where('purchase_invoices.status', options.status)
  if (options.supplier !== undefined) query.where('purchase_invoices.supplier_id', options.supplier)
  const paginator = await query.paginate(page, perPage)
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
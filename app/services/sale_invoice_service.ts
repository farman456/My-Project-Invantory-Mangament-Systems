import SaleInvoice from '#models/sale_invoice'
import db from '@adonisjs/lucid/services/db'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import { createSaleInvoiceValidatorInterface, updateSaleInvoiceValidatorInterface } from '#validators/sale_invoice_validator'

export const listSaleInvoices = async (page = 1, perPage = 25, options: ListQueryOptions = {}) => {
  const query = applyListQuery(SaleInvoice.query(), options, { searchColumns: ['sale_invoices.name', 'sale_invoices.invoice_details', 'sale_invoices.referral', 'sale_invoices.status'], sortColumns: { id: 'sale_invoices.id', name: 'sale_invoices.name', invoiceValue: 'sale_invoices.invoice_value', status: 'sale_invoices.status' } })
  if (options.status !== undefined) query.where('sale_invoices.status', options.status)
  const paginator = await query.paginate(page, perPage)
  return { items: paginator.all(), pagination: { total: paginator.total, perPage: paginator.perPage, currentPage: paginator.currentPage, lastPage: paginator.lastPage } }
}
export const getSaleInvoice = async (id: number) => { const record = await SaleInvoice.find(id); if (!record) throw new Error(`Sale invoice with ID: ${id} does not exist`); return record }
export const createSaleInvoice = async (payload: createSaleInvoiceValidatorInterface) => {
  try {
    const details = typeof payload.invoiceDetails === 'string' ? JSON.parse(payload.invoiceDetails) : payload.invoiceDetails
    const productIds = Array.isArray(details?.items) ? details.items.map((item: any) => item.productId).filter((id: unknown) => id !== undefined) : []
    if (productIds.length) {
      const products = await db.from('products').whereIn('id', productIds)
      if (products.length !== new Set(productIds).size) {
        const error = new Error('Every invoice item productId must exist') as Error & { code: string; messages: unknown[] }
        error.code = 'E_VALIDATION_ERROR'
        error.messages = [{ message: 'Every invoice item productId must exist', rule: 'exists', field: 'invoiceDetails.items.productId' }]
        throw error
      }
    }
    return await SaleInvoice.create(payload)
  } catch (error) {
    throw error instanceof Error && error.name === 'Error' && (error as Error & { code?: string }).code === 'E_VALIDATION_ERROR'
      ? error
      : new Error(`Error creating sale invoice: ${error instanceof Error ? error.message : String(error)}`)
  }
}
export const updateSaleInvoice = async (payload: updateSaleInvoiceValidatorInterface, id: number) => { const record = await getSaleInvoice(id); return record.merge(payload).save() }
export const deleteSaleInvoice = async (id: number) => { const record = await getSaleInvoice(id); await record.delete() }

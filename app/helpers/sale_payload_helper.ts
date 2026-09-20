type SalePayload = Record<string, any>

const numericValue = (value: unknown) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : undefined
}

const firstValue = (payload: SalePayload, ...keys: string[]) => {
  const summary = payload.summary && typeof payload.summary === 'object' ? payload.summary : {}
  for (const key of keys) {
    if (payload[key] !== undefined) return payload[key]
    if (summary[key] !== undefined) return summary[key]
  }
  return undefined
}

const itemCount = (items: any[] | undefined) =>
  items?.reduce((total, item) => total + Number(item.qty ?? item.quantity ?? 0), 0)

const itemTotalValue = (items: any[] | undefined) =>
  items?.reduce((total, item) => {
    const itemValue = numericValue(item.amount) ?? numericValue(item.total) ?? (numericValue(item.price) ?? 0) * (numericValue(item.qty ?? item.quantity) ?? 0)
    return total + (itemValue ?? 0)
  }, 0)

const cartonCount = (items: any[] | undefined) =>
  items?.reduce((total, item) => total + Number(item.carton ?? item.cartons ?? 0), 0)

const existingDetails = (value: unknown) => {
  if (typeof value !== 'string') return value && typeof value === 'object' ? value : {}
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' ? parsed : { remarks: value }
  } catch {
    return { remarks: value }
  }
}

const normalize = (
  payload: SalePayload,
  detailsField: string,
  canonical: SalePayload,
  detailKeys: string[]
) => {
  const hasNewDetails = payload[detailsField] !== undefined || payload.items !== undefined || detailKeys.some((key) => payload[key] !== undefined)
  const details = { ...existingDetails(payload[detailsField]) } as SalePayload
  for (const key of detailKeys) {
    if (payload[key] !== undefined) details[key] = payload[key]
  }
  if (payload.items !== undefined) details.items = payload.items

  const normalized: SalePayload = { status: payload.status, actions: payload.actions }
  for (const [key, value] of Object.entries(canonical)) {
    if (value !== undefined) normalized[key] = value
  }
  if (hasNewDetails) {
    const legacyText = typeof payload[detailsField] === 'string' && payload.items === undefined && detailKeys.every((key) => payload[key] === undefined)
    normalized[detailsField] = legacyText ? payload[detailsField] : JSON.stringify(details)
  }
  return normalized
}

export const normalizeSaleOrderPayload = (payload: SalePayload) => {
  const items = payload.items
  return normalize(payload, 'orderDetails', {
    name: firstValue(payload, 'name', 'orderNumber'),
    customerId: firstValue(payload, 'customerId', 'customer'),
    productId: firstValue(payload, 'productId') ?? items?.[0]?.productId,
    noOfItems: firstValue(payload, 'noOfItems', 'totalItems', 'total_items') ?? itemCount(items),
    referral: firstValue(payload, 'refNumber', 'referral'),
    orderValue: firstValue(payload, 'orderValue', 'netValue', 'net_value', 'totalValue', 'total_value') ?? itemTotalValue(items),
  }, ['orderNumber', 'dateTime', 'refNumber', 'bookedBy', 'country', 'areaCity', 'address', 'priority', 'remarks', 'summary'])
}

export const normalizeSaleInvoicePayload = (payload: SalePayload) => {
  const items = payload.items
  return normalize(payload, 'invoiceDetails', {
    name: firstValue(payload, 'name', 'invoiceNumber'),
    saleOrderId: firstValue(payload, 'saleOrderId', 'fetchSoId'),
    customerId: firstValue(payload, 'customerId', 'customer'),
    noOfItems: firstValue(payload, 'noOfItems', 'totalItems', 'total_items') ?? itemCount(items),
    referral: firstValue(payload, 'soPriority', 'referral'),
    invoiceValue: firstValue(payload, 'invoiceValue', 'netValue', 'net_value', 'totalValue', 'total_value', 'amount') ?? itemTotalValue(items),
  }, ['fetchSoNumber', 'soDateTime', 'invoiceNumber', 'dateTime', 'idNumber', 'bookedBy', 'priority', 'country', 'areaCity', 'cargoCourier', 'remarks', 'summary', 'paymentMethod'])
}

export const normalizeDeliveryVoucherPayload = (payload: SalePayload) => {
  const items = payload.items
  return normalize(payload, 'voucherDetails', {
    name: firstValue(payload, 'name', 'dispatchNumber'),
    saleOrderId: firstValue(payload, 'saleOrderId', 'fetchSoId'),
    customerId: firstValue(payload, 'customerId', 'customer'),
    noOfCartons: firstValue(payload, 'noOfCartons', 'totalCartons', 'total_cartons') ?? cartonCount(items) ?? itemCount(items),
    transporters: firstValue(payload, 'cargoCourier', 'transporters'),
  }, ['dispatchNumber', 'dateTime', 'siNumber', 'customerContact', 'soPriority', 'soDateTime', 'address', 'cargoCourier', 'logisticsDetails', 'remarks'])
}

export const normalizeSaleReturnPayload = (payload: SalePayload) => {
  const items = payload.items
  return normalize(payload, 'returnDetails', {
    name: firstValue(payload, 'name', 'returnNumber'),
    saleInvoiceId: firstValue(payload, 'saleInvoiceId', 'fetchSiId'),
    customerId: firstValue(payload, 'customerId', 'customer'),
    noOfItems: firstValue(payload, 'noOfItems', 'totalItems', 'total_items') ?? itemCount(items),
    refundValue: firstValue(payload, 'refundValue', 'netRefund', 'net_refund', 'totalRefund', 'total_refund', 'amount') ?? itemTotalValue(items),
  }, ['fetchSiNumber', 'siDateTime', 'returnNumber', 'dateTime', 'idNumber', 'bookedBy', 'priority', 'country', 'areaCity', 'cargoCourier', 'remarks', 'summary'])
}
type PurchasePayload = Record<string, any>

const numericValue = (value: unknown) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : undefined
}

const valueFrom = (payload: PurchasePayload, ...keys: string[]) => {
  const summary = payload.summary && typeof payload.summary === 'object' ? payload.summary : {}
  for (const key of keys) {
    if (payload[key] !== undefined) return payload[key]
    if (summary[key] !== undefined) return summary[key]
  }
  return undefined
}

const itemTotal = (items: any[] | undefined) =>
  items?.reduce((total, item) => total + Number(item.qty ?? item.quantity ?? 0), 0)

const itemValueTotal = (items: any[] | undefined) =>
  items?.reduce((total, item) => {
    const itemValue = numericValue(item.amount) ?? numericValue(item.total) ?? (numericValue(item.price) ?? 0) * (numericValue(item.qty ?? item.quantity) ?? 0)
    return total + (itemValue ?? 0)
  }, 0)

const detailsValue = (value: unknown) => {
  if (typeof value !== 'string') return value && typeof value === 'object' ? value : {}
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' ? parsed : { remarks: value }
  } catch {
    return { remarks: value }
  }
}

const normalize = (
  payload: PurchasePayload,
  detailsField: 'orderDetails' | 'invoiceDetails' | 'returnDetails',
  canonical: Record<string, unknown>,
  detailKeys: string[]
) => {
  const details = { ...detailsValue(payload[detailsField]) } as Record<string, unknown>
  const hasDetails = payload[detailsField] !== undefined || payload.items !== undefined || detailKeys.some((key) => payload[key] !== undefined)
  for (const key of detailKeys) {
    if (payload[key] !== undefined) details[key] = payload[key]
  }
  if (payload.items !== undefined) details.items = payload.items

  const normalized: PurchasePayload = {
    status: payload.status,
    actions: payload.actions,
  }
  for (const [key, value] of Object.entries(canonical)) {
    if (value !== undefined) normalized[key] = value
  }
  if (hasDetails) {
    const isLegacyText = typeof payload[detailsField] === 'string' &&
      payload.items === undefined &&
      detailKeys.every((key) => payload[key] === undefined)
    normalized[detailsField] = isLegacyText ? payload[detailsField] : JSON.stringify(details)
  }
  return normalized
}

export const normalizePurchaseOrderPayload = (payload: PurchasePayload) => {
  const items = payload.items
  return normalize(
    payload,
    'orderDetails',
    {
      name: valueFrom(payload, 'name', 'poNumber'),
      supplierId: valueFrom(payload, 'supplierId', 'supplier'),
      productId: valueFrom(payload, 'productId', 'items') === items
        ? items?.[0]?.productId
        : valueFrom(payload, 'productId'),
      noOfItems: valueFrom(payload, 'noOfItems', 'totalItems', 'total_items') ?? itemTotal(items),
      orderValue: valueFrom(payload, 'orderValue', 'netValue', 'net_value', 'totalValue', 'total_value') ?? itemValueTotal(items),
    },
    ['poNumber', 'dateTime', 'refNumber', 'bookedBy', 'country', 'areaCity', 'address', 'priority', 'remarks', 'summary']
  )
}

export const normalizePurchaseInvoicePayload = (payload: PurchasePayload) => {
  const items = payload.items
  return normalize(
    payload,
    'invoiceDetails',
    {
      name: valueFrom(payload, 'name', 'invoiceNumber'),
      purchaseOrderId: valueFrom(payload, 'purchaseOrderId', 'fetchPoId'),
      supplierId: valueFrom(payload, 'supplierId'),
      noOfItems: valueFrom(payload, 'noOfItems', 'totalItems', 'total_items') ?? itemTotal(items),
      invoiceValue: valueFrom(payload, 'invoiceValue', 'netValue', 'net_value', 'totalValue', 'total_value', 'amount') ?? itemValueTotal(items),
    },
    ['fetchPoNumber', 'poDateTime', 'invoiceNumber', 'dateTime', 'idNumber', 'bookedBy', 'priority', 'country', 'areaCity', 'cargoCourier', 'remarks', 'summary', 'paymentMethod']
  )
}

export const normalizePurchaseReturnPayload = (payload: PurchasePayload) => {
  const items = payload.items
  return normalize(
    payload,
    'returnDetails',
    {
      name: valueFrom(payload, 'name', 'returnNumber'),
      purchaseInvoiceId: valueFrom(payload, 'purchaseInvoiceId', 'fetchPiId'),
      supplierId: valueFrom(payload, 'supplierId', 'supplier'),
      noOfCartons: valueFrom(payload, 'noOfCartons', 'totalCartons', 'total_cartons') ?? itemTotal(items),
      refundValue: valueFrom(payload, 'refundValue', 'netRefund', 'net_refund', 'totalRefund', 'total_refund', 'amount') ?? itemValueTotal(items),
    },
    ['fetchPiNumber', 'piDateTime', 'returnNumber', 'dateTime', 'idNumber', 'bookedBy', 'priority', 'country', 'areaCity', 'cargoCourier', 'remarks', 'summary']
  )
}
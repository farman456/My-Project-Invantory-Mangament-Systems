import Payment from '#models/payment'
export const createPayment = (payload: any) => Payment.create(payload)
export const listPayments = () => Payment.query().orderBy('id', 'desc')
export const getPayment = async (id: number) => { const item = await Payment.find(id); if (!item) throw new Error(`Payment with ID: ${id} does not exist`); return item }
export const updatePayment = async (id: number, payload: any) => { const item = await getPayment(id); return item.merge(payload).save() }
export const deletePayment = async (id: number) => { const item = await getPayment(id); await item.delete() }

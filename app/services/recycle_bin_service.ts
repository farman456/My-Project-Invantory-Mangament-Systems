import db from '@adonisjs/lucid/services/db'
import RecycleBin from '#models/recycle_bin'
import { DateTime } from 'luxon'

const missing = (id: number) => new Error(`Recycle bin record with ID: ${id} does not exist`)

export const listDeletedRecords = async () => {
  const metadata = await RecycleBin.query().orderBy('deletedAt', 'desc')
  const knownIds = new Set(metadata.map((item) => `${item.source}:${item.recordId}`))
  const legacyUsers = await db.from('users').leftJoin('persons', 'persons.id', 'users.person_id').whereNotNull('users.deleted_at').select('users.id', 'users.email', 'users.deleted_at', 'persons.name')
  return [
    ...metadata.map((item) => ({ id: item.id, record: item.record, source: item.source, recordId: item.recordId, deletedAt: item.deletedAt, deletedBy: item.deletedBy })),
    ...legacyUsers.filter((user) => !knownIds.has(`users:${user.id}`)).map((user) => ({ id: null, record: user, source: 'users', recordId: user.id, deletedAt: user.deleted_at, deletedBy: null })),
  ]
}

export const getDeletedRecord = async (id: number) => {
  const item = await RecycleBin.find(id)
  if (!item) throw missing(id)
  return { id: item.id, record: item.record, source: item.source, recordId: item.recordId, deletedAt: item.deletedAt, deletedBy: item.deletedBy }
}

export const recordSoftDeletedUser = async (user: any, deletedBy: number | null) => {
  const record = { id: user.id, name: user.name, email: user.email, roleId: user.roleId, status: user.status }
  return RecycleBin.updateOrCreate({ source: 'users', recordId: user.id }, { source: 'users', recordId: user.id, deletedAt: DateTime.now(), deletedBy, record })
}

export const restoreDeletedRecord = async (id: number) => {
  const item = await RecycleBin.find(id)
  if (!item) throw missing(id)
  if (item.source !== 'users') throw new Error(`Restore is not supported for source: ${item.source}`)
  const email = String(item.record.email ?? '').replace(/_[a-z0-9]+$/, '')
  await db.transaction(async (trx) => {
    await trx.from('users').where('id', item.recordId).update({ deleted_at: null, email })
    await trx.from('recycle_bin').where('id', id).delete()
  })
  return { restored: true, source: item.source, recordId: item.recordId }
}

export const permanentlyDeleteRecord = async (id: number) => {
  const item = await RecycleBin.find(id)
  if (!item) throw missing(id)
  await db.transaction(async (trx) => {
    if (item.source === 'users') await trx.from('users').where('id', item.recordId).delete()
    else throw new Error(`Permanent delete is not supported for source: ${item.source}`)
    await trx.from('recycle_bin').where('id', id).delete()
  })
  return { deleted: true, source: item.source, recordId: item.recordId }
}

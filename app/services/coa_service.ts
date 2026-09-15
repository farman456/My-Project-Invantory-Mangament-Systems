import db from '@adonisjs/lucid/services/db'
import AccountHead from '#models/account_head'
import AccountSubHead from '#models/account_sub_head'
import AccountName from '#models/account_name'
import type {
  BulkAccountNamesPayload,
  CoaQuery,
  CreateAccountNamePayload,
  CreateSubHeadPayload,
  UpdateAccountNamePayload,
  UpdateSubHeadPayload,
} from '#validators/coa_validator'

type ListOptions = Partial<CoaQuery> & { page?: number; perPage?: number }

const validationError = (message: string, field = 'coa') => {
  const error = new Error(message) as Error & { code: string; messages: unknown[] }
  error.code = 'E_VALIDATION_ERROR'
  error.messages = [{ message, rule: 'coa', field }]
  return error
}

const notFoundError = (message: string) => new Error(message)

const pageOptions = (options: ListOptions) => ({
  page: options.page ?? 1,
  perPage: options.perPage ?? 25,
})

export const listHeads = async (options: ListOptions = {}) => {
  const query = AccountHead.query()
  if (options.search) query.whereILike('account_heads.name', `%${options.search}%`)
  if (options.status !== undefined) query.where('account_heads.status', options.status)
  query.orderBy(options.sortBy === 'name' ? 'name' : options.sortBy === 'status' ? 'status' : 'id', options.sortOrder === 'desc' ? 'desc' : 'asc')
  const paginator = await query.paginate(pageOptions(options).page, pageOptions(options).perPage)
  return {
    items: paginator.all(),
    pagination: { total: paginator.total, perPage: paginator.perPage, currentPage: paginator.currentPage, lastPage: paginator.lastPage },
  }
}

export const listSubHeads = async (headId: number, options: ListOptions = {}) => {
  const head = await AccountHead.find(headId)
  if (!head) throw notFoundError(`Account head with ID: ${headId} does not exist`)
  const query = AccountSubHead.query().where('account_sub_heads.account_head_id', headId)
  if (options.search) query.whereILike('account_sub_heads.name', `%${options.search}%`)
  if (options.status !== undefined) query.where('account_sub_heads.status', options.status)
  query.orderBy(options.sortBy === 'name' ? 'name' : 'id', options.sortOrder === 'desc' ? 'desc' : 'asc')
  const paginator = await query.paginate(pageOptions(options).page, pageOptions(options).perPage)
  return {
    items: paginator.all(),
    pagination: { total: paginator.total, perPage: paginator.perPage, currentPage: paginator.currentPage, lastPage: paginator.lastPage },
  }
}

export const listNames = async (subHeadId: number, options: ListOptions = {}) => {
  const subHead = await AccountSubHead.find(subHeadId)
  if (!subHead) throw notFoundError(`Account sub-head with ID: ${subHeadId} does not exist`)
  const query = AccountName.query().where('account_names.account_sub_head_id', subHeadId)
  if (options.search) query.whereILike('account_names.name', `%${options.search}%`)
  if (options.status !== undefined) query.where('account_names.status', options.status)
  query.orderBy(options.sortBy === 'name' ? 'name' : 'id', options.sortOrder === 'desc' ? 'desc' : 'asc')
  const paginator = await query.paginate(pageOptions(options).page, pageOptions(options).perPage)
  return {
    items: paginator.all(),
    pagination: { total: paginator.total, perPage: paginator.perPage, currentPage: paginator.currentPage, lastPage: paginator.lastPage },
  }
}

export const listCoa = async (options: ListOptions = {}) => {
  const query = db
    .from('account_names')
    .join('account_sub_heads', 'account_sub_heads.id', 'account_names.account_sub_head_id')
    .join('account_heads', 'account_heads.id', 'account_sub_heads.account_head_id')
    .select(
      'account_names.id',
      'account_names.name',
      'account_names.status',
      'account_sub_heads.id as subHeadId',
      'account_sub_heads.name as subHeadName',
      'account_heads.id as headId',
      'account_heads.slug as headSlug',
      'account_heads.name as headName'
    )
  if (options.search) query.where((searchQuery: any) => searchQuery.whereILike('account_names.name', `%${options.search}%`).orWhereILike('account_sub_heads.name', `%${options.search}%`).orWhereILike('account_heads.name', `%${options.search}%`))
  if (options.headId !== undefined) query.where('account_heads.id', options.headId)
  if (options.subHeadId !== undefined) query.where('account_sub_heads.id', options.subHeadId)
  if (options.status !== undefined) query.where('account_names.status', options.status)
  const sort = options.sortBy === 'name' ? 'account_names.name' : options.sortBy === 'id' ? 'account_names.id' : 'account_names.id'
  query.orderBy(sort, options.sortOrder === 'desc' ? 'desc' : 'asc')
  const paginator = await query.paginate(pageOptions(options).page, pageOptions(options).perPage)
  return {
    items: paginator.all(),
    pagination: { total: paginator.total, perPage: paginator.perPage, currentPage: paginator.currentPage, lastPage: paginator.lastPage },
  }
}

export const getTree = async () => {
  const heads = await AccountHead.query().orderBy('id', 'asc').preload('subHeads', (subQuery) => {
    subQuery.orderBy('id', 'asc').preload('names', (nameQuery) => nameQuery.orderBy('id', 'asc'))
  })
  return heads.map((head) => head.serialize())
}

const findHead = async (headId: number) => {
  const head = await AccountHead.find(headId)
  if (!head) throw notFoundError(`Account head with ID: ${headId} does not exist`)
  return head
}

const findSubHead = async (subHeadId: number) => {
  const subHead = await AccountSubHead.find(subHeadId)
  if (!subHead) throw notFoundError(`Account sub-head with ID: ${subHeadId} does not exist`)
  return subHead
}

const assertSubHeadParent = async (headId: number, subHeadId: number) => {
  await findHead(headId)
  const subHead = await findSubHead(subHeadId)
  if (subHead.accountHeadId !== headId) throw validationError('Sub-head does not belong to the selected account head', 'subHeadId')
  return subHead
}

export const createSubHead = async (payload: CreateSubHeadPayload) => {
  await findHead(payload.headId)
  const duplicate = await AccountSubHead.query().where('accountHeadId', payload.headId).where('name', payload.name).first()
  if (duplicate) throw validationError('A sub-head with this name already exists under the selected account head', 'name')
  return AccountSubHead.create({ accountHeadId: payload.headId, name: payload.name, status: payload.status ?? 'active' })
}

export const updateSubHead = async (subHeadId: number, payload: UpdateSubHeadPayload) => {
  const subHead = await findSubHead(subHeadId)
  const accountHeadId = payload.headId ?? subHead.accountHeadId
  await findHead(accountHeadId)
  if (payload.headId !== undefined && payload.headId !== subHead.accountHeadId) {
    const duplicate = await AccountSubHead.query().where('accountHeadId', accountHeadId).where('name', payload.name ?? subHead.name).whereNot('id', subHeadId).first()
    if (duplicate) throw validationError('A sub-head with this name already exists under the selected account head', 'name')
  }
  if (payload.name !== undefined) {
    const duplicate = await AccountSubHead.query().where('accountHeadId', accountHeadId).where('name', payload.name).whereNot('id', subHeadId).first()
    if (duplicate) throw validationError('A sub-head with this name already exists under the selected account head', 'name')
  }
  return subHead.merge({ accountHeadId, name: payload.name, status: payload.status }).save()
}

export const createAccountName = async (payload: CreateAccountNamePayload) => {
  await assertSubHeadParent(payload.headId, payload.subHeadId)
  const duplicate = await AccountName.query().where('accountSubHeadId', payload.subHeadId).where('name', payload.name).first()
  if (duplicate) throw validationError('An account name with this name already exists under the selected sub-head', 'name')
  return AccountName.create({ accountSubHeadId: payload.subHeadId, name: payload.name, status: payload.status ?? 'active' })
}

export const updateAccountName = async (accountNameId: number, payload: UpdateAccountNamePayload) => {
  const accountName = await AccountName.find(accountNameId)
  if (!accountName) throw notFoundError(`Account name with ID: ${accountNameId} does not exist`)
  const subHeadId = payload.subHeadId ?? accountName.accountSubHeadId
  if (payload.headId !== undefined) await assertSubHeadParent(payload.headId, subHeadId)
  else await findSubHead(subHeadId)
  const duplicate = await AccountName.query().where('accountSubHeadId', subHeadId).where('name', payload.name ?? accountName.name).whereNot('id', accountNameId).first()
  if (duplicate) throw validationError('An account name with this name already exists under the selected sub-head', 'name')
  return accountName.merge({ accountSubHeadId: subHeadId, name: payload.name, status: payload.status }).save()
}

export const createAccountNames = async (payload: BulkAccountNamesPayload) => {
  await assertSubHeadParent(payload.headId, payload.subHeadId)
  const uniqueNames = new Set(payload.names)
  if (uniqueNames.size !== payload.names.length) throw validationError('Duplicate names are not allowed in a bulk request', 'names')
  const existing = await AccountName.query().where('accountSubHeadId', payload.subHeadId).whereIn('name', payload.names).first()
  if (existing) throw validationError('One or more account names already exist under the selected sub-head', 'names')
  const transaction = await db.transaction()
  try {
    const records = []
    for (const name of payload.names) records.push(await transaction.table('account_names').insert({ account_sub_head_id: payload.subHeadId, name, status: payload.status ?? 'active' }))
    await transaction.commit()
    return AccountName.query().whereIn('id', records.map((record) => record[0]))
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const deleteSubHead = async (subHeadId: number) => {
  await findSubHead(subHeadId)
  const childCount = await AccountName.query().where('accountSubHeadId', subHeadId).count('* as total')
  if (Number(childCount[0].$extras.total) > 0) throw validationError('Sub-head cannot be deleted while account names exist', 'subHeadId')
  await AccountSubHead.query().where('id', subHeadId).delete()
}

export const deleteAccountHead = async (accountHeadId: number) => {
  const accountHead = await findHead(accountHeadId)
  const childCount = await AccountSubHead.query().where('accountHeadId', accountHeadId).count('* as total')
  if (Number(childCount[0].$extras.total) > 0) throw validationError('Account head cannot be deleted while sub-heads exist', 'headId')
  await accountHead.delete()
}

export const deleteAccountName = async (accountNameId: number) => {
  const accountName = await AccountName.find(accountNameId)
  if (!accountName) throw notFoundError(`Account name with ID: ${accountNameId} does not exist`)
  await accountName.delete()
}

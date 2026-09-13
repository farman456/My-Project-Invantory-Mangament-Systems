import db from '@adonisjs/lucid/services/db'
import Category from '#models/category'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import {
  createCategoryValidatorInterface,
  updateCategoryPatchValidatorInterface,
  updateCategoryValidatorInterface,
} from '#validators/category_validator'

const personSelect = [
  'categories.id',
  'categories.person_id as personId',
  'persons.name',
  'persons.contact_person as contactPerson',
  'persons.phone',
  'persons.email',
  'persons.area_city as areaCity',
  'persons.status',
  'persons.actions',
]

export const listCategories = async (page = 1, perPage = 100, options: ListQueryOptions = {}) => {
  try {
    const query = applyListQuery(db.from('categories'), options, {
      searchColumns: ['persons.name', 'persons.contact_person', 'persons.email'],
      sortColumns: { id: 'categories.id', name: 'persons.name', status: 'persons.status' },
    }).join('persons', 'persons.id', 'categories.person_id')
    if (options.status !== undefined) query.where('persons.status', options.status)
    const paginator = await query.select(...personSelect).paginate(page, perPage)
    return {
      items: paginator.all(),
      pagination: {
        total: paginator.total,
        perPage: paginator.perPage,
        currentPage: paginator.currentPage,
        lastPage: paginator.lastPage,
      },
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error retrieving categories: ${message}`)
  }
}

export const createCategory = async (payload: createCategoryValidatorInterface) => {
  const transaction = await db.transaction()
  try {
    const [personId] = await transaction.table('persons').insert({
      name: payload.name,
      contact_person: payload.contactPerson,
      phone: payload.phone,
      email: payload.email,
      area_city: payload.areaCity,
      status: payload.status,
      actions: payload.actions,
    })
    const [categoryId] = await transaction.table('categories').insert({ person_id: personId })
    await transaction.commit()
    return { id: categoryId, personId, ...payload }
  } catch (error) {
    await transaction.rollback()
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error creating category: ${message}`)
  }
}

export const getCategory = async (categoryId: number) => {
  try {
    const category = await db
      .from('categories')
      .join('persons', 'persons.id', 'categories.person_id')
      .select(...personSelect)
      .where('categories.id', categoryId)
      .first()
    if (!category) throw new Error(`Category with ID: ${categoryId} does not exist`)
    return category
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error retrieving category: ${message}`)
  }
}

export const updateCategory = async (
  payload: updateCategoryValidatorInterface | updateCategoryPatchValidatorInterface,
  categoryId: number
) => {
  const transaction = await db.transaction()
  try {
    const category = await Category.find(categoryId)
    if (!category) throw new Error(`Category with ID: ${categoryId} does not exist`)
    if (!category.personId) throw new Error(`Category with ID: ${categoryId} has no person record`)
    const data: Record<string, unknown> = {}
    if (payload.name !== undefined) data.name = payload.name
    if (payload.contactPerson !== undefined) data.contact_person = payload.contactPerson
    if (payload.phone !== undefined) data.phone = payload.phone
    if (payload.email !== undefined) data.email = payload.email
    if (payload.areaCity !== undefined) data.area_city = payload.areaCity
    if (payload.status !== undefined) data.status = payload.status
    if (payload.actions !== undefined) data.actions = payload.actions
    await transaction.from('persons').where('id', category.personId).update(data)
    await transaction.commit()
    return { id: category.id, personId: category.personId, ...payload }
  } catch (error) {
    await transaction.rollback()
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error updating category: ${message}`)
  }
}

export const deleteCategory = async (categoryId: number) => {
  const transaction = await db.transaction()
  try {
    const category = await Category.find(categoryId)
    if (!category) throw new Error(`Category with ID: ${categoryId} does not exist`)
    if (!category.personId) throw new Error(`Category with ID: ${categoryId} has no person record`)
    await transaction.from('categories').where('id', categoryId).delete()
    await transaction.from('persons').where('id', category.personId).delete()
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    const databaseError = error as { code?: string; errno?: number }
    const message = databaseError.code === 'ER_ROW_IS_REFERENCED_2' || databaseError.errno === 1451
      ? 'Category cannot be deleted because it is referenced by another record'
      : error instanceof Error ? error.message : String(error)
    throw new Error(`Error deleting category: ${message}`)
  }
}
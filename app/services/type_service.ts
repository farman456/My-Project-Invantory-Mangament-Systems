import Type from '#models/type'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import {
  createTypeValidatorInterface,
  typeListQueryValidatorInterface,
  updateTypePatchValidatorInterface,
  updateTypeValidatorInterface,
} from '#validators/type_validator'

type TypeListQueryOptions = ListQueryOptions & Partial<typeListQueryValidatorInterface>

export const listTypes = async (page = 1, perPage = 100, options: TypeListQueryOptions = {}) => {
  try {
    const query = applyListQuery(Type.query(), options, {
      searchColumns: ['types.name'],
      sortColumns: { id: 'types.id', name: 'types.name' },
    })
    if (options.investigationRequired !== undefined) {
      query.where('types.investigation_required', options.investigationRequired)
    }
    if (options.status !== undefined) {
      query.where('types.status', options.status)
    }
    const paginator = await query
      .select('id', 'name', 'description', 'status')
      .paginate(page, perPage)

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
    throw new Error(`Error retrieving types: ${message}`)
  }
}

export const getType = async (typeId: number) => {
  try {
    const type = await Type.find(typeId)
    if (!type) {
      throw new Error(`Type with ID: ${typeId} does not exist`)
    }
    return { id: type.id, name: type.name, description: type.description, status: type.status }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error retrieving type: ${message}`)
  }
}

export const createType = async (payload: createTypeValidatorInterface) => {
  try {
    const type = await Type.create({
      name: payload.name,
      description: payload.description,
      investigationRequired: payload.investigationRequired,
      status: payload.status,
    })

    return {
      id: type.id,
      name: type.name,
      description: type.description,
      status: type.status,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error creating type: ${message}`)
  }
}

export const updateType = async (
  payload: updateTypeValidatorInterface | updateTypePatchValidatorInterface,
  typeId: number
) => {
  try {
    const type = await Type.find(typeId)

    if (!type) {
      throw new Error(`Type with ID: ${typeId} does not exist`)
    }

    await type.merge({
      name: payload.name,
      description: payload.description,
      investigationRequired: payload.investigationRequired,
      status: payload.status,
    }).save()

    return {
      id: type.id,
      name: type.name,
      description: type.description,
      status: type.status,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error updating type: ${message}`)
  }
}

export const deleteType = async (typeId: number) => {
  try {
    const type = await Type.find(typeId)

    if (!type) {
      throw new Error(`Type with ID: ${typeId} does not exist`)
    }

    await type.delete()
  } catch (error) {
    const databaseError = error as { code?: string; errno?: number }
    const isReferenced =
      databaseError.code === 'ER_ROW_IS_REFERENCED_2' ||
      databaseError.code === '23503' ||
      databaseError.errno === 1451
    const message = isReferenced
      ? 'Type cannot be deleted because it is referenced by one or more products'
      : error instanceof Error
        ? error.message
        : String(error)

    const deletionError = new Error(`Error deleting type: ${message}`) as Error & {
      code?: string
      errno?: number
    }
    if (isReferenced) {
      deletionError.code = '23503'
      deletionError.errno = 1451
    }
    throw deletionError
  }
}

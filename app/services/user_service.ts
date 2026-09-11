import User, { userFilterEnum, userSortEnum } from '#models/user'
import {
  createUserValidatorInterface,
  updateUserValidatorInterface,
} from '#validators/user_validator'
import { applySorting } from '#services/apply_sorting'
import { paginateQuery } from '#services/apply_pagination'
import { applyFilters } from '#services/apply_filter'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'

export const userListing = async (
  page?: number,
  pageSize?: number,
  filters?: Array<any>,
  sorts?: Array<any>,
  options: ListQueryOptions = {}
) => {
  try {
    let query: any
    let filterData: any
    let sortUser: any
    let userListings: any = applyListQuery(User.query(), options, {
      searchColumns: ['users.name', 'users.email'],
      sortColumns: { id: 'users.id', name: 'users.name', email: 'users.email', status: 'users.status' },
    })
    if (options.status !== undefined) userListings.where('users.status', options.status)

    if (filters?.length) {
      filterData = applyFilters(userListings, filters, userFilterEnum)
    }
    if (filterData?.status === false) {
      return {
        status: filterData.status,
        message: filterData.message,
      }
    }
    query = filterData?.query ?? userListings
    if (sorts?.length) {
      sortUser = applySorting(query, sorts, userSortEnum)
      if (sortUser?.status) {
        return sortUser
      }
    }
    let sortQuery = sortUser?.query ?? query
    let userListingPaginated = await paginateQuery(sortQuery, pageSize, page)
    return {
      count: userListingPaginated['rows'].length,
      total_count: userListingPaginated.total,
      total_page_count: userListingPaginated.lastPage,
      page: userListingPaginated.currentPage,
      page_size: userListingPaginated.perPage,
      data: userListingPaginated['rows'].map((user: any) => ({
        ...user.serialize(),
      })),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error retrieving users: ${message}`)
  }
}

export const getUserById = async (userId: number) => {
  try {
    const userResponse = await User.query().where('id', userId).first()

    if (!userResponse) {
      throw new Error(`User with ID: ${userId} does not exist`)
    }
    return userResponse
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error getting user: ${message}`)
  }
}

export const deleteUser = async (user_id: number) => {
  try {
    const user = await getUserById(user_id)

    return await user.softDelete()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error deleting user: ${message}`)
  }
}

export const updateUser = async (payload: updateUserValidatorInterface, userId: number) => {
  try {
    const user = await getUserById(userId)
    const data: Record<string, any> = {}
    if (payload.name !== undefined) data.name = payload.name
    if (payload.email !== undefined) data.email = payload.email
    if (payload.role_id !== undefined) data.roleId = payload.role_id
    if (payload.status !== undefined) data.status = payload.status

    return await user.merge(data).save()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error updating user: ${message}`)
  }
}

export const createUser = async (payload: createUserValidatorInterface) => {
  try {
    return await User.create({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      roleId: payload.role_id,
      status: 'active',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error creating user: ${message}`)
  }
}

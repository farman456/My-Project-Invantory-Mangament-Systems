import DepartmentDesignation from '#models/department_designation'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import {
  createDepartmentDesignationValidatorInterface,
  updateDepartmentDesignationPatchValidatorInterface,
  updateDepartmentDesignationValidatorInterface,
} from '#validators/department_designation_validator'

export const listDepartmentDesignations = async (
  page = 1,
  perPage = 100,
  options: ListQueryOptions = {}
) => {
  try {
    const query = applyListQuery(DepartmentDesignation.query(), options, {
      searchColumns: ['department_designation.department', 'department_designation.designation'],
      sortColumns: {
        id: 'department_designation.id',
        department: 'department_designation.department',
        designation: 'department_designation.designation',
        status: 'department_designation.status',
      },
    })

    if (options.status !== undefined) {
      query.where('department_designation.status', options.status)
    }

    const paginator = await query
      .select('id', 'department', 'designation', 'status', 'actions')
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
    throw new Error(`Error retrieving department/designations: ${message}`)
  }
}

export const createDepartmentDesignation = async (
  payload: createDepartmentDesignationValidatorInterface
) => {
  try {
    const item = await DepartmentDesignation.create({
      department: payload.department,
      designation: payload.designation,
      status: payload.status,
      actions: payload.actions,
    })

    return {
      id: item.id,
      department: item.department,
      designation: item.designation,
      status: item.status,
      actions: item.actions,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error creating department/designation: ${message}`)
  }
}

export const getDepartmentDesignation = async (departmentDesignationId: number) => {
  try {
    const item = await DepartmentDesignation.find(departmentDesignationId)

    if (!item) {
      throw new Error(`Department/Designation with ID: ${departmentDesignationId} does not exist`)
    }

    return {
      id: item.id,
      department: item.department,
      designation: item.designation,
      status: item.status,
      actions: item.actions,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error retrieving department/designation: ${message}`)
  }
}

export const updateDepartmentDesignation = async (
  payload: updateDepartmentDesignationValidatorInterface | updateDepartmentDesignationPatchValidatorInterface,
  departmentDesignationId: number
) => {
  try {
    const item = await DepartmentDesignation.find(departmentDesignationId)

    if (!item) {
      throw new Error(`Department/Designation with ID: ${departmentDesignationId} does not exist`)
    }

    const data: Record<string, any> = {}
    if (payload.department !== undefined) data.department = payload.department
    if (payload.designation !== undefined) data.designation = payload.designation
    if (payload.status !== undefined) data.status = payload.status
    if (payload.actions !== undefined) data.actions = payload.actions

    const updated = await item.merge(data).save()

    return {
      id: updated.id,
      department: updated.department,
      designation: updated.designation,
      status: updated.status,
      actions: updated.actions,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error updating department/designation: ${message}`)
  }
}

export const deleteDepartmentDesignation = async (departmentDesignationId: number) => {
  try {
    const item = await DepartmentDesignation.find(departmentDesignationId)

    if (!item) {
      throw new Error(`Department/Designation with ID: ${departmentDesignationId} does not exist`)
    }

    await item.delete()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error deleting department/designation: ${message}`)
  }
}

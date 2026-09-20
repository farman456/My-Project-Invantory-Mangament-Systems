import Product from '#models/product'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import {
  createProductValidatorInterface,
  updateProductPatchValidatorInterface,
  updateProductValidatorInterface,
} from '#validators/product_validator'

export const listProducts = async (page = 1, perPage = 100, options: ListQueryOptions = {}) => {
  try {
    const query = applyListQuery(Product.query(), options, {
      searchColumns: ['products.name'],
      sortColumns: { id: 'products.id', name: 'products.name', price: 'products.price', status: 'products.status' },
    })
    if (options.type !== undefined) query.where('products.type_id', options.type)
    if (options.category !== undefined) query.where('products.category_id', options.category)
    if (options.distributor !== undefined) query.where('products.distributor_id', options.distributor)
    if (options.manufacturer !== undefined) query.where('products.manufacturer_id', options.manufacturer)
    if (options.supplier !== undefined) query.where('products.supplier_id', options.supplier)
    if (options.status !== undefined) query.where('products.status', options.status)
    if (options.minPrice !== undefined) query.where('products.price', '>=', options.minPrice)
    if (options.maxPrice !== undefined) query.where('products.price', '<=', options.maxPrice)

    const paginator = await query
      .select(
        'id',
        'type_id',
        'category_id',
        'distributor_id',
        'manufacturer_id',
        'name',
        'price',
        'supplier_id',
        'status',
        'actions'
      )
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
    throw new Error(`Error retrieving products: ${message}`)
  }
}

export const createProduct = async (payload: createProductValidatorInterface) => {
  try {
    return await Product.create({
      name: payload.name,
      typeId: payload.type,
      categoryId: payload.category,
      distributorId: payload.distributor,
      manufacturerId: payload.manufacturer,
      supplierId: payload.supplier,
      price: payload.price,
      status: payload.status,
      actions: payload.actions,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error creating product: ${message}`)
  }
}

export const updateProduct = async (
  payload: updateProductValidatorInterface | updateProductPatchValidatorInterface,
  productId: number
) => {
  try {
    const product = await Product.find(productId)

    if (!product) {
      throw new Error(`Product with ID: ${productId} does not exist`)
    }

    const data: Record<string, any> = {}
    if (payload.name !== undefined) data.name = payload.name
    if (payload.type !== undefined) data.typeId = payload.type
    if (payload.category !== undefined) data.categoryId = payload.category
    if (payload.distributor !== undefined) data.distributorId = payload.distributor
    if (payload.manufacturer !== undefined) data.manufacturerId = payload.manufacturer
    if (payload.supplier !== undefined) data.supplierId = payload.supplier
    if (payload.price !== undefined) data.price = payload.price
    if (payload.status !== undefined) data.status = payload.status
    if (payload.actions !== undefined) data.actions = payload.actions

    return await product.merge(data).save()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error updating product: ${message}`)
  }
}

export const deleteProduct = async (productId: number) => {
  try {
    const product = await Product.find(productId)

    if (!product) {
      throw new Error(`Product with ID: ${productId} does not exist`)
    }

    await product.delete()
  } catch (error) {
    const databaseError = error as { code?: string; errno?: number }
    const message = error instanceof Error ? error.message : String(error)
    const deletionError = new Error(`Error deleting product: ${message}`) as Error & {
      code?: string
      errno?: number
    }
    if (
      databaseError.code === 'ER_ROW_IS_REFERENCED_2' ||
      databaseError.code === '23503' ||
      databaseError.errno === 1451
    ) {
      deletionError.code = '23503'
      deletionError.errno = 1451
    }
    throw deletionError
  }
}

export const getProduct = async (productId: number) => {
  try {
    const product = await Product.find(productId)

    if (!product) {
      throw new Error(`Product with ID: ${productId} does not exist`)
    }

    return product
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error retrieving product: ${message}`)
  }
}

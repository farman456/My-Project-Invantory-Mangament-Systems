import Product from '#models/product'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import {
  createProductValidatorInterface,
  updateProductValidatorInterface,
} from '#validators/product_validator'

export const listProducts = async (page = 1, perPage = 100, options: ListQueryOptions = {}) => {
  try {
    const query = applyListQuery(Product.query(), options, {
      searchColumns: ['products.name'],
      sortColumns: { id: 'products.id', name: 'products.name', price: 'products.price', status: 'products.status' },
    })
    if (options.type !== undefined) query.where('products.type', options.type)
    if (options.supplier !== undefined) query.where('products.supplier', options.supplier)
    if (options.status !== undefined) query.where('products.status', options.status)
    if (options.minPrice !== undefined) query.where('products.price', '>=', options.minPrice)
    if (options.maxPrice !== undefined) query.where('products.price', '<=', options.maxPrice)

    const paginator = await query
      .select('id', 'type', 'name', 'price', 'supplier', 'status', 'actions')
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
    return await Product.create(payload)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error creating product: ${message}`)
  }
}

export const updateProduct = async (
  payload: updateProductValidatorInterface,
  productId: number
) => {
  try {
    const product = await Product.find(productId)

    if (!product) {
      throw new Error(`Product with ID: ${productId} does not exist`)
    }

    const data: Record<string, any> = {}
    if (payload.name !== undefined) data.name = payload.name
    if (payload.type !== undefined) data.type = payload.type
    if (payload.supplier !== undefined) data.supplier = payload.supplier
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
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error deleting product: ${message}`)
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

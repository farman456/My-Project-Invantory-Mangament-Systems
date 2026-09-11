import type { ListQueryOptions } from '#validators/list_query_validator'

export const applyListQuery = (
  query: any,
  options: ListQueryOptions,
  config: { searchColumns?: string[]; sortColumns: Record<string, string> }
) => {
  if (options.search && config.searchColumns?.length) {
    query.where((searchQuery: any) => {
      config.searchColumns?.forEach((column, index) => {
        if (index === 0) searchQuery.whereILike(column, `%${options.search}%`)
        else searchQuery.orWhereILike(column, `%${options.search}%`)
      })
    })
  }

  const sortColumn = config.sortColumns[options.sort ?? 'id'] ?? config.sortColumns.id
  query.orderBy(sortColumn, options.order === 'desc' ? 'desc' : 'asc')
  return query
}

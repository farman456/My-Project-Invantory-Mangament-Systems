import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const CategoryController = () => import('#controllers/category_controller')

router
  .group(() => {
    router.get('/', [CategoryController, 'index'])
    router.get('/:categoryId', [CategoryController, 'show'])
  })
  .prefix('api/categories')
  .use([middleware.auth()])

router
  .group(() => {
    router.post('/', [CategoryController, 'create'])
    router.put('/:categoryId', [CategoryController, 'update'])
    router.patch('/:categoryId', [CategoryController, 'update'])
    router.delete('/:categoryId', [CategoryController, 'delete'])
  })
  .prefix('api/categories')
  .use([middleware.auth(), middleware.authorize()])
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const ProductsController = () => import('#controllers/products_controller')

router
  .group(() => {
    router.get('/', [ProductsController, 'index'])
    router.get('/:productId', [ProductsController, 'show'])
    router.post('/', [ProductsController, 'create'])
    router.post('/:productId', [ProductsController, 'update'])
    router.put('/:productId', [ProductsController, 'update'])
    router.delete('/:productId', [ProductsController, 'delete'])
  })
  .prefix('api/products')
  .use([middleware.auth(), middleware.authorize()])

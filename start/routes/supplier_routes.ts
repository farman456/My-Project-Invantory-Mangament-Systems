import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const SuppliersController = () => import('#controllers/suppliers_controller')

router
  .group(() => {
    router.post('/', [SuppliersController, 'create'])
    router.get('/', [SuppliersController, 'options'])
    router.get('/:supplierId', [SuppliersController, 'show'])
    router.put('/:supplierId', [SuppliersController, 'update'])
    router.patch('/:supplierId', [SuppliersController, 'update'])
    router.delete('/:supplierId', [SuppliersController, 'destroy'])
  })
  .prefix('api/suppliers')
  .use([middleware.auth(), middleware.authorize()])

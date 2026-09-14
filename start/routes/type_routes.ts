import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const TypesController = () => import('#controllers/types_controller')

router
  .group(() => {
    router.get('/', [TypesController, 'options'])
    router.get('/:typeId', [TypesController, 'show'])
    router.post('/', [TypesController, 'store'])
    router.put('/:typeId', [TypesController, 'update'])
    router.patch('/:typeId', [TypesController, 'update'])
    router.delete('/:typeId', [TypesController, 'destroy'])
  })
  .prefix('api/types')
  .use([middleware.auth(), middleware.authorize()])

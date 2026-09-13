import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const DistributorController = () => import('#controllers/distributor_controller')

router
  .group(() => {
    router.get('/', [DistributorController, 'index'])
    router.get('/:distributorId', [DistributorController, 'show'])
  })
  .prefix('api/distributors')
  .use([middleware.auth()])

router
  .group(() => {
    router.post('/', [DistributorController, 'create'])
    router.put('/:distributorId', [DistributorController, 'update'])
    router.patch('/:distributorId', [DistributorController, 'update'])
    router.delete('/:distributorId', [DistributorController, 'delete'])
  })
  .prefix('api/distributors')
  .use([middleware.auth(), middleware.authorize()])
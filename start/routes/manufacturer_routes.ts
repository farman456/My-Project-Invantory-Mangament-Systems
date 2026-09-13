import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const ManufacturerController = () => import('#controllers/manufacturer_controller')

router
  .group(() => {
    router.get('/', [ManufacturerController, 'index'])
    router.get('/:manufacturerId', [ManufacturerController, 'show'])
  })
  .prefix('api/manufacturers')
  .use([middleware.auth()])

router
  .group(() => {
    router.post('/', [ManufacturerController, 'create'])
    router.put('/:manufacturerId', [ManufacturerController, 'update'])
    router.patch('/:manufacturerId', [ManufacturerController, 'update'])
    router.delete('/:manufacturerId', [ManufacturerController, 'delete'])
  })
  .prefix('api/manufacturers')
  .use([middleware.auth(), middleware.authorize()])
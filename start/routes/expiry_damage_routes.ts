import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const ExpiryDamageController = () => import('#controllers/expiry_damage_controller')

router
  .group(() => {
    router.get('/', [ExpiryDamageController, 'index'])
    router.get('/:expiryDamageId', [ExpiryDamageController, 'show'])
    router.post('/', [ExpiryDamageController, 'create'])
    router.post('/:expiryDamageId', [ExpiryDamageController, 'update'])
    router.put('/:expiryDamageId', [ExpiryDamageController, 'update'])
    router.patch('/:expiryDamageId', [ExpiryDamageController, 'update'])
    router.delete('/:expiryDamageId', [ExpiryDamageController, 'delete'])
  })
  .prefix('api/expiry-damage')
  .use([middleware.auth(), middleware.authorize()])

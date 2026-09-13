import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const PersonMasterController = () => import('#controllers/person_master_controller')

router
  .group(() => {
    router.get('/', [PersonMasterController, 'index'])
    router.get('/:personMasterId', [PersonMasterController, 'show'])
  })
  .prefix('api/persons')
  .use([middleware.auth()])

router
  .group(() => {
    router.post('/', [PersonMasterController, 'create'])
    router.put('/:personMasterId', [PersonMasterController, 'update'])
    router.patch('/:personMasterId', [PersonMasterController, 'partialUpdate'])
    router.delete('/:personMasterId', [PersonMasterController, 'delete'])
  })
  .prefix('api/persons')
  .use([middleware.auth(), middleware.authorize()])

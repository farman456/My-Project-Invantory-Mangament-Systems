import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const Controller = () => import('#controllers/incentive_schema_controller')

router.group(() => {
  router.get('/', [Controller, 'index'])
  router.get('/:incentiveSchemaId', [Controller, 'show'])
  router.post('/', [Controller, 'create'])
  router.patch('/:incentiveSchemaId', [Controller, 'update'])
  router.put('/:incentiveSchemaId', [Controller, 'update'])
  router.delete('/:incentiveSchemaId', [Controller, 'delete'])
}).prefix('api/incentive-schemas').use([middleware.auth(), middleware.authorize()])

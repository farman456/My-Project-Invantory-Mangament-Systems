import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const CustomerController = () => import('#controllers/customer_controller')

router
  .group(() => {
    router.get('/', [CustomerController, 'index'])
    router.get('/:customerId', [CustomerController, 'show'])
  })
  .prefix('api/customers')
  .use([middleware.auth()])

router
  .group(() => {
    router.post('/', [CustomerController, 'create'])
    router.put('/:customerId', [CustomerController, 'update'])
    router.patch('/:customerId', [CustomerController, 'update'])
    router.delete('/:customerId', [CustomerController, 'delete'])
  })
  .prefix('api/customers')
  .use([middleware.auth(), middleware.authorize()])
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const DeliveryVouchersController = () => import('#controllers/delivery_vouchers_controller')
router.group(() => {
  router.get('/', [DeliveryVouchersController, 'index'])
  router.get('/:deliveryVoucherId', [DeliveryVouchersController, 'show'])
}).prefix('api/delivery-vouchers').use([middleware.auth()])
router.group(() => {
  router.post('/', [DeliveryVouchersController, 'create'])
  router.put('/:deliveryVoucherId', [DeliveryVouchersController, 'update'])
  router.patch('/:deliveryVoucherId', [DeliveryVouchersController, 'update'])
  router.delete('/:deliveryVoucherId', [DeliveryVouchersController, 'delete'])
}).prefix('api/delivery-vouchers').use([middleware.auth(), middleware.authorize()])

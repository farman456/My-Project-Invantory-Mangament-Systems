import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const PurchaseInvoicesController = () => import('#controllers/purchase_invoices_controller')

router
  .group(() => {
    router.get('/', [PurchaseInvoicesController, 'index'])
    router.get('/:purchaseInvoiceId', [PurchaseInvoicesController, 'show'])
  })
  .prefix('api/purchase-invoices')
  .use([middleware.auth()])

router
  .group(() => {
    router.post('/', [PurchaseInvoicesController, 'create'])
    router.put('/:purchaseInvoiceId', [PurchaseInvoicesController, 'update'])
    router.patch('/:purchaseInvoiceId', [PurchaseInvoicesController, 'update'])
    router.delete('/:purchaseInvoiceId', [PurchaseInvoicesController, 'delete'])
  })
  .prefix('api/purchase-invoices')
  .use([middleware.auth(), middleware.authorize()])
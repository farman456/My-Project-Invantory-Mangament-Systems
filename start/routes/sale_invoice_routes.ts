import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const SaleInvoicesController = () => import('#controllers/sale_invoices_controller')
router.group(() => {
  router.get('/', [SaleInvoicesController, 'index'])
  router.get('/:saleInvoiceId', [SaleInvoicesController, 'show'])
}).prefix('api/sale-invoices').use([middleware.auth()])
router.group(() => {
  router.post('/', [SaleInvoicesController, 'create'])
  router.put('/:saleInvoiceId', [SaleInvoicesController, 'update'])
  router.patch('/:saleInvoiceId', [SaleInvoicesController, 'update'])
  router.delete('/:saleInvoiceId', [SaleInvoicesController, 'delete'])
}).prefix('api/sale-invoices').use([middleware.auth(), middleware.authorize()])

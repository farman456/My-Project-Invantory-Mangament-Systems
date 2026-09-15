import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const CoaController = () => import('#controllers/coa_controller')

router
  .group(() => {
    router.get('/', [CoaController, 'index'])
    router.get('/heads', [CoaController, 'heads'])
    router.get('/heads/:headId/sub-heads', [CoaController, 'subHeads'])
    router.get('/sub-heads/:subHeadId/names', [CoaController, 'names'])
    router.get('/tree', [CoaController, 'tree'])
    router.post('/sub-heads', [CoaController, 'createSubHead'])
    router.post('/names', [CoaController, 'createName'])
    router.post('/names/bulk', [CoaController, 'createBulkNames'])
    router.patch('/sub-heads/:id', [CoaController, 'updateSubHead'])
    router.patch('/names/:id', [CoaController, 'updateName'])
    router.delete('/heads/:id', [CoaController, 'deleteHead'])
    router.delete('/sub-heads/:id', [CoaController, 'deleteSubHead'])
    router.delete('/names/:id', [CoaController, 'deleteName'])
  })
  .prefix('api/coa')
  .use([middleware.auth(), middleware.authorize()])

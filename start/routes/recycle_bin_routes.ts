import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const RecycleBinController = () => import('#controllers/recycle_bin_controller')

router.group(() => {
  router.get('/', [RecycleBinController, 'index'])
  router.get('/:id', [RecycleBinController, 'show'])
  router.post('/:id/restore', [RecycleBinController, 'restore'])
  router.delete('/:id/permanent', [RecycleBinController, 'permanentDelete'])
}).prefix('api/recycle-bin').use([middleware.auth(), middleware.authorize()])

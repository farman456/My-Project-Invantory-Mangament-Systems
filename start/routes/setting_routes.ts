import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const SettingController = () => import('#controllers/setting_controller')

router.group(() => {
  router.get('/', [SettingController, 'show'])
  router.put('/', [SettingController, 'update'])
  router.patch('/', [SettingController, 'update'])
  router.post('/reset', [SettingController, 'reset'])
  router.post('/id-preview', [SettingController, 'preview'])
  router.post('/test-print', [SettingController, 'testPrint'])
}).prefix('api/settings').use([middleware.auth(), middleware.authorize()])

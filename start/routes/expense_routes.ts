import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const Controller = () => import('#controllers/expense_controller')
router.group(() => { router.get('/', [Controller, 'index']); router.get('/:id', [Controller, 'show']); router.post('/', [Controller, 'create']); router.patch('/:id', [Controller, 'update']); router.delete('/:id', [Controller, 'delete']) }).prefix('api/expenses').use([middleware.auth(), middleware.authorize()])

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const StaffAssignmentController = () => import('#controllers/staff_assignment_controller')

router
  .group(() => {
    router.get('/:staffId', [StaffAssignmentController, 'show'])
    router.post('/', [StaffAssignmentController, 'create'])
    router.patch('/:staffId', [StaffAssignmentController, 'update'])
  })
  .prefix('api/staff/assignments')
  .use([middleware.auth(), middleware.authorize()])

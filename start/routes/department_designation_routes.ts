import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const DepartmentDesignationController = () => import('#controllers/department_designation_controller')

router
  .group(() => {
    router.get('/', [DepartmentDesignationController, 'index'])
    router.get('/:departmentDesignationId', [DepartmentDesignationController, 'show'])
    router.post('/', [DepartmentDesignationController, 'create'])
    router.put('/:departmentDesignationId', [DepartmentDesignationController, 'update'])
    router.patch('/:departmentDesignationId', [DepartmentDesignationController, 'partialUpdate'])
    router.delete('/:departmentDesignationId', [DepartmentDesignationController, 'delete'])
  })
  .prefix('api/department-designation')
  .use([middleware.auth(), middleware.authorize()])

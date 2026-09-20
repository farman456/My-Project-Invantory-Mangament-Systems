import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const Controller = () => import('#controllers/incentive_rule_controller')

router.group(() => {
  router.get('/', [Controller, 'index'])
  router.get('/:incentiveRuleId', [Controller, 'show'])
  router.post('/', [Controller, 'create'])
  router.patch('/:incentiveRuleId', [Controller, 'update'])
  router.put('/:incentiveRuleId', [Controller, 'update'])
  router.delete('/:incentiveRuleId', [Controller, 'delete'])
}).prefix('api/incentive-rules').use([middleware.auth(), middleware.authorize()])

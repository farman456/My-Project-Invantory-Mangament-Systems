import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const InventoryLevelsController = () => import('#controllers/inventory_levels_controller')

router
  .group(() => {
    router.get('/', [InventoryLevelsController, 'index'])
    router.get('/:inventoryLevelId', [InventoryLevelsController, 'show'])
    router.post('/', [InventoryLevelsController, 'create'])
    router.put('/:inventoryLevelId', [InventoryLevelsController, 'update'])
    router.patch('/:inventoryLevelId', [InventoryLevelsController, 'update'])
    router.delete('/:inventoryLevelId', [InventoryLevelsController, 'delete'])
  })
  .prefix('api/inventory-levels')
  .use([middleware.auth(), middleware.authorize()])

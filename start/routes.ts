/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import '#start/routes/user_routes'
import '#start/routes/auth_routes'
import '#start/routes/email_routes'
import '#start/routes/product_routes'
import '#start/routes/type_routes'
import '#start/routes/supplier_routes'
import '#start/routes/purchase_order_routes'
import '#start/routes/purchase_invoice_routes'
import '#start/routes/purchase_return_routes'
import '#start/routes/stock_movement_routes'
import '#start/routes/expiry_damage_routes'
import '#start/routes/batch_holding_routes'
import '#start/routes/inventory_level_routes'

import { sendSuccess } from '#services/custom_response_service'

router.get('/', async () => {
  return sendSuccess('Server is running')
})

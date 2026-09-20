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
import '#start/routes/sale_order_routes'
import '#start/routes/sale_invoice_routes'
import '#start/routes/delivery_voucher_routes'
import '#start/routes/sale_return_routes'
import '#start/routes/stock_movement_routes'
import '#start/routes/expiry_damage_routes'
import '#start/routes/batch_holding_routes'
import '#start/routes/inventory_level_routes'
import '#start/routes/person_master_routes'
import '#start/routes/customer_routes'
import '#start/routes/manufacturer_routes'
import '#start/routes/distributor_routes'
import '#start/routes/category_routes'
import '#start/routes/department_designation_routes'
import './routes/staff_assignment_routes.js'
import '#start/routes/coa_routes'
import './routes/expense_routes.js'
import './routes/payment_routes.js'
import './routes/journal_routes.js'
import './routes/setting_routes.js'
import './routes/recycle_bin_routes.js'
import './routes/incentive_rule_routes.js'
import './routes/incentive_schema_routes.js'

import { sendSuccess } from '#services/custom_response_service'

router.get('/', async () => {
  return sendSuccess('Server is running')
})

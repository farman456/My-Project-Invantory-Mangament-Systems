import { test } from '@japa/runner'
import {
  createBatchHoldingValidator,
  updateBatchHoldingValidator,
} from '#validators/batch_holding_validator'
import {
  createExpiryDamageValidator,
  updateExpiryDamageValidator,
} from '#validators/expiry_damage_validator'
import { updateProductValidator } from '#validators/product_validator'
import {
  createStockMovementValidator,
  updateStockMovementValidator,
} from '#validators/stock_movement_validator'
import { updateUserValidator } from '#validators/user_validator'

/**
 * Validation-focused, non-destructive PUT/PATCH consistency tests.
 *
 * These tests only run validation. They never create, update or delete
 * records. The only database activity is the read-only SELECT performed by
 * the `exists` rule for FK fields that are supplied explicitly.
 */

type Validator = {
  validate: (data: Record<string, any>, options?: Record<string, any>) => Promise<any>
}

const validationError = async (validator: Validator, data: Record<string, any>) => {
  try {
    await validator.validate(data)
    return null
  } catch (error) {
    return error
  }
}

const hasRule = (error: any, rule: string): boolean => {
  return (
    error?.code === 'E_VALIDATION_ERROR' &&
    Array.isArray(error?.messages) &&
    error.messages.some((message: any) => message.rule === rule)
  )
}

test.group('Stock Movement PUT/PATCH validation', () => {
  test('PATCH accepts a single valid field', async ({ assert }) => {
    const error = await validationError(updateStockMovementValidator, { status: 'active' })
    assert.isNull(error)
  })

  test('PATCH accepts an empty body (partial update intent)', async ({ assert }) => {
    const error = await validationError(updateStockMovementValidator, {})
    assert.isNull(error)
  })

  test('PATCH rejects an invalid supplied FK', async ({ assert }) => {
    const error = await validationError(updateStockMovementValidator, { supplier: 999999999 })
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'database.exists'))
  })

  test('PATCH rejects an invalid supplied data type', async ({ assert }) => {
    const error = await validationError(updateStockMovementValidator, { supplier: 'not-a-number' })
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'number'))
  })

  test('PATCH validates nested details only when supplied', async ({ assert }) => {
    const error = await validationError(updateStockMovementValidator, {
      movementDetails: { movementNumber: 'SM-1' },
    })
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'required'))
  })

  test('PUT rejects a body missing required full-update fields', async ({ assert }) => {
    const error = await validationError(createStockMovementValidator, {})
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'required'))
  })

  test('PUT rejects an invalid supplied data type', async ({ assert }) => {
    const error = await validationError(createStockMovementValidator, {
      movementDetails: {
        movementNumber: 'SM-1',
        date: '2026-09-09',
        items: [{ productId: 1, quantity: 5, movementType: 'credit' }],
      },
      supplier: 'not-a-number',
      type: 1,
    })
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'number'))
  })

  test('PUT rejects an invalid supplied FK', async ({ assert }) => {
    const error = await validationError(createStockMovementValidator, {
      movementDetails: {
        movementNumber: 'SM-1',
        date: '2026-09-09',
        items: [{ productId: 1, quantity: 5, movementType: 'credit' }],
      },
      supplier: 999999999,
      type: 1,
    })
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'database.exists'))
  })
})

test.group('Batch Holding PUT/PATCH validation', () => {
  test('PATCH accepts a single valid field', async ({ assert }) => {
    const error = await validationError(updateBatchHoldingValidator, { status: 'active' })
    assert.isNull(error)
  })

  test('PATCH accepts an empty body (partial update intent)', async ({ assert }) => {
    const error = await validationError(updateBatchHoldingValidator, {})
    assert.isNull(error)
  })

  test('PATCH rejects an invalid supplied FK', async ({ assert }) => {
    const error = await validationError(updateBatchHoldingValidator, { supplier: 999999999 })
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'database.exists'))
  })

  test('PATCH rejects an invalid supplied data type', async ({ assert }) => {
    const error = await validationError(updateBatchHoldingValidator, { type: 'not-a-number' })
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'number'))
  })

  test('PUT rejects a body missing required full-update fields', async ({ assert }) => {
    const error = await validationError(createBatchHoldingValidator, {})
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'required'))
  })

  test('PUT rejects an invalid supplied FK', async ({ assert }) => {
    const error = await validationError(createBatchHoldingValidator, {
      batchDetails: {
        holdingNumber: 'BH-1',
        date: '2026-09-09',
        items: [{ productId: 1, quantity: 5, holdingType: 'hold' }],
      },
      supplier: 1,
      type: 999999999,
    })
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'database.exists'))
  })
})
test.group('Expiry Damage PUT/PATCH validation', () => {
  test('PATCH accepts a single valid field', async ({ assert }) => {
    const error = await validationError(updateExpiryDamageValidator, { status: 'completed' })
    assert.isNull(error)
  })

  test('PATCH accepts an empty body (partial update intent)', async ({ assert }) => {
    const error = await validationError(updateExpiryDamageValidator, {})
    assert.isNull(error)
  })

  test('PATCH rejects an invalid supplied FK', async ({ assert }) => {
    const error = await validationError(updateExpiryDamageValidator, { type: 999999999 })
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'database.exists'))
  })

  test('PATCH rejects an invalid supplied data type', async ({ assert }) => {
    const error = await validationError(updateExpiryDamageValidator, { supplier: 'not-a-number' })
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'number'))
  })

  test('PUT rejects a body missing required full-update fields', async ({ assert }) => {
    const error = await validationError(createExpiryDamageValidator, {})
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'required'))
  })

  test('PUT rejects an invalid supplied FK', async ({ assert }) => {
    const error = await validationError(createExpiryDamageValidator, {
      edDetails: {
        recordNumber: 'ED-1',
        date: '2026-09-09',
        items: [{ productId: 1, quantity: 5, itemType: 'expired' }],
      },
      supplier: 999999999,
      type: 1,
    })
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'database.exists'))
  })
})

test.group('User PATCH validation', () => {
  test('PATCH accepts a single valid field', async ({ assert }) => {
    const error = await validationError(updateUserValidator, { status: 'inactive' })
    assert.isNull(error)
  })

  test('PATCH accepts an empty body (partial update intent)', async ({ assert }) => {
    const error = await validationError(updateUserValidator, {})
    assert.isNull(error)
  })

  test('PATCH validates role_id existence only when supplied', async ({ assert }) => {
    const error = await validationError(updateUserValidator, { role_id: 999999999 })
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'database.exists'))
  })

  test('PATCH rejects an invalid supplied data type', async ({ assert }) => {
    const error = await validationError(updateUserValidator, { role_id: 'not-a-number' })
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'number'))
  })

  test('PATCH rejects an invalid supplied name type', async ({ assert }) => {
    const error = await validationError(updateUserValidator, { name: 12345 })
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'string'))
  })
})

test.group('Product PUT validation', () => {
  test('PUT rejects a body missing required full-update fields', async ({ assert }) => {
    const error = await validationError(updateProductValidator, {})
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'required'))
  })

  test('PUT rejects an invalid supplied data type', async ({ assert }) => {
    const error = await validationError(updateProductValidator, {
      name: 'Test product',
      type: 1,
      supplier: 1,
      price: 'not-a-number',
    })
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'number'))
  })
})

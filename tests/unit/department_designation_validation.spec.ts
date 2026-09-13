import { test } from '@japa/runner'
import {
  createDepartmentDesignationValidator,
  updateDepartmentDesignationValidator,
  updateDepartmentDesignationPatchValidator,
} from '#validators/department_designation_validator'

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

test.group('Department & designation validation', () => {
  test('create accepts valid payload', async ({ assert }) => {
    const error = await validationError(createDepartmentDesignationValidator, {
      department: 'Engineering',
      designation: 'Senior Developer',
      status: 'active',
      actions: 'create',
    })
    assert.isNull(error)
  })

  test('create rejects missing required field', async ({ assert }) => {
    const error = await validationError(createDepartmentDesignationValidator, {
      department: 'Engineering',
    })
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'required'))
  })

  test('PATCH accepts a single valid field', async ({ assert }) => {
    const error = await validationError(updateDepartmentDesignationPatchValidator, {
      status: 'inactive',
    })
    assert.isNull(error)
  })

  test('PUT rejects invalid data type', async ({ assert }) => {
    const error = await validationError(updateDepartmentDesignationValidator, {
      department: 123,
      designation: 'Senior Developer',
      status: 'active',
    })
    assert.isNotNull(error)
    assert.isTrue(hasRule(error, 'string'))
  })
})

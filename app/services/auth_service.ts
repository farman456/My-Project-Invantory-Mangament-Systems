import User from '#models/user'
import { registerValidatorInterface } from '#validators/auth_validator'

export const registerUser = async (payload: registerValidatorInterface) => {
  return await User.create({
    name: payload.name,
    email: payload.email,
    password: payload.password,
    roleId: payload.role_id,
    status: 'active',
  })
}

export const loginUser = async (email: string, password: string) => {
  const user = await User.verifyCredentials(email, password)
  const token = await User.accessTokens.create(user, ['*'])
  return { token, user }
}

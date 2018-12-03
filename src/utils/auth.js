import { User } from '../types/user/user.model'
import cuid from 'cuid'

export const newApiKey = () => {
  return cuid()
}

export const authenticate = async req => {
  const apiKey = req.headers.authorization

  if (!apiKey) {
    return
  }

  const user = await User.findOne({ apiKey })
    .select('-password')
    .lean()
    .exec()

  return user
}

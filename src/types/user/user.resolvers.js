import { User } from './user.model'
import { AuthenticationError } from 'apollo-server'
import { newApiKey } from '../../utils/auth'

const me = (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError()
  }
  return ctx.user
}

const updateMe = (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError()
  }

  return User.findByIdAndUpdate(ctx.user._id, args.input, { new: true })
    .select('-password')
    .lean()
    .exec()
}

const signup = (_, args) => {
  return User.create({ ...args.input, apiKey: newApiKey() })
}

export default {
  Query: {
    me
  },
  Mutation: {
    updateMe,
    signup
  }
}

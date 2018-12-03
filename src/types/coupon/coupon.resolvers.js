import { Coupon } from './coupon.model'
import { AuthenticationError } from 'apollo-server'
import { roles } from '../../utils/auth'

const coupon = (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError()
  }
  return Coupon.findById(args.id)
    .lean()
    .exec()
}

const newCoupon = (_, args, ctx) => {
  if (!ctx.user || ctx.user.role !== roles.admin) {
    throw new AuthenticationError()
  }

  return Coupon.create({ ...args.input, createdBy: ctx.user._id })
}

const coupons = (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError()
  }

  return Coupon.find({})
    .lean()
    .exec()
}

const updateCoupon = (_, args, ctx) => {
  if (!ctx.user || ctx.user.role !== roles.admin) {
    throw new AuthenticationError()
  }

  const update = args.input
  return Coupon.findByIdAndUpdate(args.id, update, { new: true })
    .lean()
    .exec()
}

const removeCoupon = (_, args, ctx) => {
  if (!ctx.user || ctx.user.role !== roles.admin) {
    throw new AuthenticationError()
  }

  return Coupon.findByIdAndRemove(args.id)
    .lean()
    .exec()
}

export default {
  Query: {
    coupons,
    coupon
  },
  Mutation: {
    newCoupon,
    updateCoupon,
    removeCoupon
  }
}

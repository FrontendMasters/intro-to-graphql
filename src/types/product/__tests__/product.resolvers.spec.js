import resolvers from '../product.resolvers'
import mongoose from 'mongoose'
import { AuthenticationError } from 'apollo-server'
import { Product } from '../product.model'
import { User } from '../../user/user.model'

describe('Resolvers', () => {
  describe('lesson-3:', () => {
    test('product gets one by id in args', async () => {
      const user = mongoose.Types.ObjectId()
      const product = await Product.create({
        name: 'Ultra-rig',
        price: 6000,
        type: 'GAMING_PC',
        liquidCooled: true,
        createdBy: user
      })

      const result = await resolvers.Query.product(
        null,
        { id: product._id },
        { user: {} }
      )

      expect(`${result._id}`).toBe(`${product._id}`)
    })

    test('products gets all products', async () => {
      const user = mongoose.Types.ObjectId()

      const products = await Product.create([
        {
          name: 'Ultra-rig',
          price: 6000,
          type: 'GAMING_PC',
          liquidCooled: true,
          createdBy: user
        },
        {
          name: 'Beach Bum max',
          price: 569,
          type: 'BIKE',
          bikeType: 'BEACH',
          createdBy: user
        }
      ])

      const result = await resolvers.Query.products(null, {}, { user: {} })

      expect(result).toHaveLength(2)
      products.forEach(p => {
        const match = result.find(r => `${r._id}` === `${p._id}`)
        expect(match).toBeTruthy()
      })
    })

    test('newProduct creates a new product from args', async () => {
      const args = {
        input: {
          name: 'Monster v5 bike',
          price: 450,
          bikeType: 'KIDS',
          type: 'BIKE'
        }
      }

      const result = await resolvers.Mutation.newProduct(null, args, {
        user: { role: 'admin', _id: mongoose.Types.ObjectId() }
      })

      Object.keys(args.input).forEach(field => {
        expect(result[field]).toBe(args.input[field])
      })
    })

    test('updateProduct updates existing product from args', async () => {
      const product = await Product.create({
        name: 'Monster v5 bike',
        price: 450,
        bikeType: 'KIDS',
        type: 'BIKE',
        createdBy: mongoose.Types.ObjectId()
      })

      const args = {
        id: product._id,
        input: {
          price: 300
        }
      }

      const result = await resolvers.Mutation.updateProduct(null, args, {
        user: { role: 'admin' }
      })

      expect(`${result._id}`).toBe(`${product._id}`)
      expect(result.price).toBe(300)
    })

    test('removeProduct removes existing product from args', async () => {
      const product = await Product.create({
        name: 'Monster v5 bike',
        price: 450,
        bikeType: 'KIDS',
        type: 'BIKE',
        createdBy: mongoose.Types.ObjectId()
      })

      const args = {
        id: product._id
      }

      const result = await resolvers.Mutation.removeProduct(null, args, {
        user: { role: 'admin' }
      })

      expect(`${result._id}`).toBe(`${product._id}`)
    })

    test('product created by gets resolves', async () => {
      const user = await User.create({
        email: 'yo@yo.com',
        password: 'asdfsd',
        apiKey: '834slsdkfjf'
      })

      const result = await resolvers.Product.createdBy({ createdBy: user._id })
      expect(`${user._id}`).toBe(`${result._id}`)
    })
  })
  describe('lesson-4:', () => {
    test('resolves product interface', () => {
      const resolver = resolvers.Product.__resolveType
      expect(resolver({ type: 'BIKE' })).toBe('Bike')
      expect(resolver({ type: 'GAMING_PC' })).toBe('GamingPc')
      expect(resolver({ type: 'DRONE' })).toBe('Drone')
      expect(resolver({ type: 'nope' })).toBe(undefined)
    })
  })
  describe('lesson-5:', () => {
    test('product requires auth', async () => {
      expect(() =>
        resolvers.Query.product(null, { id: mongoose.Types.ObjectId() }, {})
      ).toThrow(AuthenticationError)
    })
    test('products requires auth', () => {
      expect(() => resolvers.Query.products(null, {}, {})).toThrow(
        AuthenticationError
      )
    })
    test('newProduct requires auth and admin', () => {
      expect(() =>
        resolvers.Mutation.newProduct(
          null,
          {
            input: {
              name: 'Monster v5 bike',
              price: 450,
              bikeType: 'KIDS',
              type: 'BIKE',
              createdBy: mongoose.Types.ObjectId()
            }
          },
          {}
        )
      ).toThrow(AuthenticationError)
      expect(() =>
        resolvers.Mutation.newProduct(
          null,
          {
            input: {
              name: 'Monster v6 bike',
              price: 450,
              bikeType: 'KIDS',
              type: 'BIKE',
              createdBy: mongoose.Types.ObjectId()
            }
          },
          { user: { roles: 'member' } }
        )
      ).toThrow(AuthenticationError)
    })

    test('newProduct uses auth user for createdBy', async done => {
      const userId = mongoose.Types.ObjectId()
      const result = await resolvers.Mutation.newProduct(
        null,
        {
          input: {
            name: 'Monster v5 bike',
            price: 450,
            bikeType: 'KIDS',
            type: 'BIKE'
          }
        },
        { user: { _id: userId, role: 'admin' } }
      )

      expect(`${result.createdBy}`).toBe(`${userId}`)
      done()
    })

    test('updateProduct requires auth and admin', () => {
      expect(() =>
        resolvers.Mutation.updateProduct(
          null,
          { id: mongoose.Types.ObjectId(), input: { name: 'new name' } },
          {}
        )
      ).toThrow(AuthenticationError)
      expect(() =>
        resolvers.Mutation.updateProduct(
          null,
          { id: mongoose.Types.ObjectId(), input: { name: 'new name' } },
          { user: { role: 'member' } }
        )
      ).toThrow(AuthenticationError)
    })

    test('removeProduct requires auth and admin', () => {
      expect(() =>
        resolvers.Mutation.removeProduct(
          null,
          { id: mongoose.Types.ObjectId() },
          {}
        )
      ).toThrow(AuthenticationError)
      expect(() =>
        resolvers.Mutation.removeProduct(
          null,
          { id: mongoose.Types.ObjectId() },
          { user: { role: 'member' } }
        )
      ).toThrow(AuthenticationError)
    })
  })
})

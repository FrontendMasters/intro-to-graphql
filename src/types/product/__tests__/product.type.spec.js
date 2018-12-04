import { buildSchema } from 'graphql'
import { schemaToTemplateContext } from 'graphql-codegen-core'
import { loadTypeSchema } from '../../../utils/schema'
import { mockServer } from 'graphql-tools'

describe('Product schema', () => {
  let schema, typeDefs
  beforeAll(async () => {
    const root = `
      schema {
        query: Query
        mutation: Mutation
      }

    `
    const typeSchemas = await Promise.all(
      ['product', 'user', 'coupon'].map(loadTypeSchema)
    )
    typeDefs = root + typeSchemas.join(' ')
    schema = schemaToTemplateContext(buildSchema(typeDefs))
  })
  describe('lesson-2:', () => {
    test('Product has base fields', () => {
      let type = schema.types.find(t => {
        return t.name === 'Product'
      })

      if (!type && process.env.GQL_LESSON !== 'lesson-2') {
        type = schema.interfaces.find(t => {
          return t.name === 'Product'
        })
      }

      expect(type).toBeTruthy()

      const baseFields = {
        name: 'String!',
        price: 'Float!',
        image: 'String!',
        type: 'ProductType!',
        createdBy: 'User!',
        description: 'String',
        liquidCooled: 'Boolean',
        range: 'String',
        bikeType: 'BikeType'
      }

      type.fields.forEach(field => {
        const type = baseFields[field.name]
        expect(field.raw).toBe(type)
      })
    })
    test('NewProductInput has correct fields', () => {
      const input = schema.inputTypes.find(i => i.name === 'NewProductInput')

      expect(input).toBeTruthy()

      const fields = {
        name: 'String!',
        price: 'Float!',
        image: 'String!',
        type: 'ProductType!',
        description: 'String',
        liquidCooled: 'Boolean',
        bikeType: 'BikeType',
        range: 'String'
      }
      input.fields.forEach(field => {
        const type = fields[field.name]
        expect(field.raw).toBe(type)
      })
    })

    test('UpdateProductInput has correct fields', () => {
      const input = schema.inputTypes.find(i => i.name === 'UpdateProductInput')

      expect(input).toBeTruthy()

      const fields = {
        name: 'String',
        price: 'String',
        image: 'String',
        description: 'String',
        liquidCooled: 'Boolean',
        bikeType: 'BikeType',
        range: 'String'
      }

      input.fields.forEach(field => {
        const type = fields[field.name]
        expect(field.raw).toBe(type)
      })
    })
    it('product query', async () => {
      const server = mockServer(typeDefs)
      const query = `
        {
          product(id: "384hsd") {
            name
            price
            image
            type
            ... on Drone {
              range
            }
            ... on GamingPc {
              liquidCooled
            }
            ... on Bike {
              bikeType
            }
          }
        }
      `

      await expect(server.query(query)).resolves.toBeTruthy()
    })

    it('products query', async () => {
      const server = mockServer(typeDefs)
      const query = `
        {
          products {
            name
            price
            image
            type
            ... on Drone {
              range
            }
            ... on GamingPc {
              liquidCooled
            }
            ... on Bike {
              bikeType
            }
          }
        }
      `
      await expect(server.query(query)).resolves.toBeTruthy()
    })
  })
  describe('lesson-4:', () => {
    test('product must be an interface', () => {
      const product = schema.interfaces.find(t => {
        return t.name === 'Product'
      })

      expect(product).toBeTruthy()
    })

    test('GamingPc type imeplements Product', () => {
      const type = schema.types.find(t => t.name === 'GamingPc')
      expect(type).toBeTruthy()

      expect(type.hasInterfaces).toBe(true)
      expect(type.interfaces).toHaveLength(1)
      expect(type.interfaces[0]).toBe('Product')

      const field = type.fields.find(f => f.name === 'liquidCooled')

      expect(field).toBeTruthy()
      expect(field.raw).toBe('Boolean!')
    })

    test('Bike type imeplements Product', () => {
      const type = schema.types.find(t => t.name === 'Bike')
      expect(type).toBeTruthy()

      expect(type.hasInterfaces).toBe(true)
      expect(type.interfaces).toHaveLength(1)
      expect(type.interfaces[0]).toBe('Product')

      const field = type.fields.find(f => f.name === 'bikeType')

      expect(field).toBeTruthy()
      expect(field.raw).toBe('BikeType!')
    })

    test('Drone type imeplements Product', () => {
      const type = schema.types.find(t => t.name === 'Drone')
      expect(type).toBeTruthy()

      expect(type.hasInterfaces).toBe(true)
      expect(type.interfaces).toHaveLength(1)
      expect(type.interfaces[0]).toBe('Product')

      const field = type.fields.find(f => f.name === 'range')

      expect(field).toBeTruthy()
      expect(field.raw).toBe('String!')
    })
  })
})

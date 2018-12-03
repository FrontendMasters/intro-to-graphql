import fs from 'fs'
import path from 'path'
import { buildSchema } from 'graphql'
import { schemaToTemplateContext } from 'graphql-codegen-core'

describe('GraphQL Schema', () => {
  let schema
  beforeAll(() => {
    schema = schemaToTemplateContext(
      buildSchema(
        fs.readFileSync(path.join(__dirname, '../schema.gql')).toString()
      )
    )
  })

  describe('Product', () => {
    test('must be an interface', () => {
      const product = schema.interfaces.find(t => {
        return t.name === 'Product'
      })

      expect(product).toBeTruthy()
    })
    test('has base fields', () => {
      const { fields } = schema.interfaces.find(t => {
        return t.name === 'Product'
      })

      const baseFields = {
        name: 'String!',
        price: 'Float!',
        image: 'String!',
        type: 'ProductType!',
        createdBy: 'User!',
        description: 'String'
      }

      fields.forEach(field => {
        const type = baseFields[field.name]
        expect(field.raw).toBe(type)
      })
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
  })

  describe('Query', () => {
    test('products query should have the correct type', () => {
      const { fields } = schema.types.find(t => t.name === 'Query')
      const products = fields.find(f => f.name === 'products')

      expect(products).toBeTruthy()
      expect(products.raw).toBe('[Product]!')
    })

    test('product query should have correct type and args', () => {
      const { fields } = schema.types.find(t => t.name === 'Query')
      const product = fields.find(f => f.name === 'product')

      expect(product).toBeTruthy()
      expect(product.arguments).toHaveLength(1)
      expect(product.arguments[0].name).toBe('id')
      expect(product.arguments[0].raw).toBe('ID!')
      expect(product.raw).toBe('Product!')
    })
  })
})

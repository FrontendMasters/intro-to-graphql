import { Product } from '../product.model'
import mongoose from 'mongoose'
import validator from 'validator'
import { isFunction } from 'lodash'

describe('Product model', () => {
  describe('schema', () => {
    test('name', () => {
      const name = Product.schema.obj.name
      expect(name).toEqual({
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
      })
    })

    test('price', () => {
      const price = Product.schema.obj.price
      expect(price).toEqual({
        type: Number,
        required: true
      })
    })

    test('image', () => {
      const image = Product.schema.obj.image
      expect(validator.isURL(image.default)).toBeTruthy()

      expect(image.type).toBe(String)
      expect(image.required).toBe(true)
      expect(Array.isArray(image.validate)).toBeTruthy()
      expect(image.validate[1]).toBe('Not a valid image url')
    })

    test('type', () => {
      const type = Product.schema.obj.type
      expect(type).toEqual({
        type: String,
        required: true,
        enum: ['GAMING_PC', 'BIKE', 'DRONE']
      })
    })

    test('description', () => {
      const description = Product.schema.obj.description
      expect(description).toBe(String)
    })

    test('liquidCooled', () => {
      const liquidCooled = Product.schema.obj.liquidCooled
      expect(liquidCooled.type).toBe(Boolean)
      expect(isFunction(liquidCooled.required)).toBeTruthy()

      const o = {
        type: 'GAMING_PC'
      }

      expect(liquidCooled.required.call(o)).toBe(true)
      o.type = 'BIKE'

      expect(liquidCooled.required.call(o)).toBe(false)
    })

    test('bikeType', () => {
      const bikeType = Product.schema.obj.bikeType
      expect(bikeType.type).toBe(String)
      expect(bikeType.enum).toEqual(['KIDS', 'MOUNTAIN', 'ELECTRIC', 'BEACH'])
      expect(isFunction(bikeType.required)).toBeTruthy()

      const o = {
        type: 'BIKE'
      }

      expect(bikeType.required.call(o)).toBe(true)
      o.type = 'DRONE'

      expect(bikeType.required.call(o)).toBe(false)
    })

    test('range', () => {
      const range = Product.schema.obj.range
      expect(range.type).toBe(String)
      expect(isFunction(range.required)).toBeTruthy()

      const o = {
        type: 'DRONE'
      }

      expect(range.required.call(o)).toBe(true)
      o.type = 'GAMING_PC'

      expect(range.required.call(o)).toBe(false)
    })

    test('createdBy', () => {
      const createdBy = Product.schema.obj.createdBy
      expect(createdBy).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'user'
      })
    })
  })
})

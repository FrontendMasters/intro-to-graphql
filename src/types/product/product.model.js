import mongoose from 'mongoose'
import validator from 'validator'

export const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true,
      default: 'https://via.placeholder.com/150',
      validate: [v => validator.isURL(v), 'Not a valid image url']
    },
    type: {
      type: String,
      required: true,
      enum: ['GAMING_PC', 'BIKE', 'DRONE']
    },
    description: String,
    liquidCooled: {
      type: Boolean,
      required() {
        return this.type === 'GAMING_PC'
      }
    },
    bikeType: {
      type: String,
      enum: ['KIDS', 'MOUNTAIN', 'ELECTRIC', 'BEACH'],
      required() {
        return this.type === 'BIKE'
      }
    },
    range: {
      type: String,
      required() {
        return this.type === 'DRONE'
      }
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'user'
    }
  },
  { timestamps: true }
)

export const Product = mongoose.model('product', productSchema)

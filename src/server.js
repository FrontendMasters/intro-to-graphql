import { ApolloServer } from 'apollo-server'
import { loadTypeSchema } from './utils/schema'
import { merge } from 'lodash'
import config from './config'
import { connect } from './db'
import product from './types/product/product.resolvers'
import coupon from './types/coupon/coupon.resolvers'
import user from './types/user/user.resolvers'

const types = ['product', 'coupon', 'user']

export const start = async () => {
  const rootSchema = `
    type Cat {
      species: String!
      fluffy: Boolean!
      nice: Boolean!
      age: Int!
    }

    type Query {
      cat: Cat
      cats: [Cat]!
    }

    schema {
      query: Query
    }
  `
  const schemaTypes = await Promise.all(types.map(loadTypeSchema))
  const catResolver = {
    Query: {
      cat() {
        return { species: 'mainecoon', fluffy: true, nice: true, age: 1 }
      },
      cats() {
        return [
          { species: 'mainecoon', fluffy: true, nice: true, age: 1 },
          { species: 'grey', fluffy: false, nice: false, age: 3 }
        ]
      }
    }
  }
  const server = new ApolloServer({
    typeDefs: [rootSchema],
    resolvers: catResolver,
    context({ req }) {
      // use the authenticate function from utils to auth req, its Async!
      return { user: null }
    }
  })

  await connect(config.dbUrl)
  const { url } = await server.listen({ port: config.port })

  console.log(`GQL server ready at ${url}`)
}

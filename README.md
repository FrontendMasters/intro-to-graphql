# Intro to GraphQL
> Scott Moss & Frontend Masters

## Resources
* [Slides](https://slides.com/scotups/intro-to-graphql)
* [Nodejs](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com/)
* [Apollo](https://www.apollographql.com/docs/apollo-server/)
* [GraphQL](https://graphql.org/)

## Course
This course has two parts, slides and excercises. The slides describe the excerices in detail. Each excercise has a starting branch and solution branch. Example `lesson-1` and `lesson-1-solution`.
## Excercises
### Hello world GraphQL server with Apollo Server
* branch - `lesson-1`

In this lesson you'll be creating a simple GraphQL server using Apollo Server. 
- [ ] install dependencies with yarn (prefered for version locking) or npm
- [ ] create a schema with at least one Type
- [ ] create a query from that Type
- [ ] create a mutation for that Type
- [ ] create mock resolvers for query and mutation
- [ ] start the server
- [ ] using GraphQL playground, perform query and mutation

### Creating Schema with SDL
* branch - `lesson-2`
* test command - `yarn test-schema` or `npm run test-schema`

This exercise will have you creating a GraphQL Schema based on the the mongoose models already created
- [ ] create Type for product
- [ ] create inputs for product
- [ ] create queries for product
- [ ] create mutations for product
- [ ] ensure all tests pass by running test command

### Resolving Queries and Mutations
* branch - `lesson-3`
* test command - `yarn test-resolvers` or `npm run test-resolvers`

In this exercise, you'll be creating resolvers for the Queries and Mutations on the product type. You'll be using Mongoose models to perform CRUD in your resolvers.

- [ ] create resolvers for product queries
- [ ] create resolvers for product mutations
- [ ] create resolvers for prouduct createdBy field
- [ ] ensure all tests pass by running test command

### Interfaces and Unions
* branch - `lesson-4`
* test command - `yarn test-interfaces` or `npm run test-interfaces`

Now that you know about schemas and resolvers, we need to make some changes. Our product model in mongoose is split between 3 different product types. We need to make the product type an interface and then create types for each possible type in our mongoose model. Don't forget to create  resolver to resolve the type.

- [ ] change product type to an interface
- [ ] create Bike type that implements product
- [ ] create GamingPc type that implements product
- [ ] create Drone type that implements product
- [ ] create resolver for product interface that resolves the type
- [ ] ensure all tests pass by running test command

### Authentication
* branch - `lesson-5`
* test command - `yarn test-auth` or `npm run test-auth`

There are many many ways to authenticate with GraphQL. Our API is a public API, so we'll use API keys. Some queries need authentication, and some queries also need the correct role. Authenticate the request and update the product resolvers!

- [ ] authenticate the request and add use to context
- [ ] block all product queries and mutations if no user
- [ ] block all product mutations if not an admin role
- [ ] ensure all tests pass by running test command

### Testing
The other types don't have any test, go ahead and write some!

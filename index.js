require('isomorphic-fetch')
const { introspectSchema, makeRemoteExecutableSchema } = require('graphql-tools')
const { HttpLink } = require('apollo-link-http')
const { GraphQLServer } = require('graphql-yoga')

async function createStitchedServer () {
  const link = = new HttpLink({
    uri: 'http://localhost:3000/graphql'
  })

  const schema = makeRemoteExecutableSchema({
    schema: await introspectSchema(link),
    link
  })

  const server = new GraphQLServer({
    schema
  })

  const httpServer = server.createHttpServer({
    playground: '/graphql',
    endpoint: '/graphql',
    subscriptions: '/graphql',
    debug: true
  })
  return httpServer
}

function createOriginEndpoint() {
  const typeDefs = `
    type Query {
      info: String
      hello(name: String): String
      fire: Boolean
    }
  `

  const resolvers = {
    Query: {
      info (_) {
        return 'Just a simple API'
      },
      hello (_, { name }) {
        return new Promise((accept, reject) => {
          if (!!name) {
            accept(`Hello ${name}!`)
          }
          reject("Sorry sir but what should I call you?")
        })
      },
      fire (_) {
        throw Error('This error is intentionally thrown!')
      }
    }
  }

  const server = new GraphQLServer({ typeDefs, resolvers })
  const httpServer = server.createHttpServer({
    playground: '/graphql',
    endpoint: '/graphql',
    subscriptions: '/graphql',
    debug: true
  })
  return httpServer
}

(async function () {
  const originServer = createOriginEndpoint()
  originServer.listen(3000, () => {
    console.log(`Origin server started at :3000`)
  })
  const stitchedServer = await createStitchedServer()
  stitchedServer.listen(3001, () => {
    console.log(`Stitched server started at :3001`)
  })
})()

import { ApolloServer, AuthenticationError } from 'apollo-server'
import typeDefs from './schema'
import resolvers from './resolvers'
import { usersLoggedIn } from './firebase'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || ''

    console.log('usersLoggedIn', usersLoggedIn)

    if (token) {
      if (token in usersLoggedIn) {
        return { currentUser: usersLoggedIn[token], isAuthenticated: true }
      } else {
        throw new AuthenticationError('Incorrect token')
      }
    } else {
      return { isAuthenticated: false }
    }
  }
 })

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})

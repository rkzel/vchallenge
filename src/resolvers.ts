import { IResolvers } from 'graphql-tools'
import { AuthenticationError } from 'apollo-server'
import {
  getRecord,
  getRecords,
  removeRecord,
  saveRecord,
  generateAccessToken,
  deleteAccessToken,
} from './firebase'

const resolvers: IResolvers = {
  Query: {
    vegs: (_, __, context) => {
      if (context.isAuthenticated) return getRecords('vegs')
      throw new AuthenticationError('Incorrect token')
    },
    fruits: (_, __, context) => {
      if (context.isAuthenticated) return getRecords('fruits')
      throw new AuthenticationError('Incorrect token')
    },
    veg: (_, args, context) => {
      if (context.isAuthenticated) return getRecord('vegs', args.id)
      throw new AuthenticationError('Incorrect token')
    },
    fruit: (_, args, context) => {
      if (context.isAuthenticated) return getRecord('fruits', args.id)
      throw new AuthenticationError('Incorrect token')
    }
  },

  Mutation: {
    addFruit: (_, record) => {
      return {
        code: 200,
        success: true,
        message: 'Fruit saved correctly',
        fruit: saveRecord('fruits', record)
      }
    },
    addVeg: (_, record) => {
      return {
        code: 200,
        success: true,
        message: 'Veg saved correctly',
        veg: saveRecord('vegs', record)
      }
    },

    updateFruit: (_, record, context) => {
      if (context.currentUser.role === 'admin' || context.currentUser.role === 'owocnik') {
        return {
          code: 200,
          success: true,
          message: 'Fruit saved correctly',
          fruit: saveRecord('fruits', record)
        }
      } else {
        return {
          code: 403,
          success: false,
          message: 'Insufficient clearance',
          fruit: null,
        }
      }
    },

    updateVeg: (_, record, context) => {
      if (context.currentUser.role === 'admin' || context.currentUser.role === 'warzywnik') {
        return {
          code: 200,
          success: true,
          message: 'Veg saved correctly',
          veg: saveRecord('vegs', record)
        }
      } else {
        return {
          code: 403,
          success: false,
          message: 'Insufficient clearance',
          veg: null,
        }
      }
    },

    removeFruit: (_, { id }, context) => {
      if (context.currentUser.role === 'admin' || context.currentUser.role === 'owocnik') {
        removeRecord('fruits', id)
        return {
          code: 200,
          success: true,
          message: 'Fruit saved correctly',
        }
      } else {
        return {
          code: 403,
          success: false,
          message: 'Insufficient clearance',
        }
      }
    },

    removeVeg: (_, { id }, context) => {
      if (context.currentUser.role === 'admin' || context.currentUser.role === 'warzywnik') {
        removeRecord('vegs', id)
        return {
          code: 200,
          success: true,
          message: 'Veg removed correctly',
        }
      } else {
        return {
          code: 403,
          success: false,
          message: 'Insufficient clearance',
        }
      }
    },

    login: async (_, { username, password }) => {
      const userAccount = await generateAccessToken(username, password)
      if (userAccount.token) {
        return {
          code: 200,
          success: true,
          message: 'Welcome',
          token: userAccount.token,
        }
      } else {
        return {
          code: 403,
          success: false,
          message: 'Incorrect username or password',
          token: null,
        }
      }
    },

    logout: (_, { token }) => {
      deleteAccessToken(token)
      return {
        code: 200,
        success: true,
        message: 'Bye',
      }
    },
  }
}

export default resolvers

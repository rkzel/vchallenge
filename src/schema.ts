import { gql } from 'apollo-server'

const typeDefs = gql`
  type Query {
    fruits: [Fruit]!
    fruit(id: ID!): Fruit
    vegs: [Veg]
    veg(id: ID!): Veg
  }

  type Fruit {
    id: ID!
    name: String!
    color: String
  }

  type Veg {
    id: ID!
    name: String!
    color: String
  }

  type Mutation {
    addFruit(color: String!, name: String!): FruitUpdateRes!
    addVeg(color: String!, name: String!): VegUpdateRes!
    updateFruit(id: ID!, color: String!, name: String!): FruitUpdateRes!
    updateVeg(id: ID!, color: String!, name: String!): VegUpdateRes!
    removeFruit(id: ID!): RecordRemoveRes!
    removeVeg(id: ID!): RecordRemoveRes!
    login(username: String!, password: String!): LoginRes
    logout(token: String!): LogoutRes
  }

  type FruitUpdateRes {
    code: String!
    success: Boolean!
    message: String
    fruit: Fruit
  }

  type VegUpdateRes {
    code: String!
    success: Boolean!
    message: String
    veg: Veg
  }

  type RecordRemoveRes {
    code: String!
    success: Boolean!
    message: String!
  }

  type LoginRes {
    code: String!
    success: Boolean!
    message: String!
    token: String
  }
  type LogoutRes {
    code: String!
    success: Boolean!
    message: String!
  }
`

export default typeDefs


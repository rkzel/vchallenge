import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import { sha224 } from 'js-sha256'

var firebaseConfig = {
  apiKey: "AIzaSyBAliVHy1rec2Y5gvOM8rF4oW2yDa-I2HA",
  authDomain: "veewme-57308.firebaseapp.com",
  databaseURL: "https://veewme-57308.firebaseio.com",
  projectId: "veewme-57308",
  storageBucket: "veewme-57308.appspot.com",
  messagingSenderId: "139160899387",
  appId: "1:139160899387:web:a730f7e5c90aec6cb2b11e"
}

type Record = {
  id: string,
  name: string,
  color: string,
}
type Records = Array<Record>

type AccountRecord = {
  username: string,
  role: string,
  token: string,
}

type UsersLoggedIn = {
  [key:string]: string,
}

const usersLoggedIn:UsersLoggedIn = {}

const saveRecord = async (collection:string, record:Record):Promise<Record> => {
  let id = record.id

  if (!record.id) {
    await db.collection(collection)
    .add(record)
    .then(docRef => {
      id = docRef.id
    })
    .catch(error => console.error('Error creating record', record, error))
  } else {
    await db.collection(collection).doc(record.id).set(record, { merge: true })
    .catch(error => console.error('Error saving record', record, error))
  }

  return getRecord(collection, id)
}

const removeRecord = async (collection:string, id:string) => {
  let success = false

  await db.collection(collection)
  .doc(id)
  .delete()
  .then(function() {
    success = true
  }).catch(function(error) {
    console.error("Error removing document: ", error);
  })

  return success
}

const getRecords = async (collection:string):Promise<Records> => {
  const records:Records = []

  await db.collection(collection)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      records.push({ name: doc.data().name, color: doc.data().color, id: doc.id })
    })
  })
  .catch(function(error) {
    console.log("Error getting documents: ", error)
  })

  return records
}

const getRecord = async (collection:string, id:string):Promise<Record> => {
  let record:Record = {id: '', color: '', name: ''}

  await db.collection(collection)
  .doc(id)
  .get()
  .then(doc => {
    if (doc.exists){
      const data = doc.data()
      if (data)
        record = { name: data.name, color: data.color, id: doc.id }
    }}).catch(function(error) {
      console.log("Error getting document:", error)
    })

  return record
}

const generateAccessToken = async (username:string, password:string):Promise<AccountRecord> => {
  let userAccount:AccountRecord = {username: '', role: '', token: ''}

  await db.collection('user')
    .where('username', "==", username)
    .get()
    .then(users => {
      if (users.empty) return
      if (users.size !== 1) return

      users.forEach(user => {
        if (user.data().password === sha224(password)) {
          userAccount.username = username
          userAccount.role = user.data().role
          userAccount.token = '_' + Math.random().toString(36).substr(2)

          // "session handling"
          usersLoggedIn[userAccount.token] = user.data().role
        } else {
          console.log('incorrect pass', user.data().password, password);
        }
      })
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    })

  return userAccount
}

const deleteAccessToken = async (token:string) => {
  delete(usersLoggedIn[token])
}

const app = firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

export { app, db, usersLoggedIn, getRecord, getRecords, saveRecord, removeRecord, generateAccessToken, deleteAccessToken }

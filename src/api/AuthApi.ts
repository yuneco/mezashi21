import firebase from './firebase'

/**
 * Get current user.
 * If login process is in progress, this api wait until it is done.
 */
const getUser = async () => {
  return new Promise<firebase.User | null>(resolve => {
    const observer = firebase.auth().onAuthStateChanged(async user => {
      // console.log('onAuthStateChanged', user)
      observer()
      resolve(user)
    })
  })
}

/**
 * Login anonimouse if the user not logged in.
 * If user already logged in (includes logged in other method like Google login), this api just return current credential.
 */
const loginAnonimouse = async () => {
  const crUser = await getUser()
  if (crUser) {
    return crUser
  }
  const anonCredential = await firebase.auth().signInAnonymously()
  return anonCredential.user
}

export default {
  loginAnonimouse,
  getUser,
  get uid() {
    const user = firebase.auth().currentUser
    return user ? user.uid : null
  }
}

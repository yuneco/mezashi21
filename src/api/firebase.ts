import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/analytics'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBVhi0awLLFNFwunCxbFbtlri7uypWzJrs',
  authDomain: 'nekomzs21.firebaseapp.com',
  projectId: 'nekomzs21',
  storageBucket: 'nekomzs21.appspot.com',
  messagingSenderId: '11908415431',
  appId: '1:11908415431:web:686945cc8c8dbcb00623e2',
  measurementId: 'G-XSEEDBTVTX'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

export default firebase

import firebase from 'firebase/app';
import 'firebase/auth';
const firebaseConfig = {
    apiKey: "AIzaSyATneRVw72Z7olmqI0LnuWzmPHJyOKA3hU",
    authDomain: "cab-booking-b1fbc.firebaseapp.com",
    projectId: "cab-booking-b1fbc",
    storageBucket: "cab-booking-b1fbc.appspot.com",
    messagingSenderId: "295944393063",
    appId: "1:295944393063:web:48ff5ed76142f08b565fc2"
};

firebase.initializeApp(firebaseConfig);
export default firebase;
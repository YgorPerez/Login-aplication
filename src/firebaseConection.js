import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

let firebaseConfig = {
	apiKey: "AIzaSyCiVERniQdE5X0f123gmHxYLM3avAjN4f0",
	authDomain: "udemy-6eec1.firebaseapp.com",
	projectId: "udemy-6eec1",
	storageBucket: "udemy-6eec1.appspot.com",
	messagingSenderId: "70716853079",
	appId: "1:70716853079:web:3bcda2598e7238b83acc12",
	measurementId: "G-MGHHRJEKGG",
};
// Initialize Firebase

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

export default firebase;

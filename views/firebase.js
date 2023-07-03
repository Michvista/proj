const { initializeApp } = require("firebase/app");
const { getAuth, GoogleAuthProvider } = require("firebase/auth");

const firebaseConfig = {
apiKey: "AIzaSyDvfUwbchAE6Nsg2UvYeRo6aGIJG0SKvKo",
authDomain: "project-bc1d8.firebaseapp.com",
projectId: "project-bc1d8",
storageBucket: "project-bc1d8.appspot.com",
messagingSenderId: "886987436760",
appId: "1:886987436760:web:b6434bb7ce675a43599dad",
measurementId: "G-V5DR0EFY60"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

module.exports = {
    app,
    auth,
    provider
}
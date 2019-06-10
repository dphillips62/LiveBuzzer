//const firebase = require("firebase");
// Required for side-effects
//require("firebase/firestore");
// Your web app's Firebase configuration
firebase.initializeApp({
  apiKey: "AIzaSyBclGO06U5GKNNkqCOkHGQdIWOwQh3DlX4",
  authDomain: "webbuzzer-41885.firebaseapp.com",
  databaseURL: "https://webbuzzer-41885.firebaseio.com",
  projectId: "webbuzzer-41885",
  storageBucket: "webbuzzer-41885.appspot.com",
  messagingSenderId: "16932920777",
  appId: "1:16932920777:web:95f104066d7e01c7"
});
// Initialize Firebase
//var app = firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
//const db = firebase.firestore()

function joinRoom() {
  var roomCode = document.getElementById('joinRoom').value;
  if (roomCode != "") {
    var docRef = db.collection('webBuzzer').doc(roomCode)
    docRef.get().then(function(doc) {
      if (doc.exists) {
          console.log("Document data:", doc.data());
          data = doc.data()
          //firebase.database().ref('webBuzzer/' + roomCode).once('value', function(data) {
          if (data.name) {
            window.open('room.html?id=' + roomCode, '_self')
          } else {
            alert('The room code you entered isn\'t valid.')
          }
      } else {
        alert('A 5 digit room code is required.')
      }
    }).catch(function(error) {
    console.log("Error getting document:", error);
  });
 } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}
 


function createRoom() {

  var roomName = document.getElementById('createRoom').value
  if (roomName != "") {
    var roomCode = '12345'//generate5digitCode()
    db.collection('webBuzzer').doc(roomCode).set({
        'name': roomName,
        people: { },
        mostRecentBuzz:0
      })
      .then(function() {

       window.open('manage.html?id=' + roomCode, '_self');
      })
      .catch(function(error){
        alert('An error occured. Try again later.');
      });
    }else {
      alert('A valid room name is required.')
    }
}

function generate5digitCode() {
  var roomCode = ""
  while (roomCode.length != 5) {
    roomCode = "" + Math.floor(Math.random()*100000)
  }
  return roomCode;
}

function testing(){
  var cityRef = db.collection('webBuzzer').doc('12345');
  var x = "55555";
  var y = "Luke";
  var updateObj = {
    people: {}
  };
  updateObj.people[x] = y;
  var setWithMerge = cityRef.set(updateObj, { merge: true });

/*
  db.collection('webBuzzer').doc("12345").set({
    'name': 'Hello',
    people: { 23455: "Pizza", 56554: "Blue", 88776: "recess" },
    mostRecentBuzz:0
  })
  .then(function() {

  // window.open('manage.html?id=' + roomCode, '_self');
  })
  .catch(function(error){
    alert('An error occured. Try again later.');
  });
  */
}
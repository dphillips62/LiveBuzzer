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

var db = firebase.firestore();
var data;
var theBuzzer = "";

var nameNumber = 0
/*
if (QueryString().id != null) {
  var room = firebase.database().ref('webBuzzer/' + QueryString().id)
  room.child('name').once('value', function(name) {
    document.getElementById('title').innerHTML = "<u>Web Buzzer</u><br> " + name.val()
  })
} else {
  window.open('index.html', '_self')
}
*/
if (QueryString().id != "") {
  
  var theDetails = QueryString().id
  var docRef = db.collection('webBuzzer').doc(theDetails)
   docRef.get().then(function(doc) {
   if (doc.exists) {
       console.log("Document data:", doc.data());
       data = doc.data()
       //console.log(data.name)
       document.getElementById('title').innerHTML = "<u>Web Buzzer</u><br> " + data.name
   } else {
       // doc.data() will be undefined in this case
       console.log("No such document!");
   }
 }).catch(function(error) {
   console.log("Error getting document:", error);
 });
 
 } else {
   window.open('index.html', '_self')
 }

function buzz() {
  //firebase.database().ref('webBuzzer/' + QueryString().id + '/mostRecentBuzz').set(nameNumber)
  db.collection("webBuzzer").doc(QueryString().id).update({
    "mostRecentBuzz": nameNumber
    })
    .then(function() {
      console.log("Document successfully updated!");
    });
}

function saveName() {
  var name = document.getElementById('name').value;
  if (name != "") {
    var num = generate5digitCode()
//Important - how to add fields to a map
    var peopleRef = db.collection('webBuzzer').doc(QueryString().id);
    var updateObj = {
      people: {}
    };
    updateObj.people[num] = name;
    var setWithMerge = peopleRef.set(updateObj, { merge: true });
   
        nameNumber = num
        document.getElementById('mainSection').innerHTML = "<button class=\"buzzer\" onclick=\"buzz()\"></button>"

        db.collection("webBuzzer").doc(QueryString().id)
          .onSnapshot(function(doc) {
          console.log("Current data: ", doc.data());
          data = doc.data()
          if (data.mostRecentBuzz != 0){
            if(data.mostRecentBuzz == nameNumber){
              document.getElementById('mainSection').innerHTML = "<h1>You were the first to buzz!</h1><br>"
            } else {
              //Important - find the name of the person that buzzed first. Uses keys and items
              Object.keys(data.people).forEach(function(item){
                if(item == data.mostRecentBuzz){
                  theBuzzer = data.people[item]
                };
                document.getElementById('mainSection').innerHTML = "<h1>" + theBuzzer + " was the first to buzz!</h1><br>"
                console.log(data.people[item])
              })
            }
          } else {
            document.getElementById('mainSection').innerHTML = "<button class=\"buzzer\" onclick=\"buzz()\"></button>"
          }
        
        });
        
        //Up to here...
        /*
        firebase.database().ref('webBuzzer/' + QueryString().id).child('mostRecentBuzz').on('value', function(data) {
          if (data.val() != 0) {
            if (data.val() == nameNumber) {
              document.getElementById('mainSection').innerHTML = "<h1>You were the first to buzz!</h1><br>"
            } else {
              room.child('people').child(data.val()).once('value', function(name) {
                document.getElementById('mainSection').innerHTML = "<h1>" + name.val() + " was the first to buzz!</h1><br>"
              })
            }
          } else {
            document.getElementById('mainSection').innerHTML = "<button class=\"buzzer\" onclick=\"buzz()\"></button>"
          }
        })
        */
      }
  else {
    alert('A valid name is required.')
  }
}

function generate5digitCode() {
  var roomCode = ""
  while (roomCode.length != 5) {
    roomCode = "" + Math.floor(Math.random()*100000)
  }
  return Number(roomCode);
}

function QueryString() {
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
}

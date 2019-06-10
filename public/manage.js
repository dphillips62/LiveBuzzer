// Your web app's Firebase configuration
var players = document.getElementById("PlayersNames")
var theBuzzer = "";

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

if (QueryString().id != "") {
  
 var theDetails = QueryString().id
 var docRef = db.collection('webBuzzer').doc(theDetails)
  docRef.get().then(function(doc) {
  if (doc.exists) {
      console.log("Document data:", doc.data());
      data = doc.data()
      //console.log(data.name)
      document.getElementById('title').innerHTML = "<u>Manage Web Buzzer</u><br> " + data.name
      document.getElementById('instructions').innerHTML = "Give your players this code: " + QueryString().id
      if(data.mostRecentBuzz == 0){
        document.getElementById('mostRecentBuzz').innerHTML = "Waiting for Buzz"
      } else {
          document.getElementById('mostRecentBuzz').innerHTML = data.name
      }  
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

function resetBuzz() {
  db.collection("webBuzzer").doc(QueryString().id).update({
  "mostRecentBuzz": 0
  })
  .then(function() {
    console.log("Document successfully updated!");
  });
  document.getElementById('mostRecentBuzz').innerHTML = "Waiting for Buzz"
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

db.collection("webBuzzer").doc(QueryString().id)
   .onSnapshot(function(doc) {
      console.log("Current data: ", doc.data());
      data = doc.data()
      PlayersNames.value = ""
          Object.keys(data.people).forEach(function(item){
            PlayersNames.value = PlayersNames.value + data.people[item] + "\n"
            if(item == data.mostRecentBuzz){
              theBuzzer = data.people[item]
            };
          })
      if(data.mostRecentBuzz != 0){
          Object.keys(data.people).forEach(function(item){
              if(item == data.mostRecentBuzz){
                theBuzzer = data.people[item]
              } 
          });
          document.getElementById('mostRecentBuzz').innerHTML = theBuzzer + " was the first to buzz!"
      } else{
          
          document.getElementById('mostRecentBuzz').innerHTML = "Waiting for Buzz"
      };
  });

  function closeBuzz(){
    db.collection("webBuzzer").doc(QueryString().id).delete().then(function() {
      console.log("Document successfully deleted!");
    }).catch(function(error) {
      console.error("Error removing document: ", error);
  });
  window.open('index.html')
  }

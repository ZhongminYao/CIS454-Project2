firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.

    console.log(firebase.auth().currentUser.uid);
    readData();

  } else {
    // No user is signed in.
  }
});

async function readData() {
  var user_uid = await firebase.auth().currentUser.uid;
  var db = await firebase.database();
  var userRef = await db.ref(`user/${user_uid}`);
  var user_email;
  var user_role;
  var user_age;
  var user_gender;

  function getName() {
    return new Promise((res, rej) => {
      userRef.on('value', snap => {
        console.log((snap.val()).name);
        var user_name = (snap.val()).name;
        res(user_name);
      });
    });
  }
  function getEmail() {
    return new Promise((res, rej) => {
      userRef.on('value', snap => {
        console.log((snap.val()).email);
        var user_email = (snap.val()).email;
        res(user_email);
      });
    });
  }

  function getRole() {
    return new Promise((res, rej) => {
      userRef.on('value', snap => {
        console.log((snap.val()).role);
        var user_role = (snap.val()).role;
        res(user_role);
      });
    });
  }

  function getAge() {
    return new Promise((res, rej) => {
      userRef.on('value', snap => {
        console.log((snap.val()).age);
        var user_age = (snap.val()).age;
        res(user_age);
      });
    });
  }

  function getGender() {
    return new Promise((res, rej) => {
      userRef.on('value', snap => {
        console.log((snap.val()).gender);
        var user_gender = (snap.val()).gender;
        res(user_gender);
      });
    });
  }


  var promise = userRef.on('value', snap => {
    console.log(snap.val());
    console.log((snap.val()).name);
    console.log((snap.val()).email);
    console.log((snap.val()).role);
    console.log((snap.val()).age);
    console.log((snap.val()).gender);
    user_name = (snap.val()).name;
    user_email = (snap.val()).email;
    user_role = (snap.val()).role;
    user_age = (snap.val()).age;
    user_gender = (snap.val()).gender;
  });

  var user_name = await getName();
  var name_screen = document.getElementById("name_full");
  name_screen.innerHTML = user_name;

  var user_email = await getEmail();
  var email_screen = document.getElementById("email_current");
  email_screen.innerHTML = user_email;

  var user_role = await getRole();
  var role_screen = document.getElementById("role_current");
  role_screen.innerHTML = user_role;

  var user_age = await getAge();
  var age_screen = document.getElementById("age_current");
  age_screen.innerHTML = user_age;

  var user_age = await getGender();
  var gender_screen = document.getElementById("gender_current");
  gender_screen.innerHTML = user_gender;
  //user_screen.innerHTML = "111";
  //document.location.reload(true);

  function createNode(element) {
    return document.createElement(element);
  }

  function append(parent, el) {
    return parent.appendChild(el);
  }
  const ul = document.getElementById('stats');

  var user_uid = await firebase.auth().currentUser.uid;;
  var eventRef = db.ref(`user/${user_uid}/events`);
  console.log(eventRef.getKey());

  await eventRef.once("value")
    .then(async function (snapshot) {
      var object_list = [];
      snapshot.forEach(function (_child) {
        {

          var participated_event = _child.key;
          console.log(participated_event);
          object_list.push(participated_event);

          /*
          let participated = document.createElement('span');
          var event_date;
          if (participated_event != 'name') {
            
            var eventRef = firebase.database().ref(`user/${user_uid}/events/${participated_event}`);
            function getEventDate() {
              return new Promise((res, rej) => {
                eventRef.on('value', snap => {
                  console.log((snap.val()).date);
                  event_date = (snap.val()).date;
                  res(event_date);
                });
              });
            }
            event_date =  getEventDate();
            
            
            //participated.innerHTML = `Participated Event Name: ${participated_event} on the date of ${event_date} <br>`;
            participated.innerHTML = `Participated Event Name: ${participated_event} <br>`;
          }
  
  
          append(ul, participated);
          */



        }
      })
      console.log(object_list)
      object_list.forEach(async function (element) {
        let participated = document.createElement('span');
        var event_date;
        if (element != 'name') {

          var eventRef = firebase.database().ref(`user/${user_uid}/events/${element}`);
          function getEventDate() {
            return new Promise((res, rej) => {
              eventRef.on('value', snap => {
                console.log((snap.val()).date);
                event_date = (snap.val()).date;
                res(event_date);
              });
            });
          }
          event_date = await getEventDate();


          participated.innerHTML = `Participated Event Name: ${element} on the date of ${event_date} <br>`;
          //participated.innerHTML = `Participated Event Name: ${participated_event} <br>`;
        }


        append(ul, participated);
      })

    })
}

async function submit() {
  var empty = checkEmpty();
  if (empty) {
    alert("please fill all fields if you want to update information");
  }
  else {
    var name_full = document.getElementById('name_input').value;
    var gender = document.getElementById('gender').value;
    var age = document.getElementById('age').value;
    var user_uid = firebase.auth().currentUser.uid;
    var userRef = firebase.database().ref(`user/${user_uid}`);

    await userRef.update({
      name: name_full,
      gender: gender,
      age: age,
    })

    alert('Your information is updated!');
  }
}

function checkEmpty() {
  var name_full = document.getElementById('name_input').value;
  var gender = document.getElementById('gender').value;
  var age = document.getElementById('age').value;

  if (name_full !== '' && gender !== '' && age !== '') {
    return false;
  }
  else {
    return true;
  }
}


function goBack() {
  window.location.href = "Landing1.html";
}


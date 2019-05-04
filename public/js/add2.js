// this document refer to https://www.youtube.com/watch?v=kmTECF0JZyQ
const eventList = document.querySelector('#event-list');

function renderEvent(doc) {
   let li = document.createElement('li');
   let name = document.createElement('span');
   let date = document.createElement('span');
   let des = document.createElement('span');
   let button = document.createElement("button");
   button.innerHTML = 'select';

   li.setAttribute('data-id', doc.id);
   name.textContent = `Event Name: ${doc.data().name}`;
   date.textContent = `Date: ${doc.data().date}`;
   des.textContent = `Descrption: ${doc.data().des}`;
   li.appendChild(name);
   li.appendChild(date);
   li.appendChild(des);
   li.appendChild(button);

   eventList.appendChild(li);

   button.onclick = async () => {
      writeEvent_user();
   }
}

function writeEvent_user() {
   var user_uid = firebase.auth().currentUser.uid;
   var userRef = firebase.database().ref(`user/${user_uid}`);
   userRef.update ({
        events: {
          name: `${doc.data().name}`
        }
    })
}


db.collection('events').get().then((snapshot) => {
   snapshot.docs.forEach(doc => {
      renderEvent(doc);
   })

})
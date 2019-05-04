const eventList = document.querySelector('#event-list');
const form = document.querySelector('#add-event-form');

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log(firebase.auth().currentUser.uid);
    } else {
        // No user is signed in.
    }
});

// this document refer to https://github.com/iamshaunjp/firebase-firestore-playlist/tree/lesson-9
function renderCafe(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let date = document.createElement('span');
    let des = document.createElement('span');
    let cross = document.createElement('div');
    let button = document.createElement("button");
    button.innerHTML = 'View Volunteer List';

    li.setAttribute('data-id', doc.id);
    name.textContent = `Event Name: ${doc.data().name}`;
    date.textContent = `Date: ${doc.data().date}`;
    des.textContent = `Descrption: ${doc.data().des}`;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(date);
    li.appendChild(des);
    li.appendChild(cross);
    li.appendChild(button);

    eventList.appendChild(li);

    button.onclick = async () => {
        var user_uid = await firebase.auth().currentUser.uid;
        var db = await firebase.database();
        await showVolunteer(doc, db, user_uid);
        console.log("finish read");
        button.disabled = true;
    }


    var count = 1;
    async function showVolunteer(doc, db, uid) {
        console.log("start show")
        var user_uid = uid;
        var eventRef = db.ref(`event/${doc.data().name}`);
        console.log(eventRef.getKey());

        eventRef.once("value")
            .then(function (snapshot) {
                snapshot.forEach(function (_child) {
                    var participant_event = _child.key;
                    console.log(participant_event);
                    let participant = document.createElement('span');
                    participant.textContent = `Participant(${count}) Name: ${participant_event}`;
                    li.appendChild(participant);
                    count++;
                })

            })


    }



    // deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('events').doc(id).delete();
    });
}

// getting data
// db.collection('cafes').orderBy('city').get().then(snapshot => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc);
//     });
// });

// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('events').add({
        name: form.name.value,
        date: form.date.value,
        des: form.des.value
    });
    form.name.value = '';
    form.date.value = '';
    form.des.value = '';
});

// real-time listener
db.collection('events').orderBy('date').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if (change.type == 'added') {
            renderCafe(change.doc);
        } else if (change.type == 'removed') {
            let li = eventList.querySelector('[data-id=' + change.doc.id + ']');
            eventList.removeChild(li);
        }
    });
})
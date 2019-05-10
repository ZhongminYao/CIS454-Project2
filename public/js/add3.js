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
async function renderCafe(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let date = document.createElement('span');
    let des = document.createElement('span');
    let space = document.createElement('span');
    let ppl = document.createElement('span');
    let ppl_signed = document.createElement('span');
    let ppl_stillNeed = document.createElement('span');
    let cross = document.createElement('div');
    let button = document.createElement("button");
    button.innerHTML = 'View Volunteer List';

    li.setAttribute('data-id', doc.id);
    name.textContent = `Event Name: ${doc.data().name}`;
    date.textContent = `Date: ${doc.data().date}`;
    des.textContent = `Descrption: ${doc.data().des}`;
    space.innerHTML = `<br>`;
    ppl.textContent = `People needed: ${doc.data().ppl}`;
    ppl_signed_num = await getPplSigned();
    ppl_signed.textContent = `People already signed for the event: ${ppl_signed_num}`;
    var ppl_numNeeded = doc.data().ppl - ppl_signed_num;
    ppl_stillNeed.textContent = `People still needed for the event: ${ppl_numNeeded}`;
    /*
    if (ppl_numNeeded == 0) {
        ppl_stillNeed.textContent = `People still needed for the event: ${ppl_numNeeded} (enough volunteers)`;
    }
    else {
        ppl_stillNeed.textContent = `People still needed for the event: ${ppl_numNeeded} (you can sign up for this event)`;
    }
    */
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(date);
    li.appendChild(des);
    li.appendChild(space);
    li.appendChild(ppl);
    li.appendChild(ppl_signed);
    li.appendChild(ppl_stillNeed);
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

        await eventRef.once("value")
            .then(function (snapshot) {
                snapshot.forEach(function (_child) {
                    var participant_event = _child.key;
                    console.log(participant_event);
                    let participant = document.createElement('span');
                    participant.textContent = `Participant(${count}) Name: ${participant_event}`;
                    let remove_btn = document.createElement("button");
                    remove_btn.innerHTML = 'Remove this volunteer';
                    li.appendChild(participant);
                    li.appendChild(remove_btn);
                    count++;

                    remove_btn.onclick = async () => {
                        var user_uid = await firebase.auth().currentUser.uid;
                        var rmv_Ref = await firebase.database().ref(`event/${doc.data().name}/${participant_event}`);
                        console.log(rmv_Ref)
                        rmv_Ref.remove()
                            .then(function () {
                                console.log("Remove succeeded.")
                            })
                            .catch(function (error) {
                                console.log("Remove failed: " + error.message)
                            });

                        var rmv_Ref_fromUser = await firebase.database().ref(`user/${user_uid}/events/${doc.data().name}`);
                        console.log(rmv_Ref_fromUser)
                        rmv_Ref_fromUser.remove()
                            .then(function () {
                                console.log("Remove date from user succeeded.")

                            })
                            .catch(function (error) {
                                console.log("Remove failed: " + error.message)
                            });
                        /*
                        var rmv_Ref_fromUser_date = await firebase.database().ref(`user/${user_uid}/events/${doc.data().name}/date`);
                        var rmv_Ref_fromUser_des = await firebase.database().ref(`user/${user_uid}/events/${doc.data().name}/description`);
                        var rmv_Ref_fromUser_name = await firebase.database().ref(`user/${user_uid}/events/${doc.data().name}/name`);
                        
                        rmv_Ref_fromUser_date.remove()
                            .then(function () {
                                console.log("Remove date from user succeeded.")

                            })
                            .catch(function (error) {
                                console.log("Remove failed: " + error.message)
                            });
                        rmv_Ref_fromUser_des.remove()
                            .then(function () {
                                console.log("Remove des from user succeeded.")

                            })
                            .catch(function (error) {
                                console.log("Remove failed: " + error.message)
                            });
                        rmv_Ref_fromUser_name.remove()
                            .then(function () {
                                console.log("Remove name from user succeeded.")

                            })
                            .catch(function (error) {
                                console.log("Remove failed: " + error.message)
                            });
                            */

                        remove_btn.disabled = true;
                        location.reload();
                        alert("Remove succeeded")
                    }
                })
            })
    }

    async function getPplSigned() {
        var user_uid = await firebase.auth().currentUser.uid;
        var eventRef = await firebase.database().ref(`event/${doc.data().name}`);
        var ppl_count = 0;
        await eventRef.once("value")
            .then(function (snapshot) {
                snapshot.forEach(function (_child) {
                    var participant_event = _child.key;
                    console.log(participant_event);
                    ppl_count++;
                })
            })
        console.log(ppl_count)
        return ppl_count;
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
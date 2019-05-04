// this document refer to https://github.com/iamshaunjp/firebase-firestore-playlist/tree/lesson-9
const eventList = document.querySelector('#event-list');
const form = document.querySelector('#add-event-form');

// create element & render cafe
function renderCafe(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let date = document.createElement('span');
    let des = document.createElement('span');
    let cross = document.createElement('div');
    let button=document.createElement("button");
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
        if(change.type == 'added'){
            renderCafe(change.doc);
        } else if (change.type == 'removed'){
            let li = eventList.querySelector('[data-id=' + change.doc.id + ']');
            eventList.removeChild(li);
        }
    });
});3
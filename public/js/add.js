// this document refer to https://github.com/iamshaunjp/firebase-firestore-playlist/tree/lesson-9
const eventList = document.querySelector('#event-list');
const form = document.querySelector('#add-event-form');

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
        des: form.des.value,
        ppl: form.ppl.value
    });
    alert("The event has been added, thank you!")
    
});
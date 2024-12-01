// تهيئة Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    const breakTableBody = document.querySelector('#breakTable tbody');

    db.collection('employees').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const employeeName = doc.id;
            const totalBreakTime = doc.data().totalBreakTime;

            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const timeCell = document.createElement('td');

            nameCell.textContent = employeeName;
            timeCell.textContent = formatTime(totalBreakTime);

            row.appendChild(nameCell);
            row.appendChild(timeCell);
            breakTableBody.appendChild(row);
        });
    });
});

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours} ساعة ${minutes} دقيقة ${secs} ثانية`;
}

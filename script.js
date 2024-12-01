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

let startTime = null;
let endTime = null;
let totalBreakTime = 0;
let employeeName = '';

document.getElementById('startBreak').addEventListener('click', () => {
    employeeName = document.getElementById('employeeName').value;
    if (employeeName) {
        startTime = new Date();
        alert('بدأ الاستأذان في: ' + startTime.toLocaleTimeString());
    } else {
        alert('يرجى إدخال اسم الموظف.');
    }
});

document.getElementById('endBreak').addEventListener('click', () => {
    if (startTime && employeeName) {
        endTime = new Date();
        const breakDuration = (endTime - startTime) / 1000; // حساب الفرق بالثواني
        totalBreakTime += breakDuration;

        // تحديث قاعدة البيانات
        db.collection('employees').doc(employeeName).get().then((doc) => {
            if (doc.exists) {
                db.collection('employees').doc(employeeName).update({
                    totalBreakTime: firebase.firestore.FieldValue.increment(breakDuration)
                });
            } else {
                db.collection('employees').doc(employeeName).set({
                    totalBreakTime: breakDuration
                });
            }
        });

        updateBreakTimeDisplay();
        alert('انتهى الاستأذان في: ' + endTime.toLocaleTimeString());
    } else {
        alert('يرجى بدء الاستأذان أولاً وإدخال اسم الموظف.');
    }
});

function updateBreakTimeDisplay() {
    const breakTimeElement = document.getElementById('breakTime');
    breakTimeElement.textContent = `وقت الاستأذان: ${formatTime(totalBreakTime)}`;
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours} ساعة ${minutes} دقيقة ${secs} ثانية`;
}

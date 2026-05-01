import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD0Uc2UxGt0MmOBk8IG0TZPQCmij6p5gqE",
    authDomain: "myportfolio-e77ba.firebaseapp.com",
    projectId: "myportfolio-e77ba",
    storageBucket: "myportfolio-e77ba.firebasestorage.app",
    messagingSenderId: "741383996320",
    appId: "1:741383996320:web:0fded52449d58e1d1b1ac5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('s').onclick = async () => {
    const title = document.getElementById('t').value;
    const content = document.getElementById('c').value;
    const msg = document.getElementById('msg');

    if(!title || !content) { msg.innerText = "Fill both fields!"; return; }
    msg.innerText = "Publishing...";

    try {
        await addDoc(collection(db, "poems"), { 
            title: title, 
            content: content, 
            timestamp: new Date() 
        });
        msg.style.color = "green";
        msg.innerText = "Success! Poem Added.";
        document.getElementById('t').value = '';
        document.getElementById('c').value = '';
    } catch (e) {
        msg.style.color = "red";
        msg.innerText = "Error: Rules check garnuhos!";
    }
};

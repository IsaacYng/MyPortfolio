import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Tapai ko Config
const firebaseConfig = {
    apiKey: "AIzaSyD0Uc2UxGt0MmOBk8IG0TZPQCmij6p5gqE",
    authDomain: "myportfolio-e77ba.firebaseapp.com",
    projectId: "myportfolio-e77ba",
    storageBucket: "myportfolio-e77ba.firebasestorage.app",
    messagingSenderId: "741383996320",
    appId: "1:741383996320:web:0fded52449d58e1d1b1ac5",
    measurementId: "G-JYR3BKGF26"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('saveBtn').addEventListener('click', async () => {
    const title = document.getElementById('poemTitle').value.trim();
    const content = document.getElementById('poemBody').value.trim();
    const status = document.getElementById('status');

    if (!title || !content) {
        status.className = "mt-4 text-center text-sm font-medium text-red-500";
        status.innerText = "Please fill both Title and Content!";
        return;
    }

    status.innerText = "Publishing...";
    
    try {
        await addDoc(collection(db, "poems"), {
            title: title,
            content: content,
            timestamp: new Date()
        });

        status.className = "mt-4 text-center text-sm font-medium text-green-500";
        status.innerText = "Poem published successfully!";
        
        // Form Clear Garne
        document.getElementById('poemTitle').value = '';
        document.getElementById('poemBody').value = '';
        
    } catch (e) {
        console.error(e);
        status.className = "mt-4 text-center text-sm font-medium text-red-500";
        status.innerText = "Error: Check Firestore Rules!";
    }
});

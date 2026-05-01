import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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

// Visitor ID Logic
if (!localStorage.getItem('visitor_id')) {
    localStorage.setItem('visitor_id', 'v_' + Math.random().toString(36).substr(2, 9));
}
const vId = localStorage.getItem('visitor_id');

async function loadPoems() {
    const list = document.getElementById('poems-list');
    try {
        const snap = await getDocs(query(collection(db, "poems"), orderBy("timestamp", "desc")));
        list.innerHTML = '';
        if(snap.empty) { list.innerHTML = "<p class='font-sans text-gray-400'>No poems found. Use entry.html to add one.</p>"; return; }
        
        snap.forEach(doc => renderPoem(doc.id, doc.data()));
    } catch (e) { list.innerHTML = "Error: Firestore Rules check garnuhos!"; }
}

function renderPoem(id, data) {
    const div = document.createElement('div');
    div.className = "border-b pb-10";
    div.innerHTML = `
        <h2 class="text-3xl font-bold mb-4">${data.title}</h2>
        <p class="italic text-gray-700 mb-6 whitespace-pre-wrap">${data.content}</p>
        <div class="font-sans bg-gray-50 p-4 rounded-xl">
            <div id="comments-${id}" class="space-y-2 mb-4 text-sm"></div>
            <div id="form-${id}" class="flex gap-2">
                <input id="in-${id}" type="text" placeholder="Review..." class="flex-1 p-2 rounded border">
                <button id="btn-${id}" class="bg-black text-white px-4 py-2 rounded text-xs">POST</button>
            </div>
        </div>`;
    document.getElementById('poems-list').appendChild(div);
    
    document.getElementById(`btn-${id}`).onclick = () => postComment(id);
    fetchComments(id);
    checkCommented(id);
}

async function postComment(id) {
    const val = document.getElementById(`in-${id}`).value;
    if(!val) return;
    await addDoc(collection(db, "comments"), { poemId: id, userId: vId, text: val, timestamp: new Date() });
    location.reload();
}

async function fetchComments(id) {
    const q = query(collection(db, "comments"), where("poemId", "==", id), orderBy("timestamp", "asc"));
    const snap = await getDocs(q);
    const box = document.getElementById(`comments-${id}`);
    snap.forEach(d => { box.innerHTML += `<p class="bg-white p-2 rounded shadow-sm italic">"${d.data().text}"</p>`; });
}

async function checkCommented(id) {
    const q = query(collection(db, "comments"), where("poemId", "==", id), where("userId", "==", vId));
    const snap = await getDocs(q);
    if(!snap.empty) document.getElementById(`form-${id}`).innerHTML = "<p class='text-green-600 text-xs font-bold'>✓ Review Shared</p>";
}

loadPoems();

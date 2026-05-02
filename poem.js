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

// Unique User ID check
if (!localStorage.getItem('v_id')) {
    localStorage.setItem('v_id', 'user_' + Math.random().toString(36).substr(2, 9));
}
const userId = localStorage.getItem('v_id');

async function loadPoems() {
    const list = document.getElementById('poems-list');
    try {
        // "timestamp" field ko aadhar ma naya kavita mathi aaucha
        const q = query(collection(db, "poems"), orderBy("timestamp", "desc"));
        const snap = await getDocs(q);
        list.innerHTML = '';

        snap.forEach(doc => renderPoem(doc.id, doc.data()));
    } catch (e) {
        list.innerHTML = "<p class='text-center text-red-400'>Error loading data. Check Firestore rules.</p>";
    }
}

function renderPoem(id, data) {
    const list = document.getElementById('poems-list');
    const poemHTML = `
        <article class="poem-card bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-50">
            <h2 class="devanagari text-3xl font-bold mb-8 text-gray-900 border-l-4 border-black pl-4">${data.title}</h2>
            <div class="devanagari text-xl leading-[2.2] text-gray-700 whitespace-pre-wrap mb-10 italic">
                ${data.content}
            </div>
            
            <div class="mt-10 pt-8 border-t border-gray-50">
                <div id="comments-${id}" class="space-y-3 mb-6"></div>
                
                <div id="action-${id}" class="flex gap-2">
                    <input id="in-${id}" type="text" placeholder="Pratikriya..." 
                           class="flex-1 bg-gray-50 p-3 rounded-xl text-sm border-none focus:ring-1 focus:ring-black">
                    <button id="btn-${id}" class="bg-black text-white px-6 rounded-xl text-xs font-bold transition active:scale-95">POST</button>
                </div>
            </div>
        </article>
    `;
    list.insertAdjacentHTML('beforeend', poemHTML);
    
    // Logic calls
    document.getElementById(`btn-${id}`).onclick = () => postComment(id);
    fetchComments(id);
    checkDone(id);
}

// ... baaki logic (postComment, fetchComments, checkDone) same rakkhnuhos ...
// (Maile agi diyeko code ko comment logic yaha pani valid hunchha)

async function postComment(id) {
    const text = document.getElementById(`in-${id}`).value;
    if(!text) return;
    await addDoc(collection(db, "comments"), { poemId: id, userId: userId, text: text, timestamp: new Date() });
    location.reload();
}

async function fetchComments(id) {
    const q = query(collection(db, "comments"), where("poemId", "==", id), orderBy("timestamp", "asc"));
    const snap = await getDocs(q);
    const box = document.getElementById(`comments-${id}`);
    snap.forEach(d => {
        box.innerHTML += `<p class="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 italic border-l-2 border-gray-200">"${d.data().text}"</p>`;
    });
}

async function checkDone(id) {
    const q = query(collection(db, "comments"), where("poemId", "==", id), where("userId", "==", userId));
    const snap = await getDocs(q);
    if(!snap.empty) document.getElementById(`action-${id}`).innerHTML = "<p class='text-xs font-bold text-green-500 py-2'>✓ Review shared. Thank you!</p>";
}

loadPoems();

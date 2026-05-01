import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Tapai ko Config Code
const firebaseConfig = {
    apiKey: "AIzaSyD0Uc2UxGt0MmOBk8IG0TZPQCmij6p5gqE",
    authDomain: "myportfolio-e77ba.firebaseapp.com",
    projectId: "myportfolio-e77ba",
    storageBucket: "myportfolio-e77ba.firebasestorage.app",
    messagingSenderId: "741383996320",
    appId: "1:741383996320:web:0fded52449d58e1d1b1ac5",
    measurementId: "G-JYR3BKGF26"
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Unique Visitor ID for "One ID, One Comment" logic
if (!localStorage.getItem('visitor_id')) {
    localStorage.setItem('visitor_id', 'visitor_' + Math.random().toString(36).substr(2, 9));
}
const visitorId = localStorage.getItem('visitor_id');

// Function: Database bata Poems lyaune
async function fetchPoems() {
    const poemList = document.getElementById('poems-list');
    try {
        const querySnapshot = await getDocs(collection(db, "poems"));
        poemList.innerHTML = ''; 

        if (querySnapshot.empty) {
            poemList.innerHTML = `<p class="font-sans text-gray-400 italic">Firebase Firestore ma 'poems' collection banayera data halnuhos hoi.</p>`;
            return;
        }

        querySnapshot.forEach((doc) => {
            renderPoem(doc.id, doc.data());
        });
    } catch (error) {
        console.error("Firebase Error:", error);
        poemList.innerHTML = `<p class="font-sans text-red-500 text-sm">Error: Firebase Rules check garnuhos (Set to 'true').</p>`;
    }
}

// Function: UI ma Poem ra Comment Section banaune
async function renderPoem(id, data) {
    const container = document.getElementById('poems-list');
    const article = document.createElement('article');
    article.className = "border-b border-gray-100 pb-16";

    article.innerHTML = `
        <h2 class="text-3xl font-bold mb-8">${data.title}</h2>
        <p class="poem-content italic text-gray-700 text-lg mb-10" style="white-space: pre-wrap;">${data.content}</p>
        
        <div class="font-sans bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
            <h4 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Reviews & Feedback</h4>
            <div id="comments-box-${id}" class="space-y-3 mb-6 text-sm text-gray-600">
                </div>
            
            <div id="action-area-${id}">
                <div class="flex gap-2">
                    <input type="text" id="input-${id}" placeholder="Meetho pratikriya lekhnuhos..." 
                           class="flex-1 p-3 bg-gray-50 rounded-lg text-sm outline-none focus:ring-1 focus:ring-black">
                    <button id="btn-${id}" class="bg-black text-white px-5 py-3 rounded-lg text-xs font-bold uppercase transition hover:bg-gray-800">Post</button>
                </div>
            </div>
        </div>
    `;

    container.appendChild(article);
    document.getElementById(`btn-${id}`).addEventListener('click', () => postReview(id));
    
    loadReviews(id);
    checkPreviousComment(id);
}

// Function: Comment Post Garne (Logic: One per user)
async function postReview(poemId) {
    const input = document.getElementById(`input-${poemId}`);
    const text = input.value.trim();

    if (!text) return;

    try {
        await addDoc(collection(db, "comments"), {
            poemId: poemId,
            userId: visitorId,
            text: text,
            timestamp: new Date()
        });
        location.reload(); 
    } catch (e) {
        alert("Wait! Firebase Rules ma write access 'true' chha ki nai check garnus.");
    }
}

// Function: Reviews load garne
async function loadReviews(poemId) {
    const box = document.getElementById(`comments-box-${poemId}`);
    const q = query(collection(db, "comments"), where("poemId", "==", poemId), orderBy("timestamp", "asc"));
    const snap = await getDocs(q);
    
    if (!snap.empty) {
        box.innerHTML = '';
        snap.forEach(d => {
            const p = document.createElement('p');
            p.className = "bg-gray-50 p-3 rounded-lg border-l-4 border-black";
            p.innerHTML = d.data().text;
            box.appendChild(p);
        });
    } else {
        box.innerHTML = `<p class="italic text-gray-300">Aahile samma kasaile pratikriya diyeko xaina.</p>`;
    }
}

// Function: Comment gareko xaki nai check garne
async function checkPreviousComment(poemId) {
    const q = query(collection(db, "comments"), 
                    where("poemId", "==", poemId), 
                    where("userId", "==", visitorId));
    const snap = await getDocs(q);
    
    if (!snap.empty) {
        document.getElementById(`action-area-${poemId}`).innerHTML = 
            `<p class="text-xs font-bold text-green-600 bg-green-50 p-3 rounded-lg">
                Sadhanyabad! Tapai le aafno pratikriya di-saknu bhayo.
            </p>`;
    }
}

fetchPoems();

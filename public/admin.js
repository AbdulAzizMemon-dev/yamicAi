import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const logoutBtn = document.getElementById('logoutBtn');
const usersBody = document.getElementById('usersBody');

// Check if admin is logged in
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Admin email check
    if (!user.email.endsWith('xantrail.stu@gmail.com')) {
        alert("Access denied. Admins only.");
        await signOut(auth);
        window.location.href = 'login.html';
        return;
    }

    loadUsers();
});

// Logout button
logoutBtn.onclick = async () => {
    try {
        await signOut(auth);
        window.location.href = "login.html";
    } catch (err) {
        alert("Logout failed: " + err.message);
    }
};

// Fetch all users from Firestore
async function loadUsers() {
    usersBody.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

    try {
        const usersCol = collection(db, 'users');
        const snapshot = await getDocs(usersCol);
        usersBody.innerHTML = "";

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const messages = data.messages || 0;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.name || ''}</td>
                <td>${data.email || ''}</td>
                <td>${messages}</td>
            `;
            usersBody.appendChild(row);
        });

        if (snapshot.empty) {
            usersBody.innerHTML = "<tr><td colspan='3'>No users found.</td></tr>";
        }

    } catch (err) {
        console.error("Error fetching users:", err);
        usersBody.innerHTML = "<tr><td colspan='3'>Error loading users.</td></tr>";
    }
}

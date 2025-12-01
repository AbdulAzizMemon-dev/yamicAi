// script.js
import { auth, db } from './firebase.js';
import {
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  doc,
  getDoc,
  updateDoc,
  increment
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// UI Elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const logoutBtn = document.getElementById('logoutBtn');

let currentUserData = null;

// Disable send until user data loads
sendBtn.disabled = true;
sendBtn.innerText = "Loading...";

/* ---------------------------------------
   AUTH + LOAD USER DATA
--------------------------------------- */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      console.warn("User document missing in Firestore!");
      sendBtn.innerText = "Error";
      return;
    }

    currentUserData = snap.data();

    // Ready to chat
    sendBtn.disabled = false;
    sendBtn.innerText = "Send";

  } catch (err) {
    console.error("User load error:", err);
    sendBtn.innerText = "Error";
  }
});

/* ---------------------------------------
    ADD MESSAGE TO UI
--------------------------------------- */
function addMessage(content, type) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', type);
  msgDiv.innerHTML = type === 'bot-message'
    ? marked.parse(content)
    : content;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* ---------------------------------------
    TYPE MESSAGE WITH ADAPTIVE SPEED
--------------------------------------- */
async function typeMessage(text) {
  return new Promise(resolve => {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', 'bot-message');
    msgDiv.innerHTML = "";
    chatMessages.appendChild(msgDiv);

    const words = text.split(/\s+/).length;
    let totalTime = words <= 200 ? 500 : 500; // 0.5s for short, 1.5s for long

    const speed = Math.max(1, totalTime / text.length); // ms per char
    let i = 0;

    function typeChar() {
      if (i < text.length) {
        msgDiv.innerHTML += text.charAt(i);
        i++;
        chatMessages.scrollTop = chatMessages.scrollHeight;
        setTimeout(typeChar, speed);
      } else {
        msgDiv.innerHTML = marked.parse(text);
        resolve();
      }
    }

    typeChar();
  });
}

/* ---------------------------------------
    SEND MESSAGE TO SERVER
--------------------------------------- */
sendBtn.onclick = async () => {
  const message = userInput.value.trim();
  if (!message) return;

  if (!currentUserData) {
    alert("Still loading your profile. Please wait a moment.");
    return;
  }

  addMessage(message, "user-message");
  userInput.value = "";
  sendBtn.disabled = true;
  sendBtn.innerText = "Sending...";

  try {
    // Update message count
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      messages: increment(1)
    });

    // Send to server
    const res = await fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        name: currentUserData.name
      })
    });

    const data = await res.json();

    // Type the bot message
    await typeMessage(data.response);

  } catch (err) {
    addMessage("Error: " + err.message, "bot-message");
  } finally {
    sendBtn.disabled = false;
    sendBtn.innerText = "Send";
  }
};

/* ---------------------------------------
    ENTER KEY SEND
--------------------------------------- */
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendBtn.click();
});

/* ---------------------------------------
    LOGOUT BUTTON
--------------------------------------- */
logoutBtn.onclick = async () => {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (err) {
    alert("Logout failed: " + err.message);
  }
};

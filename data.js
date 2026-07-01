let currentUser = null;

function handleAuth(type) {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    if(!u || !p) return alert("البيانات ناقصة!");
    
    let users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if(type === 'register') {
        if(users[u]) return alert("المستخدم موجود!");
        users[u] = { pass: p, score: 0 };
        localStorage.setItem('users', JSON.stringify(users));
        alert("تم التسجيل!");
    } else {
        if(!users[u] || users[u].pass !== p) return alert("خطأ في البيانات!");
        currentUser = u;
        document.getElementById('authOverlay').style.display = 'none';
        document.getElementById('userScore').innerText = "نقاطك: " + users[u].score;
    }
}

async function send() {
    const input = document.getElementById("userInput");
    const chat = document.getElementById("chatMessages");
    const text = input.value;
    if (!text || !currentUser) return;
    
    chat.innerHTML += `<div class="msg user-msg">${text}</div>`;
    input.value = "";
    
    // التفاعل مع AI
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer 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" },
        body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ role: "system", content: "أنت زيد، مساعد ذكي لطلاب الإعدادية الليبيين، تطوير همّام الكانبي. رد بلهجة الطالب (ليبي أو فصحى) وركز على المنهج الليبي." }, { role: "user", content: text }] })
    });
    const d = await res.json();
    const reply = d.choices[0].message.content;
    chat.innerHTML += `<div class="msg ai-msg">${reply}</div>`;
    
    // تحديث النقاط
    let users = JSON.parse(localStorage.getItem('users'));
    users[currentUser].score += 10; // كل سؤال بـ 10 نقاط
    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('userScore').innerText = "نقاطك: " + users[currentUser].score;
}

function openLeaderboard() {
    const list = document.getElementById('leaderboardList');
    list.innerHTML = "";
    let users = JSON.parse(localStorage.getItem('users'));
    Object.keys(users).sort((a,b) => users[b].score - users[a].score).forEach(u => {
        list.innerHTML += `<div style="padding:10px; border-bottom:1px solid #334155;">${u}: ${users[u].score} نقطة</div>`;
    });
    document.getElementById('leaderboardModal').style.display = 'flex';
}
function closeModal() { document.getElementById('leaderboardModal').style.display = 'none'; }
function logout() { location.reload(); }
    const i = document.getElementById("userInput"), ch = document.getElementById("chat"), t = i.value, n = localStorage.getItem('currentUser');
    if (!t) return;
    ch.innerHTML += `<div style="margin:5px; text-align:right;">${n}: ${t}</div>`;
    i.value = "";
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer ضَع_مفتاحك_هنا" },
        body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ role: "system", content: "أنت زيد، مساعد ذكي لطلاب الإعدادية الليبيين، تطوير همّام الكانبي. رد بلهجة الطالب (ليبي أو فصحى) وركز على المنهج الليبي." }, { role: "user", content: t }] })
    });
    const d = await res.json();
    ch.innerHTML += `<div style="background:#38bdf8; color:#0f172a; padding:10px; border-radius:10px; margin:5px; text-align:right;">زيد: ${d.choices[0].message.content}</div>`;
}
window.onload = () => { if(localStorage.getItem('currentUser')) document.getElementById('loginScreen').style.display = 'none'; }

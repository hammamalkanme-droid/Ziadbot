function login() { 
    const n = document.getElementById('studentName').value; 
function login() { 
    const n = document.getElementById('studentName').value; 
    if(n) { 
        localStorage.setItem('currentUser', n); 
        // التعديل هنا: إضافة توقيت عشوائي لضمان التحديث
        window.location.href = window.location.pathname + '?v=' + new Date().getTime(); 
    } else { alert("يا بطل، اكتب اسمك أولاً!"); } 
}

function logout() { localStorage.removeItem('currentUser'); location.reload(); }
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function calc() {
    const m = parseFloat(document.getElementById('marks').value);
    const t = parseFloat(document.getElementById('total').value);
    const name = localStorage.getItem('currentUser');
    if(m && t) {
        const res = (m/t)*100;
        localStorage.setItem('student_'+name, JSON.stringify({name, percentage: res.toFixed(2)}));
        document.getElementById('result').innerText = "نسبتك: " + res.toFixed(2) + "%";
    }
}
function openHallOfFame() {
    const c = document.getElementById('hallContent'); c.innerHTML = "";
    for(let i=0; i<localStorage.length; i++) {
        let k = localStorage.key(i);
        if(k.startsWith('student_')) {
            let s = JSON.parse(localStorage.getItem(k));
            c.innerHTML += `<div style="padding:10px; border-bottom:1px solid #334155;">${s.name}: ${s.percentage}%</div>`;
        }
    }
    openModal('hallModal');
}
async function send() {
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

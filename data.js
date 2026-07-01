function login() {
    const name = document.getElementById('studentName').value;
    if(name) { localStorage.setItem('currentUser', name); document.getElementById('loginScreen').style.display = 'none'; }
    else { alert("لازم تدخل اسمك يا بطل!"); }
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
    const content = document.getElementById('hallContent'); content.innerHTML = "";
    for(let i=0; i<localStorage.length; i++) {
        let key = localStorage.key(i);
        if(key.startsWith('student_')) {
            let s = JSON.parse(localStorage.getItem(key));
            content.innerHTML += `<div style="padding:10px; border-bottom:1px solid #334155;">${s.name}: ${s.percentage}%</div>`;
        }
    }
    openModal('hallModal');
}

async function send() {
    const input = document.getElementById("userInput");
    const chat = document.getElementById("chat");
    const text = input.value;
    const name = localStorage.getItem('currentUser');
    if (!text) return;
    chat.innerHTML += `<div style="margin:5px; text-align:right;">${name}: ${text}</div>`;
    input.value = "";
    
    const API_KEY = "ضَع_مفتاحك_هنا"; // <--- ضع مفتاحك هنا
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + API_KEY },
        body: JSON.stringify({ 
            model: "llama-3.1-8b-instant", 
            messages: [
                { role: "system", content: "أنت 'زيد'، مساعد ذكي لطلاب الإعدادية في ليبيا (فريق النخبة). رد بلهجة المستخدم (ليبي بالليبي، فصحى بالفصحى). ركز فقط على المنهج الليبي." }, 
                { role: "user", content: text }
            ] 
        })
    });
    const data = await res.json();
    chat.innerHTML += `<div style="background:#38bdf8; color:#0f172a; padding:10px; border-radius:10px; margin:5px; text-align:right;">زيد: ${data.choices[0].message.content}</div>`;
}

window.onload = () => { if(localStorage.getItem('currentUser')) document.getElementById('loginScreen').style.display = 'none'; }

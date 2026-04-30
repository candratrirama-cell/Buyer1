// DOM Elements
const landingPage = document.getElementById('landing-page');
const mainApp = document.getElementById('main-app');
const enterAppBtn = document.getElementById('enter-app-btn');

const form = document.getElementById('search-form');
const input = document.getElementById('question-input');
const resultContainer = document.getElementById('result-container');
const welcomeScreen = document.getElementById('welcome-screen');
const loading = document.getElementById('loading');
const answerText = document.getElementById('answer-text');
const sourcesList = document.getElementById('sources-list');
const similarList = document.getElementById('similar-list');
const historyList = document.getElementById('history-list');
const userQueryDisplay = document.getElementById('user-query-display');

// Sidebar UI Elements
const menuToggle = document.getElementById('menu-toggle');
const closeSidebar = document.getElementById('close-sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

// --- 1. UI NAVIGATION LOGIC ---

// Masuk dari Landing Page ke Main App
enterAppBtn.addEventListener('click', () => {
    landingPage.style.display = 'none';
    mainApp.classList.remove('hidden-section');
});

// Sidebar Toggle
menuToggle.addEventListener('click', () => {
    sidebarOverlay.classList.add('sidebar-visible');
});

closeSidebar.addEventListener('click', () => {
    sidebarOverlay.classList.remove('sidebar-visible');
});

// Tutup sidebar jika klik di luar area menu
sidebarOverlay.addEventListener('click', (e) => {
    if (e.target === sidebarOverlay) {
        sidebarOverlay.classList.remove('sidebar-visible');
    }
});


// --- 2. CORE LOGIC (UNCHANGED FUNCTIONALITY) ---

// Load history on start
let searchHistory = JSON.parse(localStorage.getItem('turboHistory')) || [];
renderHistory();

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (query) {
        performSearch(query);
    }
});

document.getElementById('clear-history').addEventListener('click', () => {
    searchHistory = [];
    localStorage.removeItem('turboHistory');
    renderHistory();
});

async function performSearch(question) {
    // UI Updates
    welcomeScreen.classList.add('hidden'); // Sembunyikan Greeting
    resultContainer.classList.add('hidden');
    loading.classList.remove('hidden');
    
    // Tampilkan apa yang user ketik di bubble user
    userQueryDisplay.textContent = question;
    
    input.value = ''; // Clear input biar rapi
    input.blur(); // Tutup keyboard di HP

    // Add to history
    addToHistory(question);

    try {
        // Panggil Serverless Function (Logic Asli)
        const response = await fetch(`/api?question=${encodeURIComponent(question)}`);
        const data = await response.json();

        if (response.ok) {
            displayResults(data);
        } else {
            alert('Error: ' + data.error);
            loading.classList.add('hidden'); // Hide loading on error
        }
    } catch (error) {
        console.error(error);
        alert('Gagal mengambil data. Silakan coba lagi.');
        loading.classList.add('hidden'); // Hide loading on error
    }
}

function displayResults(data) {
    loading.classList.add('hidden');
    
    // 1. Tampilkan Jawaban
    answerText.textContent = data.answer;

    // 2. Tampilkan Sources
    sourcesList.innerHTML = '';
    if (data.sources && data.sources.length > 0) {
        data.sources.forEach(url => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = url;
            a.target = '_blank';
            try {
                a.textContent = new URL(url).hostname; 
            } catch (e) {
                a.textContent = url;
            }
            li.appendChild(a);
            sourcesList.appendChild(li);
        });
    } else {
        sourcesList.innerHTML = '<li>Tidak ada sumber ditemukan.</li>';
    }

    // 3. Tampilkan Similar Questions
    similarList.innerHTML = '';
    if (data.similarQuestions && data.similarQuestions.length > 0) {
        data.similarQuestions.forEach(q => {
            const li = document.createElement('li');
            li.textContent = q.question || q; 
            li.onclick = () => performSearch(li.textContent);
            similarList.appendChild(li);
        });
    } else {
        similarList.innerHTML = '<li>Tidak ada pertanyaan terkait.</li>';
    }

    resultContainer.classList.remove('hidden');
}

function addToHistory(question) {
    // Hapus duplikat dan limit 10 item
    searchHistory = searchHistory.filter(item => item !== question);
    searchHistory.unshift(question);
    if (searchHistory.length > 10) searchHistory.pop();
    
    localStorage.setItem('turboHistory', JSON.stringify(searchHistory));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    searchHistory.forEach(q => {
        const li = document.createElement('li');
        li.textContent = q;
        li.onclick = () => {
            performSearch(q);
            sidebarOverlay.classList.remove('sidebar-visible'); // Tutup sidebar setelah klik
        };
        historyList.appendChild(li);
    });
}

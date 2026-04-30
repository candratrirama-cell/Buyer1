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
const menuToggle = document.getElementById('menu-toggle');
const closeSidebar = document.getElementById('close-sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

let searchHistory = JSON.parse(localStorage.getItem('turboHistory') || '[]');

enterAppBtn.addEventListener('click', () => {
    landingPage.style.display = 'none';
    mainApp.classList.remove('hidden-section');
});

menuToggle.addEventListener('click', () => sidebarOverlay.classList.add('sidebar-visible'));
closeSidebar.addEventListener('click', () => sidebarOverlay.classList.remove('sidebar-visible'));

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) performSearch(q);
});

async function performSearch(question) {
    welcomeScreen.classList.add('hidden');
    resultContainer.classList.add('hidden');
    loading.classList.remove('hidden');
    userQueryDisplay.textContent = question;
    input.value = '';
    addToHistory(question);

    try {
        const response = await fetch(`/api?question=${encodeURIComponent(question)}`);
        const data = await response.json();
        displayResult(data);
    } catch (err) {
        answerText.textContent = "Error: " + err.message;
        loading.classList.add('hidden');
        resultContainer.classList.remove('hidden');
    }
}

function displayResult(data) {
    loading.classList.add('hidden');
    answerText.innerHTML = data.answer.replace(/\n/g, '<br>');
    sourcesList.innerHTML = '';
    data.sources.forEach(url => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = url; a.target = "_blank"; a.textContent = url;
        li.appendChild(a);
        sourcesList.appendChild(li);
    });
    similarList.innerHTML = '';
    data.similarQuestions.forEach(q => {
        const li = document.createElement('li');
        li.textContent = q;
        li.onclick = () => performSearch(q);
        similarList.appendChild(li);
    });
    resultContainer.classList.remove('hidden');
}

function addToHistory(q) {
    searchHistory = [q, ...searchHistory.filter(x => x !== q)].slice(0, 10);
    localStorage.setItem('turboHistory', JSON.stringify(searchHistory));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    searchHistory.forEach(q => {
        const li = document.createElement('li');
        li.textContent = q;
        li.onclick = () => { performSearch(q); sidebarOverlay.classList.remove('sidebar-visible'); };
        historyList.appendChild(li);
    });
}
renderHistory();

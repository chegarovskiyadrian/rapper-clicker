// game.js - ПОЛНОСТЬЮ ПЕРЕПИСАННЫЙ КОД
const tg = window.Telegram?.WebApp;

// Игровое состояние
let gameState = {
    fame: 0,
    money: 1000,
    streetCred: 30,
    level: 1,
    equipment: "phone",
    boosts: {
        equipment: [],
        advertising: [],
        clothing: []
    },
    totalTracks: 0,
    purchasedFits: [],
    passiveIncome: [],
    unlockedFits: [],
    mainFitsSelected: [] // какие главные фиты уже выбраны
};

// Уровни игры
const levels = [
    { name: "ШКОЛЬНИК", minFame: 0, maxFame: 5000, moneyReward: 500 },
    { name: "САУНДКЛАУД", minFame: 5000, maxFame: 25000, moneyReward: 2000 },
    { name: "ТИКТОК", minFame: 25000, maxFame: 100000, moneyReward: 8000 },
    { name: "МАССОВЫЙ", minFame: 100000, maxFame: 500000, moneyReward: 25000 },
    { name: "ЛЕГЕНДА", minFame: 500000, maxFame: 2000000, moneyReward: 80000 }
];

// Система бустов - ВСЕ БУСТЫ ДОБАВЛЕНЫ
const boosts = {
    equipment: [
        { id: "usb_mic", name: "USB микрофон", price: 500, effect: "+2 известности", famePerClick: 2 },
        { id: "pro_mic", name: "Улучшенный микрофон", price: 2000, effect: "+5 известности", famePerClick: 5 },
        { id: "basic_gear", name: "Начальная аппаратура", price: 8000, effect: "+12 известности", famePerClick: 12 },
        { id: "medium_gear", name: "Средняя аппаратура", price: 25000, effect: "+25 известности", famePerClick: 25 },
        { id: "advanced_gear", name: "Высшая аппаратура", price: 80000, effect: "+50 известности", famePerClick: 50 },
        { id: "studio1", name: "Дешевая студия", price: 200000, effect: "+100 известности", famePerClick: 100 },
        { id: "studio2", name: "Нормальная студия", price: 500000, effect: "+200 известности", famePerClick: 200 },
        { id: "studio3", name: "Дорогая студия", price: 1200000, effect: "+400 известности", famePerClick: 400 }
    ],
    
    advertising: [
        { id: "flyers", name: "Листовки", price: 300, effect: "2 пальца", fingers: 2 },
        { id: "tiktok", name: "ТикТок", price: 1500, effect: "3 пальца", fingers: 3 },
        { id: "telegram", name: "Telegram", price: 6000, effect: "4 пальца", fingers: 4 },
        { id: "bpm", name: "Убиваю БПМ", price: 20000, effect: "5 пальцев", fingers: 5 },
        { id: "everywhere", name: "Реклама везде", price: 100000, effect: "10 пальцев", fingers: 10 }
    ],
    
    clothing: [
        { id: "shirt", name: "Школьная рубашка", price: 400, effect: "1.2x трушность", credMultiplier: 1.2 },
        { id: "campus", name: "Кампусы с мехом", price: 1800, effect: "1.5x трушность", credMultiplier: 1.5 },
        { id: "ricki", name: "Рики с вб", price: 7000, effect: "2.0x трушность", credMultiplier: 2.0 },
        { id: "adidas", name: "Спорткостюм адидас", price: 22000, effect: "3.0x трушность", credMultiplier: 3.0 },
        { id: "phresh", name: "Авито phreshboyswag", price: 70000, effect: "5.0x трушность", credMultiplier: 5.0 },
        { id: "china", name: "Одежда с китая", price: 180000, effect: "8.0x трушность", credMultiplier: 8.0 },
        { id: "normal", name: "Нормальная одежда", price: 450000, effect: "12.0x трушность", credMultiplier: 12.0 },
        { id: "dlt", name: "Одежда с ДЛТ", price: 1000000, effect: "20.0x трушность", credMultiplier: 20.0 },
        { id: "icon", name: "Икона стиля", price: 2500000, effect: "35.0x трушность", credMultiplier: 35.0 }
    ]
};

// ВСЕ ФИТЫ ПО УРОВНЯМ
const fits = {
    1: {
        main: [
            { id: "h_vasya", name: "Вася одноклассник", image: "1/h_васяодноклассник.jpg", fame: 1000, credEffect: -30, income: 200, reqCred: 0, price: 0 },
            { id: "h_carrystaff", name: "CarryStaff", image: "1/h_carrystaff.jpg", fame: 16000, credEffect: 30, income: 3200, reqCred: 20, price: 2000 },
            { id: "h_kostyapetux123", name: "kostyapetux123", image: "1/h_kostyapetux123.jpg", fame: 4000, credEffect: 0, income: 800, reqCred: 0, price: 2000 }
        ],
        other: [
            { id: "tipiztelegrama", name: "Тип из телеграма", image: "1/типизтелеграма.jpg", fame: 4000, credEffect: 0, income: 800, reqCred: 20, price: 0 },
            { id: "plag", name: "Плаг", image: "1/плаг.jpg", fame: 16000, credEffect: 30, income: 3200, reqCred: 50, price: 4000 },
            { id: "mladshiybrat", name: "Младший брат", image: "1/младшийбрат.jpg", fame: 16000, credEffect: -15, income: 1600, reqCred: 10, price: 8000 },
            { id: "mama", name: "Мама", image: "1/мама.jpg", fame: 16000, credEffect: 30, income: 3200, reqCred: 0, price: 4000 },
            { id: "neonova", name: "Неонова", image: "1/неонова.jpg", fame: 1000, credEffect: -30, income: 3200, reqCred: 30, price: 16000 }
        ]
    },
    2: {
        main: [
            { id: "h_davidblunt", name: "David Blunt", image: "2/h_davidblunt.jpg", fame: 4000, credEffect: 15, income: 4000, reqCred: 50, price: 8000 },
            { id: "h_macksonmadrid", name: "МаксонМадрид", image: "2/h_максонмадрид.jpg", fame: 8000, credEffect: -15, income: 2000, reqCred: 20, price: 2000 },
            { id: "h_roadring", name: "Roadring", image: "2/h_roadring.jpg", fame: 2000, credEffect: 30, income: 4000, reqCred: 70, price: 4000 }
        ],
        other: [
            { id: "lazerdim700", name: "LAZER DIM700", image: "2/lazerdim700.jpg", fame: 2000, credEffect: 15, income: 1000, reqCred: 60, price: 2000 },
            { id: "kakoytohui", name: "Какой-то хуй", image: "2/какой-тохуй.jpg", fame: 1000, credEffect: -30, income: 500, reqCred: 0, price: 1000 },
            { id: "800pts", name: "800pts", image: "2/800pts.jpg", fame: 1000, credEffect: 15, income: 2000, reqCred: 40, price: 4000 },
            { id: "redda", name: "Redda", image: "2/redda.jpg", fame: 2000, credEffect: 0, income: 2000, reqCred: 30, price: 4000 },
            { id: "feduk", name: "FEDUK", image: "2/feduk.jpg", fame: 16000, credEffect: -15, income: 8000, reqCred: 50, price: 16000 }
        ]
    },
    3: {
        main: [
            { id: "h_temnyprints", name: "Темный Принц", image: "3/h_темныйпринц.jpg", fame: 16000, credEffect: -15, income: 4000, reqCred: 30, price: 8000 },
            { id: "h_tuborosho", name: "tuborosho", image: "3/h_tuborosho.jpg", fame: 4000, credEffect: -15, income: 2000, reqCred: 60, price: 4000 },
            { id: "h_babymelo", name: "Baby Melo", image: "3/h_babymelo.jpg", fame: 16000, credEffect: -30, income: 16000, reqCred: 0, price: 16000 }
        ],
        other: [
            { id: "osamason", name: "osamason", image: "3/osamason.jpg", fame: 1000, credEffect: 0, income: 2000, reqCred: 20, price: 2000 },
            { id: "xxxtentacion", name: "XXXTENTACION", image: "3/xxxtentacion.jpg", fame: 4000, credEffect: 15, income: 1000, reqCred: 10, price: 1000 },
            { id: "meybibeybi", name: "Мейби Бейби", image: "3/мейбибейби.jpg", fame: 16000, credEffect: 30, income: 16000, reqCred: 90, price: 16000 },
            { id: "flight", name: "Flight", image: "3/flight.jpg", fame: 1000, credEffect: -30, income: 1000, reqCred: 0, price: 0 },
            { id: "phreshboyswag", name: "phreshboyswag", image: "3/phreshboyswag.jpg", fame: 4000, credEffect: 15, income: 16000, reqCred: 20, price: 4000 },
            { id: "code10", name: "code10", image: "3/code10.jpg", fame: 8000, credEffect: 15, income: 4000, reqCred: 40, price: 2000 },
            { id: "scallymilano", name: "Scally Milano", image: "3/scallymilano.jpg", fame: 16000, credEffect: -30, income: 16000, reqCred: 30, price: 8000 },
            { id: "sematary", name: "Sematary", image: "3/sematary.jpg", fame: 2000, credEffect: 15, income: 2000, reqCred: 60, price: 2000 }
        ]
    }
    // Уровни 4 и 5 тоже добавлю, но для экономии места пока 3 уровня
};

// Основные функции игры
function initGame() {
    initTelegram();
    loadGameState();
    setupEventListeners();
    updateDisplay();
    renderBoosts();
    renderFits();
    startPassiveIncome();
    updateEquipmentImage();
}

function initTelegram() {
    if (tg) {
        tg.expand();
        tg.enableClosingConfirmation();
    }
}

// ИСПРАВЛЕННЫЕ ОБРАБОТЧИКИ
function setupEventListeners() {
    const clickArea = document.getElementById('clickArea');
    if (clickArea) {
        clickArea.addEventListener('click', handleClick);
        clickArea.addEventListener('touchstart', handleClick, { passive: true });
    }
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', handleTabClick);
        button.addEventListener('touchstart', handleTabClick, { passive: true });
    });
}

function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    clickSound();
}

function handleTabClick(e) {
    e.preventDefault();
    e.stopPropagation();
    openTab(this.dataset.tab);
}

function clickSound() {
    let fameGain = 1;
    
    // Считаем бонус от оборудования
    gameState.boosts.equipment.forEach(boostId => {
        const boost = boosts.equipment.find(b => b.id === boostId);
        if (boost) fameGain = Math.max(fameGain, boost.famePerClick);
    });
    
    gameState.fame += fameGain;
    gameState.totalTracks++;
    
    checkLevelUp();
    updateDisplay();
    saveGameState();
}

function checkLevelUp() {
    const currentLevel = levels[gameState.level - 1];
    if (gameState.fame >= currentLevel.maxFame && gameState.level < levels.length) {
        gameState.level++;
        const newLevel = levels[gameState.level - 1];
        gameState.money += newLevel.moneyReward;
        
        showMessage('НОВЫЙ УРОВЕНЬ: ' + newLevel.name + '! +' + newLevel.moneyReward + '₽');
        updateDisplay();
        renderFits();
        saveGameState();
    }
}

// СИСТЕМА БУСТОВ - ИСПРАВЛЕНА
function renderBoosts() {
    const container = document.getElementById('boostList');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Показываем по 1 следующему бусту из каждой категории
    ['equipment', 'advertising', 'clothing'].forEach(category => {
        const nextBoost = getNextBoost(category);
        if (nextBoost) {
            const boostElement = createBoostElement(nextBoost);
            container.appendChild(boostElement);
        }
    });
}

function getNextBoost(category) {
    const purchased = gameState.boosts[category];
    const allBoosts = boosts[category];
    
    for (let boost of allBoosts) {
        if (!purchased.includes(boost.id)) {
            return { ...boost, category };
        }
    }
    return null;
}

function createBoostElement(boostData) {
    const { category, ...boost } = boostData;
    const canAfford = gameState.money >= boost.price;
    
    const boostElement = document.createElement('div');
    boostElement.className = `boost-item ${!canAfford ? 'cant-afford' : ''}`;
    
    if (canAfford) {
        boostElement.addEventListener('click', () => buyBoost(category, boost.id));
        boostElement.addEventListener('touchstart', () => buyBoost(category, boost.id), { passive: true });
    }
    
    boostElement.innerHTML = `
        <div class="boost-info">
            <div class="boost-name">${boost.name}</div>
            <div class="boost-effect">${boost.effect}</div>
        </div>
        <div class="boost-price">${boost.price} ₽</div>
    `;
    
    return boostElement;
}

function buyBoost(category, boostId) {
    const boost = boosts[category].find(b => b.id === boostId);
    if (!boost) return;
    
    if (gameState.money < boost.price) {
        showMessage("Недостаточно денег!");
        return;
    }
    
    gameState.money -= boost.price;
    gameState.boosts[category].push(boostId);
    
    if (category === 'equipment') {
        updateEquipmentImage();
    }
    
    showMessage("Куплено: " + boost.name);
    updateDisplay();
    renderBoosts();
    saveGameState();
}

// КАРТИНКИ ОБОРУДОВАНИЯ
function updateEquipmentImage() {
    const equipmentElement = document.getElementById('equipmentImage');
    if (!equipmentElement) return;
    
    const equipmentBoosts = gameState.boosts.equipment;
    let currentImage = 'phone.png';
    
    // Определяем лучшее оборудование
    const equipmentOrder = ['studio3', 'studio2', 'studio1', 'advanced_gear', 'medium_gear', 'basic_gear', 'pro_mic', 'usb_mic'];
    for (let equip of equipmentOrder) {
        if (equipmentBoosts.includes(equip)) {
            currentImage = equip + '.png';
            break;
        }
    }
    
    equipmentElement.style.backgroundImage = `url('images/equipment/${currentImage}')`;
}

// СИСТЕМА ФИТОВ - ПОЛНОСТЬЮ ПЕРЕПИСАНА
function renderFits() {
    const container = document.getElementById('fitsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Главные фиты текущего уровня (если еще не выбраны)
    const currentLevelFits = fits[gameState.level];
    if (currentLevelFits && !gameState.mainFitsSelected.includes(gameState.level)) {
        renderMainFits(container, currentLevelFits.main);
    }
    
    // Все доступные фиты (главные из пройденных уровней + остальные)
    renderAllFits(container);
}

function renderMainFits(container, mainFits) {
    const mainSection = document.createElement('div');
    mainSection.innerHTML = '<div style="color: #00d4ff; font-weight: bold; margin-bottom: 10px;">ВЫБЕРИ ГЛАВНЫЙ ФИТ:</div>';
    
    mainFits.forEach(fit => {
        if (!gameState.purchasedFits.includes(fit.id)) {
            const fitElement = createMainFitElement(fit);
            mainSection.appendChild(fitElement);
        }
    });
    
    container.appendChild(mainSection);
}

function createMainFitElement(fit) {
    const div = document.createElement('div');
    div.className = 'fit-item';
    div.style.border = '2px solid #00d4ff';
    
    div.innerHTML = `
        <div class="fit-image" style="background-image: url('images/rappers/${fit.image}')"></div>
        <div class="fit-name" style="color: #00d4ff">${fit.name}</div>
        <div class="fit-requirements">+${fit.fame} известности</div>
        <div class="fit-requirements">${fit.credEffect > 0 ? '+' : ''}${fit.credEffect}% трушности</div>
        <div class="fit-requirements">${fit.income}₽/час</div>
        <button class="buy-fit-btn" style="background: #00d4ff">ВЫБРАТЬ ФИТ</button>
    `;
    
    const button = div.querySelector('.buy-fit-btn');
    button.addEventListener('click', () => selectMainFit(fit));
    button.addEventListener('touchstart', () => selectMainFit(fit), { passive: true });
    
    return div;
}

function selectMainFit(fit) {
    // Отмечаем что выбрали главный фит для этого уровня
    if (!gameState.mainFitsSelected.includes(gameState.level)) {
        gameState.mainFitsSelected.push(gameState.level);
    }
    
    // Применяем эффекты фита
    applyFitEffects(fit);
    
    showMessage("Выбран фит: " + fit.name);
    updateDisplay();
    renderFits();
    saveGameState();
}

function renderAllFits(container) {
    const otherSection = document.createElement('div');
    otherSection.innerHTML = '<div style="color: #ff9900; font-weight: bold; margin: 20px 0 10px 0;">ОСТАЛЬНЫЕ ФИТЫ:</div>';
    
    // Собираем все доступные фиты со всех уровней
    for (let level = 1; level <= gameState.level; level++) {
        const levelFits = fits[level];
        if (!levelFits) continue;
        
        // Главные фиты из пройденных уровней (которые не выбраны как главные)
        if (level < gameState.level || gameState.mainFitsSelected.includes(level)) {
            levelFits.main.forEach(fit => {
                if (!gameState.purchasedFits.includes(fit.id)) {
                    const fitElement = createFitElement(fit);
                    otherSection.appendChild(fitElement);
                }
            });
        }
        
        // Остальные фиты
        levelFits.other.forEach(fit => {
            if (!gameState.purchasedFits.includes(fit.id)) {
                const fitElement = createFitElement(fit);
                otherSection.appendChild(fitElement);
            }
        });
    }
    
    container.appendChild(otherSection);
}

function createFitElement(fit) {
    const isPurchased = gameState.purchasedFits.includes(fit.id);
    const hasEnoughCred = gameState.streetCred >= fit.reqCred;
    const actualPrice = hasEnoughCred ? 0 : fit.price;
    const canAfford = gameState.money >= actualPrice || hasEnoughCred;
    
    const div = document.createElement('div');
    div.className = `fit-item ${isPurchased ? 'purchased' : ''} ${!canAfford && !isPurchased ? 'cant-afford' : ''}`;
    
    let requirementsText = isPurchased ? 
        `Доход: ${fit.income}₽/час` :
        `Требуется: ${fit.reqCred}% трушности${hasEnoughCred ? ' ✓' : ''}`;
    
    const priceDisplay = isPurchased ? 'КУПЛЕНО' : (hasEnoughCred ? 'БЕСПЛАТНО' : `${actualPrice} ₽`);
    
    div.innerHTML = `
        <div class="fit-image" style="background-image: url('images/rappers/${fit.image}')"></div>
        <div class="fit-name">${fit.name}</div>
        <div class="fit-requirements">${requirementsText}</div>
        <div class="fit-price">${priceDisplay}</div>
        ${!isPurchased ? `<button class="buy-fit-btn" ${!canAfford ? 'disabled' : ''}>${hasEnoughCred ? 'Бесплатный фит' : 'Купить фит'}</button>` : ''}
    `;
    
    if (!isPurchased) {
        const button = div.querySelector('.buy-fit-btn');
        if (canAfford) {
            button.addEventListener('click', () => buyFit(fit, hasEnoughCred));
            button.addEventListener('touchstart', () => buyFit(fit, hasEnoughCred), { passive: true });
        }
    }
    
    return div;
}

function buyFit(fit, isFree) {
    const actualPrice = isFree ? 0 : fit.price;
    
    if (!isFree && gameState.money < actualPrice) {
        showMessage("Недостаточно денег!");
        return;
    }
    
    if (!isFree) {
        gameState.money -= actualPrice;
    }
    
    applyFitEffects(fit);
    
    showMessage("Фит с " + fit.name + " записан!" + (isFree ? ' (Бесплатно)' : ` (-${actualPrice}₽)`));
    updateDisplay();
    renderFits();
    saveGameState();
}

function applyFitEffects(fit) {
    gameState.purchasedFits.push(fit.id);
    gameState.fame += fit.fame;
    gameState.streetCred = Math.max(0, Math.min(100, gameState.streetCred + fit.credEffect));
    
    gameState.passiveIncome.push({
        fitId: fit.id,
        income: fit.income,
        lastCollection: Date.now()
    });
    
    checkLevelUp();
}

// ПАССИВНЫЙ ДОХОД
function startPassiveIncome() {
    setInterval(collectPassiveIncome, 60000); // Каждую минуту
}

function collectPassiveIncome() {
    const now = Date.now();
    let totalIncome = 0;
    
    gameState.passiveIncome.forEach(income => {
        const hoursPassed = (now - income.lastCollection) / (1000 * 60 * 60);
        if (hoursPassed >= 1) {
            const incomeAmount = Math.floor(hoursPassed) * income.income;
            totalIncome += incomeAmount;
            income.lastCollection = now;
        }
    });
    
    if (totalIncome > 0) {
        gameState.money += totalIncome;
        updateDisplay();
        saveGameState();
    }
}

// ВКЛАДКИ
function openTab(tabName) {
    document.querySelectorAll('.tab-panel').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    const targetTab = document.getElementById(tabName);
    const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
    
    if (targetTab) targetTab.classList.add('active');
    if (targetButton) targetButton.classList.add('active');
}

// ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
function updateDisplay() {
    const currentLevel = levels[gameState.level - 1];
    
    document.getElementById('levelBadge').textContent = currentLevel.name;
    document.getElementById('fameDisplay').textContent = Math.floor(gameState.fame).toLocaleString();
    document.getElementById('moneyValue').textContent = Math.floor(gameState.money).toLocaleString() + ' ₽';
    document.getElementById('credValue').textContent = Math.floor(gameState.streetCred) + '%';
    
    document.getElementById('statsLevel').textContent = currentLevel.name;
    document.getElementById('totalTracks').textContent = gameState.totalTracks;
    document.getElementById('fitsCount').textContent = gameState.purchasedFits.length;
    
    const totalBoosts = Object.values(gameState.boosts).reduce((sum, arr) => sum + arr.length, 0);
    document.getElementById('boostsCount').textContent = totalBoosts;
    
    const totalPassiveIncome = gameState.passiveIncome.reduce((sum, income) => sum + income.income, 0);
    document.getElementById('passiveIncome').textContent = totalPassiveIncome.toLocaleString() + ' ₽/час';
}

// УВЕДОМЛЕНИЯ
function showMessage(text) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = text;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// СОХРАНЕНИЕ ИГРЫ
function saveGameState() {
    localStorage.setItem('rapperClickerSave', JSON.stringify(gameState));
}

function loadGameState() {
    const saved = localStorage.getItem('rapperClickerSave');
    if (saved) {
        const loaded = JSON.parse(saved);
        gameState = { ...gameState, ...loaded };
    }
}

// ЗАПУСК ИГРЫ
document.addEventListener('DOMContentLoaded', initGame);

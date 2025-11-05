// Инициализация Telegram Web App
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
    unlockedFits: []
};

// Уровни игры
const levels = [
    { name: "ШКОЛЬНИК", minFame: 0, maxFame: 5000, moneyReward: 500 },
    { name: "САУНДКЛАУД", minFame: 5000, maxFame: 25000, moneyReward: 2000 },
    { name: "ТИКТОК", minFame: 25000, maxFame: 100000, moneyReward: 8000 }
];

// Система бустов
const boosts = {
    equipment: [
        { id: "usb_mic", name: "USB микрофон", price: 500, effect: "+2 известности", famePerClick: 2, image: "usb_mic.png" },
        { id: "pro_mic", name: "Улучшенный микрофон", price: 2000, effect: "+5 известности", famePerClick: 5, image: "pro_mic.png" }
    ],
    
    advertising: [
        { id: "flyers", name: "Листовки", price: 300, effect: "2 пальца", fingers: 2 }
    ],
    
    clothing: [
        { id: "shirt", name: "Школьная рубашка", price: 400, effect: "1.2x трушность", credMultiplier: 1.2 }
    ]
};

// Система фитов
const fits = {
    1: [
        { id: "vasya", name: "Вася одноклассник", image: "1/h_васяодноклассник.jpg", 
          requirements: { streetCred: 0, price: 0 }, effects: { fame: 500, streetCred: 2, income: 500 } },
        { id: "carrystaff", name: "CarryStaff", image: "1/h_carrystaff.jpg",
          requirements: { streetCred: 20, price: 2000 }, effects: { fame: 2000, streetCred: 5, income: 2000 } }
    ]
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

// ИСПРАВЛЕННЫЕ ОБРАБОТЧИКИ ДЛЯ TELEGRAM
function setupEventListeners() {
    const clickArea = document.getElementById('clickArea');
    if (clickArea) {
        // Для телефонов и компьютеров
        clickArea.addEventListener('click', handleClick);
        clickArea.addEventListener('touchstart', handleClick, { passive: true });
    }
    
    // Обработчики для вкладок
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
    
    gameState.boosts.equipment.forEach(boostId => {
        const boost = boosts.equipment.find(b => b.id === boostId);
        if (boost) fameGain = boost.famePerClick;
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
        
        unlockFitsForLevel(gameState.level);
        
        showMessage('НОВЫЙ УРОВЕНЬ: ' + newLevel.name);
        updateDisplay();
        renderFits();
        saveGameState();
    }
}

function unlockFitsForLevel(level) {
    const levelFits = fits[level] || [];
    levelFits.forEach(fit => {
        if (!gameState.unlockedFits.includes(fit.id)) {
            gameState.unlockedFits.push(fit.id);
        }
    });
}

// Система бустов
function renderBoosts() {
    const container = document.getElementById('boostList');
    if (!container) return;
    
    container.innerHTML = '';
    
    [getNextBoost('equipment'), getNextBoost('advertising'), getNextBoost('clothing')].forEach(boost => {
        if (boost) {
            const boostElement = createBoostElement(boost);
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

// Картинки оборудования
function updateEquipmentImage() {
    const equipmentElement = document.getElementById('equipmentImage');
    if (!equipmentElement) return;
    
    const equipmentBoosts = gameState.boosts.equipment;
    let currentImage = 'phone.png';
    
    if (equipmentBoosts.includes("pro_mic")) currentImage = "pro_mic.png";
    else if (equipmentBoosts.includes("usb_mic")) currentImage = "usb_mic.png";
    
    equipmentElement.style.backgroundImage = `url('images/equipment/${currentImage}')`;
}

// Система фитов
function renderFits() {
    const container = document.getElementById('fitsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let level = 1; level <= gameState.level; level++) {
        const levelFits = fits[level] || [];
        
        levelFits.forEach(fit => {
            if (gameState.unlockedFits.includes(fit.id) && !gameState.purchasedFits.includes(fit.id)) {
                const fitElement = createFitElement(fit);
                container.appendChild(fitElement);
            }
        });
    }
}

function createFitElement(fit) {
    const isPurchased = gameState.purchasedFits.includes(fit.id);
    const hasEnoughCred = gameState.streetCred >= fit.requirements.streetCred;
    const actualPrice = hasEnoughCred ? 0 : fit.requirements.price;
    const canAfford = gameState.money >= actualPrice;
    
    const div = document.createElement('div');
    div.className = `fit-item ${isPurchased ? 'purchased' : ''} ${!canAfford && !isPurchased ? 'cant-afford' : ''}`;
    
    let requirementsText = isPurchased ? 
        `Доход: ${fit.effects.income}₽/час` :
        `Требуется: ${fit.requirements.streetCred}% трушности${hasEnoughCred ? ' ✓' : ''}`;
    
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
        button.addEventListener('click', () => buyFit(fit.id, hasEnoughCred));
        button.addEventListener('touchstart', () => buyFit(fit.id, hasEnoughCred), { passive: true });
    }
    
    return div;
}

function buyFit(fitId, isFree) {
    const fit = Object.values(fits).flat().find(f => f.id === fitId);
    if (!fit) return;
    
    const actualPrice = isFree ? 0 : fit.requirements.price;
    
    if (!isFree && gameState.money < actualPrice) {
        showMessage("Недостаточно денег!");
        return;
    }
    
    if (!isFree) {
        gameState.money -= actualPrice;
    }
    
    gameState.purchasedFits.push(fitId);
    gameState.fame += fit.effects.fame;
    
    const streetCredEffect = (fit.effects.streetCred - 3) * 15;
    gameState.streetCred = Math.max(0, Math.min(100, gameState.streetCred + streetCredEffect));
    
    gameState.passiveIncome.push({
        fitId: fitId,
        income: fit.effects.income,
        lastCollection: Date.now()
    });
    
    showMessage("Фит с " + fit.name + " записан!" + (isFree ? ' (Бесплатно)' : ''));
    updateDisplay();
    renderFits();
    saveGameState();
}

// Пассивный доход
function startPassiveIncome() {
    setInterval(collectPassiveIncome, 60000);
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

// Вкладки
function openTab(tabName) {
    document.querySelectorAll('.tab-panel').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// Обновление интерфейса
function updateDisplay() {
    const currentLevel = levels[gameState.level - 1];
    
    document.getElementById('levelBadge').textContent = currentLevel.name;
    document.getElementById('fameDisplay').textContent = gameState.fame.toLocaleString();
    document.getElementById('moneyValue').textContent = gameState.money.toLocaleString() + ' ₽';
    document.getElementById('credValue').textContent = gameState.streetCred + '%';
    
    document.getElementById('statsLevel').textContent = currentLevel.name;
    document.getElementById('totalTracks').textContent = gameState.totalTracks;
    document.getElementById('fitsCount').textContent = gameState.purchasedFits.length;
    
    const totalBoosts = Object.values(gameState.boosts).reduce((sum, arr) => sum + arr.length, 0);
    document.getElementById('boostsCount').textContent = totalBoosts;
    
    const totalPassiveIncome = gameState.passiveIncome.reduce((sum, income) => sum + income.income, 0);
    document.getElementById('passiveIncome').textContent = totalPassiveIncome.toLocaleString() + ' ₽/час';
}

// Уведомления
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

// Сохранение игры
function saveGameState() {
    localStorage.setItem('rapperClickerSave', JSON.stringify(gameState));
}

function loadGameState() {
    const saved = localStorage.getItem('rapperClickerSave');
    if (saved) {
        const loaded = JSON.parse(saved);
        gameState = { ...gameState, ...loaded };
        
        for (let level = 1; level <= gameState.level; level++) {
            unlockFitsForLevel(level);
        }
    }
}

// Запуск игры
document.addEventListener('DOMContentLoaded', initGame);

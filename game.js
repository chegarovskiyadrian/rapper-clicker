// game.js - ПОЛНОСТЬЮ ИСПРАВЛЕННЫЙ КОД

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
        clothing: [],
        flex: [],
        experimental: []
    },
    totalTracks: 0,
    purchasedFits: [],
    passiveIncome: [],
    unlockedFits: [] // Все разблокированные фиты по уровням
};

// Уровни игры
const levels = [
    { name: "ШКОЛЬНИК", minFame: 0, maxFame: 5000, moneyReward: 500 },
    { name: "САУНДКЛАУД", minFame: 5000, maxFame: 25000, moneyReward: 2000 },
    { name: "ТИКТОК", minFame: 25000, maxFame: 100000, moneyReward: 8000 },
    { name: "МАССОВЫЙ", minFame: 100000, maxFame: 500000, moneyReward: 25000 },
    { name: "ЛЕГЕНДА", minFame: 500000, maxFame: 2000000, moneyReward: 80000 }
];

// Система бустов
const boosts = {
    equipment: [
        { id: "usb_mic", name: "USB микрофон", price: 500, effect: "+2 известности", famePerClick: 2, image: "images/equipment/usb_mic.png" },
        { id: "pro_mic", name: "Улучшенный микрофон", price: 2000, effect: "+5 известности", famePerClick: 5, image: "images/equipment/pro_mic.png" },
        { id: "basic_gear", name: "Начальная аппаратура", price: 8000, effect: "+12 известности", famePerClick: 12, image: "images/equipment/basic_gear.png" },
        { id: "medium_gear", name: "Средняя аппаратура", price: 25000, effect: "+25 известности", famePerClick: 25, image: "images/equipment/medium_gear.png" },
        { id: "advanced_gear", name: "Высшая аппаратура", price: 80000, effect: "+50 известности", famePerClick: 50, image: "images/equipment/advanced_gear.png" },
        { id: "studio1", name: "Дешевая студия", price: 200000, effect: "+100 известности", famePerClick: 100, image: "images/equipment/studio1.png" },
        { id: "studio2", name: "Нормальная студия", price: 500000, effect: "+200 известности", famePerClick: 200, image: "images/equipment/studio2.png" },
        { id: "studio3", name: "Дорогая студия", price: 1200000, effect: "+400 известности", famePerClick: 400, image: "images/equipment/studio3.png" }
    ],

    advertising: [
        { id: "flyers", name: "Листовки", price: 300, effect: "2 пальца", fingers: 2 },
        { id: "tiktok", name: "ТикТок", price: 1500, effect: "3 пальца", fingers: 3 },
        { id: "telegram", name: "Telegram", price: 6000, effect: "4 пальца", fingers: 4 },
        { id: "ubivau", name: "Убиваю БПМ", price: 20000, effect: "5 пальцев", fingers: 5 },
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
    ],

    flex: [
        { id: "pistol", name: "Пистолет", price: 15000, effect: "2.0x к трушности", credMultiplier: 2.0 },
        { id: "drugs", name: "Наркотики", price: 5000, effect: "3x известность на 3 мин", temporary: true },
        { id: "jail", name: "Сесть в тюрьму", price: 0, effect: "1.5x трушности", credMultiplier: 1.5, uses: 2 }
    ],

    experimental: [
        { id: "new_sound", name: "Новый звук", price: 8000, effect: "2x известность на 15 мин", temporary: true }
    ]
};

// Система фитов (упрощенная версия для теста)
const fits = {
    1: [
        { id: "vasya", name: "Вася одноклассник", image: "images/rappers/1/h_васяодноклассник.jpg",
          requirements: { streetCred: 0, price: 0 }, effects: { fame: 500, streetCred: 2, income: 500 } },
        { id: "carrystaff", name: "CarryStaff", image: "images/rappers/1/h_carrystaff.jpg",
          requirements: { streetCred: 20, price: 2000 }, effects: { fame: 2000, streetCred: 5, income: 2000 } },
        { id: "kostyapetux", name: "kostyapetux123", image: "images/rappers/1/h_kostyapetux123.jpg",
          requirements: { streetCred: 0, price: 2000 }, effects: { fame: 1000, streetCred: 3, income: 1000 } },
        { id: "telegram_type", name: "Тип из телеграма", image: "images/rappers/1/типизтелеграма.jpg",
          requirements: { streetCred: 20, price: 0 }, effects: { fame: 1000, streetCred: 3, income: 1000 } },
        { id: "plug", name: "Плаг", image: "images/rappers/1/плаг.jpg",
          requirements: { streetCred: 50, price: 8000 }, effects: { fame: 2000, streetCred: 5, income: 5000 } }
    ],
    2: [
        { id: "davidblunt", name: "David Blunt", image: "images/rappers/2/h_davidblunt.jpg",
          requirements: { streetCred: 50, price: 25000 }, effects: { fame: 3000, streetCred: 4, income: 4000 } },
        { id: "maxsonmadrid", name: "МаксонМадрид", image: "images/rappers/2/h_максонмадрид.jpg",
          requirements: { streetCred: 20, price: 2000 }, effects: { fame: 4000, streetCred: 3, income: 2000 } },
        { id: "roadring", name: "Roadring", image: "images/rappers/2/h_roadring.jpg",
          requirements: { streetCred: 70, price: 8000 }, effects: { fame: 2000, streetCred: 5, income: 4000 } }
    ]
};

// Основные функции игры
function initGame() {
    loadGameState();
    setupEventListeners();
    updateDisplay();
    renderBoosts();
    renderFits();
    startPassiveIncome();
    updateEquipmentImage();
    updateBackgroundLayers();
}

function setupEventListeners() {
    document.getElementById('clickArea').addEventListener('click', clickSound);

    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            openTab(this.dataset.tab);
        });
    });
}

function clickSound() {
    let fameGain = 1;

    // Применяем бусты аппаратуры
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

        // Разблокируем ВСЕ фиты нового уровня
        unlockFitsForLevel(gameState.level);

        showMessage(`🎉 Новый уровень: ${newLevel.name}!`);
        updateDisplay();
        renderFits();
        updateBackgroundLayers();
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

// Система бустов (ИСПРАВЛЕНА)
function renderBoosts() {
    const container = document.getElementById('boostList');
    if (!container) return;

    container.innerHTML = '';

    // Аппаратура (только следующий доступный)
    const nextEquipment = getNextBoost('equipment');
    if (nextEquipment) {
        container.appendChild(createBoostElement(nextEquipment, 'equipment'));
    }

    // Реклама (только следующий доступный)
    const nextAdvertising = getNextBoost('advertising');
    if (nextAdvertising) {
        container.appendChild(createBoostElement(nextAdvertising, 'advertising'));
    }

    // Одежда (только следующий доступный)
    const nextClothing = getNextBoost('clothing');
    if (nextClothing) {
        container.appendChild(createBoostElement(nextClothing, 'clothing'));
    }

    // Флекс-бусты (всегда доступны)
    boosts.flex.forEach(boost => {
        if (!gameState.boosts.flex.includes(boost.id) && (boost.uses === undefined || boost.uses > 0)) {
            container.appendChild(createBoostElement(boost, 'flex'));
        }
    });

    // Экспериментальные бусты (всегда доступны)
    boosts.experimental.forEach(boost => {
        if (!gameState.boosts.experimental.includes(boost.id)) {
            container.appendChild(createBoostElement(boost, 'experimental'));
        }
    });
}

function getNextBoost(category) {
    const purchased = gameState.boosts[category];
    const allBoosts = boosts[category];

    for (let boost of allBoosts) {
        if (!purchased.includes(boost.id)) {
            return boost;
        }
    }
    return null;
}

function createBoostElement(boost, category) {
    const canAfford = gameState.money >= boost.price;
    const isTemporary = boost.temporary;
    const hasUses = boost.uses !== undefined;

    const boostElement = document.createElement('div');
    boostElement.className = `boost-item ${!canAfford ? 'cant-afford' : ''}`;

    if (canAfford && !isTemporary && !hasUses) {
        boostElement.onclick = () => buyBoost(category, boost.id);
    } else if (canAfford && (isTemporary || hasUses)) {
        boostElement.onclick = () => buyBoost(category, boost.id);
    }

    let priceText = boost.price + ' ₽';
    if (hasUses && boost.uses > 0) {
        priceText = `Бесплатно (${boost.uses} раз)`;
    } else if (hasUses && boost.uses === 0) {
        priceText = 'Использован';
    }

    boostElement.innerHTML = `
        <div class="boost-info">
            <div class="boost-name">${boost.name}</div>
            <div class="boost-effect">${boost.effect}</div>
        </div>
        <div class="boost-price">${priceText}</div>
    `;

    return boostElement;
}

function buyBoost(category, boostId) {
    const boost = boosts[category].find(b => b.id === boostId);
    if (!boost) return;

    // Проверяем использование
    if (boost.uses !== undefined && boost.uses <= 0) {
        showMessage('Достигнут лимит использований!');
        return;
    }

    if (gameState.money < boost.price && boost.price > 0) {
        showMessage("Недостаточно денег!");
        return;
    }

    // СПИСЫВАЕМ ДЕНЬГИ
    if (boost.price > 0) {
        gameState.money -= boost.price;
    }

    // УМЕНЬШАЕМ КОЛИЧЕСТВО ИСПОЛЬЗОВАНИЙ
    if (boost.uses !== undefined && boost.uses > 0) {
        boost.uses--;
    }

    // ДОБАВЛЯЕМ В КУПЛЕННЫЕ (если не временный)
    if (!boost.temporary && boost.uses === undefined) {
        gameState.boosts[category].push(boostId);
    }

    // Применяем эффекты
    if (boost.credMultiplier) {
        gameState.streetCred = Math.min(100, Math.floor(gameState.streetCred * boost.credMultiplier));
    }

    if (category === 'equipment') {
        updateEquipmentImage();
    }

    showMessage(`Приобретено: ${boost.name}`);
    updateDisplay();
    renderBoosts();
    saveGameState();
}

// ИСПРАВЛЕННАЯ ФУНКЦИЯ СМЕНЫ КАРТИНОК
function updateEquipmentImage() {
    const equipmentElement = document.getElementById('equipmentImage');
    if (!equipmentElement) return;

    const equipmentBoosts = gameState.boosts.equipment;

    // Определяем самую продвинутую купленную аппаратуру
    let currentEquipment = 'phone'; // базовая картинка

    const equipmentOrder = [
        "studio3", "studio2", "studio1", "advanced_gear",
        "medium_gear", "basic_gear", "pro_mic", "usb_mic"
    ];

    for (let equip of equipmentOrder) {
        if (equipmentBoosts.includes(equip)) {
            currentEquipment = equip;
            break;
        }
    }

    equipmentElement.style.backgroundImage = `url('images/equipment/${currentEquipment}.png')`;
}

// Система фитов (ИСПРАВЛЕНА)
function renderFits() {
    const container = document.getElementById('fitsContainer');
    if (!container) return;

    container.innerHTML = '';

    // Показываем ВСЕ разблокированные фиты текущего уровня и ниже
    for (let level = 1; level <= gameState.level; level++) {
        const levelFits = fits[level] || [];

        levelFits.forEach(fit => {
            // Показываем только разблокированные фиты
            if (gameState.unlockedFits.includes(fit.id) && !gameState.purchasedFits.includes(fit.id)) {
                const fitElement = createFitElement(fit);
                container.appendChild(fitElement);
            }
        });
    }

    // Также показываем купленные фиты
    gameState.purchasedFits.forEach(fitId => {
        const fit = findFitById(fitId);
        if (fit) {
            const fitElement = createFitElement(fit);
            container.appendChild(fitElement);
        }
    });
}

function findFitById(fitId) {
    for (let level = 1; level <= 5; level++) {
        const levelFits = fits[level] || [];
        const fit = levelFits.find(f => f.id === fitId);
        if (fit) return fit;
    }
    return null;
}

function createFitElement(fit) {
    const isPurchased = gameState.purchasedFits.includes(fit.id);
    const hasEnoughCred = gameState.streetCred >= fit.requirements.streetCred;

    // Цена: если хватает трушности - бесплатно, иначе - платно
    const actualPrice = hasEnoughCred ? 0 : fit.requirements.price;
    const canAfford = gameState.money >= actualPrice;

    const div = document.createElement('div');
    div.className = `fit-item ${isPurchased ? 'purchased' : ''} ${!canAfford && !isPurchased ? 'cant-afford' : ''}`;

    let requirementsText = '';
    if (isPurchased) {
        requirementsText = `Доход: ${fit.effects.income}₽/час`;
    } else {
        if (hasEnoughCred) {
            requirementsText = `Требуется: ${fit.requirements.streetCred}% трушности ✓`;
        } else {
            requirementsText = `Требуется: ${fit.requirements.streetCred}% трушности<br>Или купи за ${fit.requirements.price}₽`;
        }
    }

    const priceDisplay = isPurchased ? 'КУПЛЕНО' : (hasEnoughCred ? 'БЕСПЛАТНО' : `${actualPrice} ₽`);

    div.innerHTML = `
        <div class="fit-image" style="background-image: url('${fit.image}')"></div>
        <div class="fit-name">${fit.name}</div>
        <div class="fit-requirements">${requirementsText}</div>
        <div class="fit-price">${priceDisplay}</div>
        ${!isPurchased ? `<button class="buy-fit-btn" ${!canAfford ? 'disabled' : ''}>${hasEnoughCred ? 'Бесплатный фит' : 'Купить фит'}</button>` : ''}
    `;

    if (!isPurchased) {
        div.querySelector('.buy-fit-btn').onclick = () => buyFit(fit.id, hasEnoughCred);
    }

    return div;
}

// ИСПРАВЛЕННАЯ ФУНКЦИЯ ПОКУПКИ ФИТА
function buyFit(fitId, isFree) {
    const fit = findFitById(fitId);
    if (!fit) return;

    const actualPrice = isFree ? 0 : fit.requirements.price;

    // Проверяем деньги (только если не бесплатно)
    if (!isFree && gameState.money < actualPrice) {
        showMessage("Недостаточно денег!");
        return;
    }

    // СПИСЫВАЕМ ДЕНЬГИ (если не бесплатно)
    if (!isFree) {
        gameState.money -= actualPrice;
    }

    // Добавляем в купленные
    gameState.purchasedFits.push(fitId);

    // Применяем эффекты
    gameState.fame += fit.effects.fame;

    // Конвертируем влияние на трушность: 1 = -30%, 5 = +30%
    const streetCredEffect = (fit.effects.streetCred - 3) * 15;
    gameState.streetCred = Math.max(0, Math.min(100, gameState.streetCred + streetCredEffect));

    // Добавляем пассивный доход
    gameState.passiveIncome.push({
        fitId: fitId,
        income: fit.effects.income,
        lastCollection: Date.now()
    });

    showMessage(`Фит с ${fit.name} записан! ${isFree ? '(Бесплатно)' : ''}`);
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

// Фон и слои
function updateBackgroundLayers() {
    updateMoneyLayer();
    updateLevelDetailLayer();
}

function updateMoneyLayer() {
    const moneyLayer = document.getElementById('moneyLayer');
    if (!moneyLayer) return;

    let moneyImage = 'money1.png';
    const money = gameState.money;

    if (money >= 1000000) moneyImage = 'money4.png';
    else if (money >= 100000) moneyImage = 'money3.png';
    else if (money >= 10000) moneyImage = 'money2.png';
    else moneyImage = 'money1.png';

    moneyLayer.style.backgroundImage = `url('images/money/${moneyImage}')`;
}

function updateLevelDetailLayer() {
    const detailLayer = document.getElementById('levelDetailLayer');
    if (!detailLayer) return;

    const levelImage = `level${gameState.level}.png`;
    detailLayer.style.backgroundImage = `url('images/level_details/${levelImage}')`;
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

    // Статистика
    document.getElementById('statsLevel').textContent = currentLevel.name;
    document.getElementById('totalTracks').textContent = gameState.totalTracks;
    document.getElementById('fitsCount').textContent = gameState.purchasedFits.length;

    const totalBoosts = Object.values(gameState.boosts).reduce((sum, arr) => sum + arr.length, 0);
    document.getElementById('boostsCount').textContent = totalBoosts;

    const totalPassiveIncome = gameState.passiveIncome.reduce((sum, income) => sum + income.income, 0);
    document.getElementById('passiveIncome').textContent = totalPassiveIncome.toLocaleString() + ' ₽/час';

    updateBackgroundLayers();
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

        // Разблокируем фиты для всех достигнутых уровней
        for (let level = 1; level <= gameState.level; level++) {
            unlockFitsForLevel(level);
        }
    }
}

// Запуск игры
document.addEventListener('DOMContentLoaded', initGame);
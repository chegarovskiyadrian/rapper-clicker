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
    unlockedFits: [],
    availableMainFits: [] // 3 главных фита для выбора на текущем уровне
};

// Уровни игры
const levels = [
    { name: "ШКОЛЬНИК", minFame: 0, maxFame: 5000, moneyReward: 500 },
    { name: "САУНДКЛАУД", minFame: 5000, maxFame: 25000, moneyReward: 2000 },
    { name: "ТИКТОК", minFame: 25000, maxFame: 100000, moneyReward: 8000 },
    { name: "МАССОВЫЙ", minFame: 100000, maxFame: 500000, moneyReward: 25000 },
    { name: "ЛЕГЕНДА", minFame: 500000, maxFame: 2000000, moneyReward: 80000 }
];

// Полная система бустов
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
        { id: "ricky", name: "Рики с вб", price: 7000, effect: "2.0x трушность", credMultiplier: 2.0 },
        { id: "adidas", name: "Спорткостюм адидас", price: 22000, effect: "3.0x трушность", credMultiplier: 3.0 },
        { id: "phresh", name: "Авито phreshboyswag", price: 70000, effect: "5.0x трушность", credMultiplier: 5.0 },
        { id: "china", name: "Одежда с китая", price: 180000, effect: "8.0x трушность", credMultiplier: 8.0 },
        { id: "normal", name: "Нормальная одежда", price: 450000, effect: "12.0x трушность", credMultiplier: 12.0 },
        { id: "dlt", name: "Одежда с ДЛТ", price: 1000000, effect: "20.0x трушность", credMultiplier: 20.0 },
        { id: "icon", name: "Икона стиля", price: 2500000, effect: "35.0x трушность", credMultiplier: 35.0 }
    ]
};

// ПОЛНАЯ СИСТЕМА ФИТОВ - 48 реперов
const fits = {
    1: [
        // Главные фиты уровня 1
        { id: "vasya", name: "Вася одноклассник", image: "1/h_васяодноклассник.jpg", 
          fame: 1, streetCredEffect: 2, income: 2, priceLevel: 0, requirements: { streetCred: 0 } },
        { id: "carrystaff", name: "CarryStaff", image: "1/h_carrystaff.jpg",
          fame: 5, streetCredEffect: 5, income: 5, priceLevel: 2, requirements: { streetCred: 20 } },
        { id: "kostyapetux", name: "kostyapetux123", image: "1/h_kostyapetux123.jpg",
          fame: 3, streetCredEffect: 3, income: 1, priceLevel: 2, requirements: { streetCred: 0 } },
        
        // Остальные фиты уровня 1
        { id: "telegramguy", name: "Тип из телеграма", image: "1/типизтелеграма.jpg",
          fame: 3, streetCredEffect: 3, income: 1, priceLevel: 0, requirements: { streetCred: 20 } },
        { id: "plag", name: "Плаг", image: "1/плаг.jpg",
          fame: 5, streetCredEffect: 5, income: 5, priceLevel: 3, requirements: { streetCred: 50 } },
        { id: "brother", name: "Младший брат", image: "1/младшийбрат.jpg",
          fame: 5, streetCredEffect: 3, income: 2, priceLevel: 4, requirements: { streetCred: 10 } },
        { id: "mom", name: "Мама", image: "1/мама.jpg",
          fame: 5, streetCredEffect: 5, income: 5, priceLevel: 3, requirements: { streetCred: 0 } },
        { id: "neonova", name: "Неонова", image: "1/неонова.jpg",
          fame: 1, streetCredEffect: 1, income: 4, priceLevel: 5, requirements: { streetCred: 30 } }
    ],
    
    2: [
        // Главные фиты уровня 2
        { id: "davidblunt", name: "David Blunt", image: "2/h_davidblunt.jpg",
          fame: 3, streetCredEffect: 4, income: 4, priceLevel: 4, requirements: { streetCred: 50 } },
        { id: "maxonmadrid", name: "МаксонМадрид", image: "2/h_максонмадрид.jpg",
          fame: 4, streetCredEffect: 3, income: 2, priceLevel: 2, requirements: { streetCred: 20 } },
        { id: "roadring", name: "Roadring", image: "2/h_roadring.jpg",
          fame: 2, streetCredEffect: 5, income: 4, priceLevel: 3, requirements: { streetCred: 70 } },
        
        // Остальные фиты уровня 2
        { id: "lazerdim", name: "LAZER DIM700", image: "2/lazerdim700.jpg",
          fame: 2, streetCredEffect: 4, income: 1, priceLevel: 2, requirements: { streetCred: 60 } },
        { id: "randomguy", name: "Какой-то хуй", image: "2/какой-тохуй.jpg",
          fame: 1, streetCredEffect: 1, income: 1, priceLevel: 1, requirements: { streetCred: 0 } },
        { id: "eightpts", name: "800pts", image: "2/800pts.jpg",
          fame: 1, streetCredEffect: 4, income: 3, priceLevel: 3, requirements: { streetCred: 40 } },
        { id: "redda", name: "Redda", image: "2/redda.jpg",
          fame: 2, streetCredEffect: 3, income: 3, priceLevel: 3, requirements: { streetCred: 30 } },
        { id: "feduk", name: "FEDUK", image: "2/feduk.jpg",
          fame: 5, streetCredEffect: 2, income: 5, priceLevel: 5, requirements: { streetCred: 50 } }
    ],
    
    3: [
        // Главные фиты уровня 3
        { id: "darkprince", name: "Темный Принц", image: "3/h_темныйпринц.jpg",
          fame: 5, streetCredEffect: 3, income: 4, priceLevel: 4, requirements: { streetCred: 30 } },
        { id: "tuborosho", name: "tuborosho", image: "3/h_tuborosho.jpg",
          fame: 3, streetCredEffect: 2, income: 2, priceLevel: 3, requirements: { streetCred: 60 } },
        { id: "babymelo", name: "Baby Melo", image: "3/h_babymelo.jpg",
          fame: 5, streetCredEffect: 1, income: 5, priceLevel: 5, requirements: { streetCred: 0 } },
        
        // Остальные фиты уровня 3
        { id: "osamason", name: "osamason", image: "3/osamason.jpg",
          fame: 1, streetCredEffect: 3, income: 2, priceLevel: 2, requirements: { streetCred: 20 } },
        { id: "xxxtentacion", name: "XXXTENTACION", image: "3/xxxtentacion.jpg",
          fame: 3, streetCredEffect: 4, income: 1, priceLevel: 1, requirements: { streetCred: 10 } },
        { id: "maybe", name: "Мейби Бейби", image: "3/мейбибейби.jpg",
          fame: 5, streetCredEffect: 5, income: 5, priceLevel: 5, requirements: { streetCred: 90 } },
        { id: "flight", name: "Flight", image: "3/flight.jpg",
          fame: 1, streetCredEffect: 1, income: 1, priceLevel: 0, requirements: { streetCred: 0 } },
        { id: "phreshboyswag", name: "phreshboyswag", image: "3/phreshboyswag.jpg",
          fame: 3, streetCredEffect: 4, income: 5, priceLevel: 3, requirements: { streetCred: 20 } },
        { id: "code10", name: "code10", image: "3/code10.jpg",
          fame: 4, streetCredEffect: 4, income: 4, priceLevel: 2, requirements: { streetCred: 40 } },
        { id: "scally", name: "Scally Milano", image: "3/scallymilano.jpg",
          fame: 5, streetCredEffect: 1, income: 5, priceLevel: 4, requirements: { streetCred: 30 } },
        { id: "sematary", name: "Sematary", image: "3/sematary.jpg",
          fame: 2, streetCredEffect: 4, income: 3, priceLevel: 2, requirements: { streetCred: 60 } }
    ],
    
    4: [
        // Главные фиты уровня 4
        { id: "lildrughill", name: "LILDRUGHILL", image: "4/h_lildrughill.jpg",
          fame: 4, streetCredEffect: 4, income: 5, priceLevel: 4, requirements: { streetCred: 70 } },
        { id: "ogbuda", name: "OG Buda", image: "4/h_ogbuda.jpg",
          fame: 5, streetCredEffect: 2, income: 5, priceLevel: 5, requirements: { streetCred: 10 } },
        { id: "aarne", name: "Aarne", image: "4/h_aarne.jpg",
          fame: 1, streetCredEffect: 1, income: 1, priceLevel: 5, requirements: { streetCred: 0 } },
        
        // Остальные фиты уровня 4
        { id: "friendlythug", name: "FRIENDLY THUG 52 NGG", image: "4/friendlythug52ngg.jpg",
          fame: 4, streetCredEffect: 3, income: 4, priceLevel: 4, requirements: { streetCred: 60 } },
        { id: "thrillpill", name: "THRILL PILL", image: "4/thrillpill.jpg",
          fame: 2, streetCredEffect: 5, income: 3, priceLevel: 3, requirements: { streetCred: 70 } },
        { id: "kizaru", name: "kizaru", image: "4/kizaru.jpg",
          fame: 4, streetCredEffect: 2, income: 5, priceLevel: 0, requirements: { streetCred: 100 } },
        { id: "kencarson", name: "Ken Carson", image: "4/kencarson.jpg",
          fame: 3, streetCredEffect: 4, income: 2, priceLevel: 4, requirements: { streetCred: 40 } },
        { id: "ninemice", name: "9mice", image: "4/9mice.jpg",
          fame: 5, streetCredEffect: 3, income: 5, priceLevel: 5, requirements: { streetCred: 70 } },
        { id: "kaiangel", name: "Kai Angel", image: "4/kaiangel.jpg",
          fame: 4, streetCredEffect: 5, income: 4, priceLevel: 4, requirements: { streetCred: 80 } },
        { id: "platina", name: "Платина", image: "4/платина.jpg",
          fame: 2, streetCredEffect: 4, income: 4, priceLevel: 3, requirements: { streetCred: 40 } },
        { id: "toxis", name: "Toxis", image: "4/toxis.jpg",
          fame: 5, streetCredEffect: 1, income: 5, priceLevel: 5, requirements: { streetCred: 20 } },
        { id: "fendiglock", name: "FENDIGLOCK", image: "4/fendiglock.jpg",
          fame: 2, streetCredEffect: 3, income: 2, priceLevel: 2, requirements: { streetCred: 30 } },
        { id: "obladaet", name: "OBLADAET", image: "4/obladaet.jpg",
          fame: 4, streetCredEffect: 1, income: 3, priceLevel: 3, requirements: { streetCred: 50 } },
        { id: "icegergert", name: "ICEGERGERT", image: "4/icegergert.jpg",
          fame: 5, streetCredEffect: 1, income: 5, priceLevel: 5, requirements: { streetCred: 60 } }
    ],
    
    5: [
        // Главные фиты уровня 5
        { id: "morgenshtern", name: "MORGENSHTERN", image: "5/h_morgenshtern.jpg",
          fame: 5, streetCredEffect: 5, income: 5, priceLevel: 5, requirements: { streetCred: 70 } },
        { id: "arut", name: "Arut", image: "5/h_arut.jpg",
          fame: 2, streetCredEffect: 1, income: 1, priceLevel: 4, requirements: { streetCred: 10 } },
        { id: "litvin", name: "ЛИТВИН", image: "5/h_литвин.jpg",
          fame: 4, streetCredEffect: 2, income: 3, priceLevel: 4, requirements: { streetCred: 30 } },
        
        // Остальные фиты уровня 5
        { id: "kirkorov", name: "Филипп Киркоров", image: "5/филиппкиркоров.jpg",
          fame: 2, streetCredEffect: 1, income: 4, priceLevel: 5, requirements: { streetCred: 30 } },
        { id: "yungtrappa", name: "Yung Trappa", image: "5/yungtrappa.jpg",
          fame: 3, streetCredEffect: 4, income: 2, priceLevel: 4, requirements: { streetCred: 80 } },
        { id: "yeat", name: "Yeat", image: "5/yeat.jpg",
          fame: 5, streetCredEffect: 3, income: 5, priceLevel: 2, requirements: { streetCred: 50 } },
        { id: "playboicarti", name: "Playboi Carti", image: "5/playboicarti.jpg",
          fame: 4, streetCredEffect: 4, income: 4, priceLevel: 4, requirements: { streetCred: 70 } },
        { id: "kanyewest", name: "Kanye West", image: "5/kanyewest.jpg",
          fame: 3, streetCredEffect: 5, income: 5, priceLevel: 5, requirements: { streetCred: 90 } }
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
    selectMainFitsForLevel();
}

function initTelegram() {
    if (tg) {
        tg.expand();
        tg.enableClosingConfirmation();
    }
}

// Обработчики событий
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
        selectMainFitsForLevel();
        
        showMessage('НОВЫЙ УРОВЕНЬ: ' + newLevel.name);
        updateDisplay();
        renderFits();
        saveGameState();
    }
}

// ВЫБОР 3 ГЛАВНЫХ ФИТОВ ДЛЯ УРОВНЯ
function selectMainFitsForLevel() {
    const levelFits = fits[gameState.level] || [];
    const mainFits = levelFits.filter(fit => fit.image.includes('/h_'));
    
    // Выбираем случайные 3 главных фита
    const shuffled = [...mainFits].sort(() => 0.5 - Math.random());
    gameState.availableMainFits = shuffled.slice(0, 3);
    
    // Добавляем их в unlockedFits
    gameState.availableMainFits.forEach(fit => {
        if (!gameState.unlockedFits.includes(fit.id)) {
            gameState.unlockedFits.push(fit.id);
        }
    });
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
    
    // Показываем все доступные бусты
    Object.keys(boosts).forEach(category => {
        boosts[category].forEach(boost => {
            if (!gameState.boosts[category].includes(boost.id)) {
                const boostElement = createBoostElement({...boost, category});
                container.appendChild(boostElement);
            }
        });
    });
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
    
    // Определяем лучшее оборудование
    const equipmentOrder = ['studio3', 'studio2', 'studio1', 'advanced_gear', 'medium_gear', 'basic_gear', 'pro_mic', 'usb_mic'];
    for (let equip of equipmentOrder) {
        if (equipmentBoosts.includes(equip)) {
            currentImage = `${equip}.png`;
            break;
        }
    }
    
    equipmentElement.style.backgroundImage = `url('images/equipment/${currentImage}')`;
}

// СИСТЕМА ФИТОВ
function renderFits() {
    const container = document.getElementById('fitsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Показываем главные фиты для выбора
    if (gameState.availableMainFits.length > 0) {
        const mainFitsSection = document.createElement('div');
        mainFitsSection.innerHTML = '<div style="text-align: center; margin-bottom: 15px; color: #00d4ff; font-weight: bold;">ВЫБЕРИ ФИТ:</div>';
        
        gameState.availableMainFits.forEach(fit => {
            if (!gameState.purchasedFits.includes(fit.id)) {
                const fitElement = createFitElement(fit, true);
                mainFitsSection.appendChild(fitElement);
            }
        });
        
        container.appendChild(mainFitsSection);
    }
    
    // Показываем остальные доступные фиты
    const otherFits = [];
    for (let level = 1; level <= gameState.level; level++) {
        const levelFits = fits[level] || [];
        levelFits.forEach(fit => {
            if (gameState.unlockedFits.includes(fit.id) && 
                !gameState.purchasedFits.includes(fit.id) &&
                !gameState.availableMainFits.includes(fit)) {
                otherFits.push(fit);
            }
        });
    }
    
    if (otherFits.length > 0) {
        const otherSection = document.createElement('div');
        otherSection.innerHTML = '<div style="text-align: center; margin: 20px 0 15px 0; color: #00d4ff; font-weight: bold;">ДРУГИЕ ФИТЫ:</div>';
        
        otherFits.forEach(fit => {
            const fitElement = createFitElement(fit, false);
            otherSection.appendChild(fitElement);
        });
        
        container.appendChild(otherSection);
    }
}

function createFitElement(fit, isMain) {
    const isPurchased = gameState.purchasedFits.includes(fit.id);
    const hasEnoughCred = gameState.streetCred >= fit.requirements.streetCred;
    
    // Расчет цен и эффектов
    const priceMap = {0: 0, 1: 1000, 2: 2000, 3: 4000, 4: 8000, 5: 16000};
    const fameMap = {1: 1000, 2: 2000, 3: 4000, 4: 8000, 5: 16000};
    const incomeMap = {
        1: {1: 200, 2: 400, 3: 800, 4: 1600, 5: 3200},
        2: {1: 500, 2: 1000, 3: 2000, 4: 4000, 5: 8000},
        3: {1: 1000, 2: 2000, 3: 4000, 4: 8000, 5: 16000},
        4: {1: 2000, 2: 4000, 3: 8000, 4: 16000, 5: 32000},
        5: {1: 4000, 2: 8000, 3: 16000, 4: 32000, 5: 64000}
    };
    
    const actualPrice = hasEnoughCred ? 0 : priceMap[fit.priceLevel];
    const fameReward = fameMap[fit.fame];
    const incomePerHour = incomeMap[gameState.level][fit.income];
    const streetCredChange = (fit.streetCredEffect - 3) * 15;
    
    const canAfford = gameState.money >= actualPrice;
    
    const div = document.createElement('div');
    div.className = `fit-item ${isPurchased ? 'purchased' : ''} ${!canAfford && !isPurchased ? 'cant-afford' : ''} ${isMain ? 'main-fit' : ''}`;
    
    if (isMain) {
        div.style.border = '2px solid gold';
        div.style.background = 'rgba(255,215,0,0.1)';
    }
    
    let requirementsText = isPurchased ? 
        `Доход: ${incomePerHour}₽/час` :
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
        button.addEventListener('click', () => buyFit(fit.id, hasEnoughCred, actualPrice, fameReward, incomePerHour, streetCredChange));
        button.addEventListener('touchstart', () => buyFit(fit.id, hasEnoughCred, actualPrice, fameReward, incomePerHour, streetCredChange), { passive: true });
    }
    
    return div;
}

function buyFit(fitId, isFree, price, fameReward, incomePerHour, streetCredChange) {
    if (!isFree && gameState.money < price) {
        showMessage("Недостаточно денег!");
        return;
    }
    
    if (!isFree) {
        gameState.money -= price;
    }
    
    gameState.purchasedFits.push(fitId);
    gameState.fame += fameReward;
    gameState.streetCred = Math.max(0, Math.min(100, gameState.streetCred + streetCredChange));
    
    // Убираем из доступных главных фитов
    gameState.availableMainFits = gameState.availableMainFits.filter(fit => fit.id !== fitId);
    
    gameState.passiveIncome.push({
        fitId: fitId,
        income: incomePerHour,
        lastCollection: Date.now()
    });
    
    showMessage("Фит с " + Object.values(fits).flat().find(f => f.id === fitId).name + " записан!" + (isFree ? ' (Бесплатно)' : ''));
    updateDisplay();
    renderFits();
    saveGameState();
}

// Пассивный доход
function startPassiveIncome() {
    setInterval(collectPassiveIncome, 60000); // Каждую минуту проверяем
}

function collectPassiveIncome() {
    const now = Date.now();
    let totalIncome = 0;
    
    gameState.passiveIncome.forEach(income => {
        const hoursPassed = (now - income.lastCollection) / (1000 * 60 * 60);
        if (hoursPassed >= 1) {
            const incomeAmount = Math.floor(hoursPassed) * income.income;
            totalIncome += incomeAmount;
            income.lastCollection = now - (hoursPassed - Math.floor(hoursPassed)) * (1000 * 60 * 60); // Сохраняем остаток
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
        
        // Если нет доступных главных фитов, выбираем их
        if (gameState.availableMainFits.length === 0) {
            selectMainFitsForLevel();
        }
    }
}

// Запуск игры
document.addEventListener('DOMContentLoaded', initGame);

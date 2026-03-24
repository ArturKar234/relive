// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
let isGameComplete = false;

// ===== ТВОЯ ИГРА: ПЕРЕМЕННЫЕ =====
let myProgress = 20; // Стартовый прогресс (20%)

function feedScoby() {
  if (myProgress >= 100 || isGameComplete) return;
  
  myProgress += 10;
  if (myProgress > 100) myProgress = 100;
  
  // 1. Обновляем жидкость (максимум 80% визуально!)
  const liquid = document.getElementById('liquid');
  if (liquid) {
    // Пересчитываем: 100% прогресса = 80% высоты жидкости
    const liquidHeight = (myProgress / 100) * 80; // от 0 до 80
    liquid.style.height = liquidHeight + '%';
  }
  
  // 2. Обновляем грибок (масштаб от 0.5 до 1.5)
  const scobyImg = document.getElementById('scoby');
  if (scobyImg) {
    let scaleValue = 0.5 + (myProgress / 100);
    scobyImg.style.transform = `translate(-50%, -50%) scale(${scaleValue})`;
  }
  
  // 3. Синхронизируем с UI (показываем реальный прогресс 0-100%)
  syncWithFriendUI();
  
  // 4. Создаём пузырьки
  createMyBubbles(5);
  
  // 5. Анимация +10%
  playFeedbackAnimation();
  
  // 6. Проверяем победу
  if (myProgress >= 100) {
    completeMyGame();
  }
}

function createMyBubbles(count) {
  const liquid = document.getElementById('liquid');
  if (!liquid) return;
  
  for (let i = 0; i < count; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    const size = Math.random() * 5 + 3 + 'px';
    bubble.style.width = size;
    bubble.style.height = size;
    bubble.style.left = Math.random() * 90 + 5 + '%';
    bubble.style.animationDuration = Math.random() * 3 + 2 + 's';
    
    liquid.appendChild(bubble);
    
    setTimeout(() => bubble.remove(), 5000);
  }
}

function syncWithFriendUI() {
  // Обновляем прогресс-бар
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  
  if (progressFill) {
    progressFill.style.width = myProgress + '%';
  }
  
  if (progressText) {
    progressText.textContent = myProgress + '%';
    progressText.style.color = myProgress >= 50 ? 'var(--color-white)' : 'var(--color-dark)';
  }
  
  // Обновляем точки ферментации
  const level = Math.floor(myProgress / 20);
  const levelDots = [
    document.querySelector('.level-dot'),
    document.getElementById('level2'),
    document.getElementById('level3'),
    document.getElementById('level4'),
    document.getElementById('level5')
  ];
  
  levelDots.forEach((dot, index) => {
    if (dot && index <= level) {
      dot.classList.add('active');
    }
  });
}

function completeMyGame() {
  isGameComplete = true;
  
  // Показываем кнопку "Выбрать комбучу"
  const successBtn = document.getElementById('successBtn');
  if (successBtn) {
    successBtn.classList.remove('hidden');
  }
  
  // Уведомление и конфетти
  playNotification('🎉 Поздравляем! Вы вырастили SCOBY!', 'success');
  createConfetti();
}

function initMyGame() {
  // Устанавливаем начальное состояние
  syncWithFriendUI();
  
  const liquid = document.getElementById('liquid');
  if (liquid) {
    // Начальная высота: 20% прогресса = 16% высоты жидкости
    const liquidHeight = (myProgress / 100) * 80;
    liquid.style.height = liquidHeight + '%';
  }
  
  // Автоматические пузырьки каждые 500мс
  setInterval(() => {
    if (myProgress > 0 && myProgress < 100) {
      createMyBubbles(1);
    }
  }, 500);
}

// ===== НАВИГАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
});

// ===== КОРЗИНА И ТОВАРЫ =====
document.querySelectorAll('.details-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    const details = card.querySelector('.product-details');
    if (details) {
      details.style.display = details.style.display === 'block' ? 'none' : 'block';
    }
  });
});

let cartTotal = 0;
const cartList = document.getElementById('cart');
const cartTotalSpan = document.getElementById('total');

document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = e.target.closest('.product-card');
    const name = card.querySelector('h3').textContent;
    const priceText = card.querySelector('.price').textContent.replace(/\D/g, '');
    const price = parseInt(priceText) || 0;

    if (cartList && cartTotalSpan) {
      const li = document.createElement('li');
      li.textContent = `${name} - ${price} ₽`;
      cartList.appendChild(li);

      cartTotal += price;
      cartTotalSpan.textContent = cartTotal;

      playNotification(`✅ ${name} добавлен в корзину!`, 'success');
    }
  });
});

// ===== ПЛАВНАЯ ПРОКРУТКА =====
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const offsetTop = section.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.length > 1) {
      e.preventDefault();
      const targetId = href.substring(1);
      scrollToSection(targetId);
    }
  });
});

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== ФИЛЬТР ПРОДУКЦИИ =====
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    productCards.forEach(card => {
      const category = card.dataset.category;

      if (filter === 'all' || category === filter) {
        card.style.display = 'block';
        card.style.animation = 'fadeInUp 0.5s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ===== АНИМАЦИЯ +10% =====
function playFeedbackAnimation() {
  const feedback = document.createElement('div');
  feedback.textContent = '+10%';
  feedback.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 3rem;
    font-weight: 900;
    color: #4F7942;
    pointer-events: none;
    z-index: 10000;
    opacity: 1;
    animation: feedbackPop 0.8s ease forwards;
  `;
  document.body.appendChild(feedback);

  setTimeout(() => feedback.remove(), 800);
}

const feedbackStyles = document.createElement('style');
feedbackStyles.textContent = `
  @keyframes feedbackPop {
    0% { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
    50% { opacity: 1; transform: translate(-50%, -80%) scale(1.2); }
    100% { opacity: 0; transform: translate(-50%, -120%) scale(0.8); }
  }
`;
document.head.appendChild(feedbackStyles);

// ===== КОНФЕТТИ =====
function createConfetti() {
  const colors = ['#4F7942', '#FF7F50', '#D4A574', '#9CAF88', '#FF6B6B', '#8B5CF6'];
  const confettiCount = 100;

  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -20px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        pointer-events: none;
        z-index: 10000;
      `;

      document.body.appendChild(confetti);

      const fallDuration = Math.random() * 3 + 2;
      const rotation = Math.random() * 720 - 360;
      const drift = Math.random() * 200 - 100;

      confetti.animate([
        { transform: 'translateY(0) rotate(0deg) translateX(0)', opacity: 1 },
        { transform: `translateY(100vh) rotate(${rotation}deg) translateX(${drift}px)`, opacity: 0 }
      ], {
        duration: fallDuration * 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      });

      setTimeout(() => confetti.remove(), fallDuration * 1000);
    }, i * 30);
  }
}

// ===== МАСКОТ SCOBY =====
const mascot = document.getElementById('mascot');
const mascotSpeech = document.getElementById('mascotSpeech');
const mascotBody = document.getElementById('mascotBody');

let mascotPhraseIndex = 0;
let lastInteractionTime = Date.now();
let sleepyTimeout = null;

const MASCOT_PHRASES = [
  "Привет! Я SCOBY! 🍄",
  "Попробуй комбучу ReLive! 🥤",
  "Я живой организм! ✨",
  "Буль-буль-буль! 💧",
  "Давай дружить! 🤝",
  "ReLive — это вкусно! 😋",
  "Ферментация — это магия! 🎩",
  "Пробиотики для тебя! 🦠",
  "Сделано в Екатеринбурге! 🏔️",
  "Живой чай! 🍵",
  "Без консервантов! 🌿",
  "100% натурально! 💚",
  "Кликни на меня! 👆",
  "Листай вниз! ⬇️",
  "Хочешь секрет? 🤫"
];

const SECTION_PHRASES = {
  'hero': ["Добро пожаловать! 🎉", "Выбери свой вкус! 🥤"],
  'products': ["Столько вкусов! 🤤", "Попробуй BRUT! 🍾", "Мой любимый — Лаванда! 💜"],
  'about-kombucha': ["Это я создаю комбучу! 🍄", "Пробиотики — сила! 💪"],
  'game': ["Покорми меня! 🍵", "Расти, SCOBY, расти! 🌱"],
  'partners': ["Наши друзья! 🤝", "Крутые партнёры! ⭐"],
  'our-story': ["История с 2016! 📖", "Иван — наш создатель! 👨‍🔬"],
  'contacts': ["Напиши нам! ✉️", "Мы на связи! 📱"]
};

const PARTICLES = ["💚", "🍵", "✨", "🌿", "💧", "🍄", "⭐", "💜"];

if (mascot) {
  function changeMascotPhrase(customPhrase = null) {
    if (!mascotSpeech) return;

    const phrase = customPhrase || MASCOT_PHRASES[mascotPhraseIndex];

    mascotSpeech.style.transform = 'translateX(-50%) scale(0.8)';
    mascotSpeech.style.opacity = '0';

    setTimeout(() => {
      mascotSpeech.textContent = phrase;
      mascotSpeech.style.transform = 'translateX(-50%) scale(1)';
      mascotSpeech.style.opacity = '1';
    }, 150);

    if (!customPhrase) {
      mascotPhraseIndex = (mascotPhraseIndex + 1) % MASCOT_PHRASES.length;
    }
  }

  function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'mascot-particle';
    particle.textContent = PARTICLES[Math.floor(Math.random() * PARTICLES.length)];
    particle.style.left = (Math.random() * 60 + 20) + 'px';
    particle.style.top = (Math.random() * 30 + 10) + 'px';
    mascot.appendChild(particle);

    setTimeout(() => particle.remove(), 1000);
  }

  function createRipple() {
    const ripple = document.createElement('div');
    ripple.className = 'mascot-ripple';
    mascotBody.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  function makeHappy() {
    mascot.classList.remove('sleepy');
    mascot.classList.add('happy');
    setTimeout(() => mascot.classList.remove('happy'), 500);
  }

  function checkSleepy() {
    const timeSinceInteraction = Date.now() - lastInteractionTime;

    if (timeSinceInteraction > 30000) {
      mascot.classList.add('sleepy');
      changeMascotPhrase("Zzz... 😴");
    }
  }

  function resetActivity() {
    lastInteractionTime = Date.now();
    mascot.classList.remove('sleepy');

    clearTimeout(sleepyTimeout);
    sleepyTimeout = setTimeout(checkSleepy, 30000);
  }

  let isDragging = false;
  let hasMoved = false;

  mascot.addEventListener('click', (e) => {
    if (!isDragging && !hasMoved) {
      changeMascotPhrase();
      makeHappy();
      createRipple();

      const particleCount = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < particleCount; i++) {
        setTimeout(() => createParticle(), i * 100);
      }

      resetActivity();
    }
  });

  setInterval(() => {
    if (!mascot.classList.contains('sleepy')) {
      changeMascotPhrase();
    }
  }, 8000);

  sleepyTimeout = setTimeout(checkSleepy, 30000);

  document.addEventListener('scroll', resetActivity);
  document.addEventListener('mousemove', resetActivity);
  document.addEventListener('click', resetActivity);

  const observerOptions = { threshold: 0.5 };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        const phrases = SECTION_PHRASES[sectionId];

        if (phrases && !mascot.classList.contains('sleepy')) {
          const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
          changeMascotPhrase(randomPhrase);
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
  });

  // === ПЕРЕТАСКИВАНИЕ ===
  let startX, startY, initialX, initialY;

  mascot.addEventListener('mousedown', startDrag);
  mascot.addEventListener('touchstart', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);

  function startDrag(e) {
    isDragging = true;
    hasMoved = false;

    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    startX = clientX;
    startY = clientY;
    initialX = mascot.offsetLeft;
    initialY = mascot.offsetTop;

    mascot.style.transition = 'none';
    resetActivity();
  }

  function drag(e) {
    if (!isDragging) return;
    e.preventDefault();

    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      hasMoved = true;
    }

    let newX = initialX + deltaX;
    let newY = initialY + deltaY;

    newX = Math.max(0, Math.min(window.innerWidth - 100, newX));
    newY = Math.max(0, Math.min(window.innerHeight - 100, newY));

    mascot.style.left = newX + 'px';
    mascot.style.top = newY + 'px';
    mascot.style.bottom = 'auto';
    mascot.style.right = 'auto';
  }

  function stopDrag() {
    if (isDragging) {
      isDragging = false;
      mascot.style.transition = '';

      if (hasMoved) {
        changeMascotPhrase("Ух, прокатился! 🎢");
        setTimeout(() => { hasMoved = false; }, 100);
      }
    }
  }

  // === ТРОЙНОЙ КЛИК ===
  let clickCount = 0;
  let clickTimer = null;

  mascot.addEventListener('click', () => {
    clickCount++;

    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      if (clickCount >= 3) {
        changeMascotPhrase("Танцуем! 💃🕺");
        mascotBody.style.animation = 'none';

        let rotation = 0;
        const dance = setInterval(() => {
          rotation += 45;
          mascotBody.style.transform = `rotate(${rotation}deg) scale(1.1)`;

          if (rotation >= 720) {
            clearInterval(dance);
            mascotBody.style.transform = '';
            mascotBody.style.animation = 'mascotBounce 3s ease-in-out infinite';
            changeMascotPhrase("Это было весело! 🎉");
          }
        }, 100);

        for (let i = 0; i < 10; i++) {
          setTimeout(() => createParticle(), i * 50);
        }
      }
      clickCount = 0;
    }, 400);
  });

  console.log('🍄 Маскот SCOBY загружен и готов к работе!');
}

// ===== ФОРМА КОНТАКТОВ =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    if (!data.name || !data.phone || !data.email || !data.subject || !data.message) {
      playNotification('⚠️ Пожалуйста, заполните все обязательные поля', 'error');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Отправка...';
    submitBtn.disabled = true;

    setTimeout(() => {
      playNotification('✉️ Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
      contactForm.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });
}

// ===== УВЕДОМЛЕНИЯ =====
function playNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  const bgColor = type === 'success' ? '#4F7942' : type === 'error' ? '#FF6B6B' : '#FF7F50';

  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    max-width: 400px;
    padding: 1rem 1.5rem;
    background: ${bgColor};
    color: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    z-index: 10001;
    font-weight: 700;
    font-size: 0.95rem;
    line-height: 1.5;
    animation: slideInRight 0.5s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.5s ease';
    setTimeout(() => notification.remove(), 500);
  }, 4000);
}

const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(notificationStyles);

// ===== МОДАЛЬНОЕ ОКНО =====
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');

function openModal(type) {
  let content = '';

  if (type === 'wholesale') {
    content = `
      <h2 style="margin-bottom: 1.5rem; color: var(--color-dark);">Заявка на оптовые закупки</h2>
      <form id="wholesaleForm" style="display: flex; flex-direction: column; gap: 1rem;">
        <div class="form-group"><input type="text" name="company" placeholder="Название компании *" required></div>
        <div class="form-group"><input type="text" name="contact" placeholder="Контактное лицо *" required></div>
        <div class="form-group"><input type="tel" name="phone" placeholder="Телефон *" required></div>
        <div class="form-group"><input type="email" name="email" placeholder="Email *" required></div>
        <div class="form-group">
          <select name="type" required>
            <option value="">Тип заведения *</option>
            <option value="cafe">Кафе/Ресторан</option>
            <option value="gym">Фитнес-клуб</option>
            <option value="shop">Магазин</option>
            <option value="other">Другое</option>
          </select>
        </div>
        <div class="form-group"><textarea name="message" placeholder="Дополнительная информация" rows="4"></textarea></div>
        <button type="submit" class="btn btn-primary btn-lg btn-full">Отправить заявку <span class="btn-arrow">→</span></button>
      </form>
    `;
  } else if (type === 'privacy') {
    content = `
      <h2 style="margin-bottom: 1.5rem; color: var(--color-dark);">Политика конфиденциальности</h2>
      <div style="max-height: 60vh; overflow-y: auto; line-height: 1.8; color: rgba(44, 62, 47, 0.8);">
        <p><strong>ООО "Вкус от природы"</strong> (ИНН 6671456280) обязуется обеспечивать защиту персональных данных пользователей сайта relivekombucha.ru</p>
        <br>
        <p><strong>1. Сбор информации</strong></p>
        <p>Мы собираем информацию, которую вы предоставляете при заполнении форм на сайте: имя, телефон, email.</p>
        <br>
        <p><strong>2. Использование информации</strong></p>
        <p>Информация используется для связи с вами, обработки заказов и улучшения качества обслуживания.</p>
        <br>
        <p><strong>3. Защита информации</strong></p>
        <p>Мы применяем соответствующие меры безопасности для защиты ваших персональных данных.</p>
        <br>
        <p><strong>Контакты:</strong> kombucha@livebrewtea.ru</p>
      </div>
    `;
  } else if (type === 'terms') {
    content = `
      <h2 style="margin-bottom: 1.5rem; color: var(--color-dark);">Политика обработки данных</h2>
      <div style="max-height: 60vh; overflow-y: auto; line-height: 1.8; color: rgba(44, 62, 47, 0.8);">
        <p>Настоящая политика определяет порядок обработки персональных данных ООО "Вкус от природы".</p>
        <br>
        <p><strong>Оператор:</strong> ООО "Вкус от природы"</p>
        <p><strong>ИНН:</strong> 6671456280</p>
        <p><strong>Адрес:</strong> г. Екатеринбург, ул. 8 марта д. 207, кор. 2</p>
        <br>
        <p>Отправляя данные через формы на сайте, вы даёте согласие на их обработку в соответствии с ФЗ-152 "О персональных данных".</p>
      </div>
    `;
  }

  if (modalBody && modal) {
    modalBody.innerHTML = content;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const wholesaleForm = document.getElementById('wholesaleForm');
    if (wholesaleForm) {
      wholesaleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        closeModal();
        playNotification('✅ Заявка отправлена! Мы свяжемся с вами в течение 24 часов.', 'success');
      });
    }
  }
}

function closeModal() {
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.querySelector('.modal-overlay')?.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && modal.classList.contains('active')) closeModal();
});

// ===== ПРОСТОЙ AOS =====
const AOS = {
  elements: [],
  init() {
    this.elements = document.querySelectorAll('[data-aos]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.aosDelay) || 0;
          setTimeout(() => {
            entry.target.classList.add('aos-animate');
          }, delay);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    this.elements.forEach(el => observer.observe(el));
  }
};

// ===== КАРТА ЯНДЕКС =====
const MAP_LOCATIONS = [
  { name: 'Производство ReLive', coords: [56.7893, 60.6328], address: 'ул. 8 Марта, д. 207, корп. 2', type: 'production', icon: '🏭' },
  { name: 'Кофейни Ü', coords: [56.8373, 60.5978], address: 'ул. Малышева, 36', type: 'cafe', icon: '☕' },
  { name: 'Clear Barn', coords: [56.8438, 60.6045], address: 'ул. Бориса Ельцина, 3', type: 'bar', icon: '🍺' },
  { name: 'Край Света', coords: [56.8365, 60.5969], address: 'ул. Вайнера, 9', type: 'restaurant', icon: '🍜' },
  { name: 'Французский пекарь', coords: [56.8389, 60.6040], address: 'ул. Ленина, 24/8', type: 'bakery', icon: '🥐' },
  { name: 'Jang Su', coords: [56.8355, 60.5920], address: 'ул. Хохрякова, 42', type: 'restaurant', icon: '🍱' },
  { name: 'Рада', coords: [56.8340, 60.6015], address: 'ул. 8 Марта, 8Д', type: 'restaurant', icon: '🍽️' },
  { name: 'Просто вегануться', coords: [56.8380, 60.6120], address: 'ул. Малышева, 71', type: 'shop', icon: '🥗' },
  { name: 'Garage Gym', coords: [56.8290, 60.6200], address: 'ул. Первомайская, 77', type: 'fitness', icon: '💪' },
  { name: 'Жизньмарт', coords: [56.8389, 60.6057], address: 'Сеть магазинов Екатеринбурга', type: 'chain', icon: '🛒' },
  { name: 'Lo Vegano', coords: [56.8345, 60.6080], address: 'ул. Розы Люксембург, 14', type: 'shop', icon: '🌱' },
  { name: 'Яндекс Лавка', coords: [56.8400, 60.6100], address: 'Доставка по Екатеринбургу', type: 'delivery', icon: '🚀' }
];

let mapInitialized = false;

function initMap() {
  if (mapInitialized) return;

  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  if (typeof ymaps === 'undefined') {
    setTimeout(() => {
      if (typeof ymaps === 'undefined') {
        showMapFallback(mapContainer);
      } else {
        initMap();
      }
    }, 1000);
    return;
  }

  ymaps.ready(() => {
    try {
      const yandexMap = new ymaps.Map('map', {
        center: [56.8350, 60.6050],
        zoom: 13,
        controls: ['zoomControl', 'fullscreenControl', 'geolocationControl'],
        behaviors: ['drag', 'dblClickZoom', 'multiTouch', 'scrollZoom']
      });

      yandexMap.behaviors.enable('scrollZoom');

      MAP_LOCATIONS.forEach((location, index) => {
        const placemark = new ymaps.Placemark(location.coords, {
          hintContent: location.name,
          balloonContentHeader: `<strong>${location.icon} ${location.name}</strong>`,
          balloonContentBody: `
            <p style="margin:5px 0;">${location.address}</p>
            <span style="font-size:11px; font-weight:700; color:#4F7942; background:rgba(79,121,66,0.1); padding:2px 8px; border-radius:10px;">
              ${location.type.toUpperCase()}
            </span>
          `,
          balloonContentFooter: 'ReLive Kombucha'
        }, {
          preset: 'islands#greenDotIcon'
        });

        yandexMap.geoObjects.add(placemark);

        const card = document.querySelector(`.location-card[data-index="${index}"]`);
        if (card) {
          card.addEventListener('click', () => {
            document.querySelectorAll('.location-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            yandexMap.setCenter(location.coords, 15, { duration: 500 });
            placemark.balloon.open();
          });
        }
      });

      if (yandexMap.geoObjects.getBounds()) {
        yandexMap.setBounds(yandexMap.geoObjects.getBounds(), {
          checkZoomRange: true,
          zoomMargin: 40
        });
      }

      mapInitialized = true;
      console.log('🗺️ Карта успешно инициализирована');

    } catch (error) {
      console.error('Ошибка инициализации карты:', error);
      showMapFallback(mapContainer);
    }
  });
}

function showMapFallback(container) {
  container.innerHTML = `
    <div class="map-fallback">
      <div class="map-fallback-icon">📍</div>
      <h3>Точки продаж в Екатеринбурге</h3>
      <p>Кафе, рестораны, магазины здорового питания и доставка</p>
      <a href="https://yandex.ru/maps/?text=relive+kombucha+екатеринбург" target="_blank" class="btn btn-primary">
        Открыть в Яндекс.Картах
        <span class="btn-arrow">→</span>
      </a>
    </div>
  `;
}

// ===== БАЗА ДАННЫХ ТОВАРОВ =====
const PRODUCTS_DB = [
  {
    id: "ivan2",
    title: "Forever Ivan 2",
    price: 200,
    desc: "Яркое сочетание уральской смородины, кислого ревеня и ферментированного Иван-чая.",
    ingredients: "Вода артезианская, сахар, чай черный, иван-чай ферментированный, смородина черная, ревень, культура чайного гриба.",
    image: "https://optim.tildacdn.com/stor6236-3164-4265-a263-336264333836/-/contain/279x420/center/center/-/format/webp/15273517.png.webp",
    category: "Berries & Flowers",
    volume: "330 мл"
  },
  {
    id: "oolong",
    title: "Oolong Island",
    price: 200,
    desc: "Изысканный улун в сочетании со сладкой клубникой и пряным базиликом.",
    ingredients: "Вода, сахар, чай улун, клубника, базилик свежий, культура чайного гриба.",
    image: "https://optim.tildacdn.com/stor3939-6530-4137-b631-636434346234/-/contain/279x420/center/center/-/format/webp/75453506.png.webp",
    category: "Berries & Flowers",
    volume: "330 мл"
  }
];

// ===== КОРЗИНА =====
let cart = JSON.parse(localStorage.getItem('relive_cart')) || [];

function openProductDetail(productId) {
  let product = PRODUCTS_DB.find(p => p.id === productId);

  if (!product) {
    product = {
      id: productId,
      title: "Вкус ReLive",
      price: 200,
      desc: "Натуральная комбуча на основе лучших сортов чая.",
      ingredients: "Чай, вода, сахар, культура чайного гриба, натуральные добавки.",
      image: "assets/ReLive.png",
      category: "Kombucha",
      volume: "330 мл"
    };
  }

  const imageContainer = document.getElementById('pModalImage');
  imageContainer.classList.remove('fit-set-image');

  if (product.title.includes('SET')) {
    imageContainer.classList.add('fit-set-image');
  }

  imageContainer.innerHTML = `<img src="${product.image}" alt="${product.title}">`;
  document.getElementById('pModalCategory').textContent = product.category;
  document.getElementById('pModalTitle').textContent = product.title;
  document.getElementById('pModalPrice').textContent = `${product.price} ₽`;
  document.getElementById('pModalDesc').textContent = product.desc;
  document.getElementById('pModalIngredients').textContent = product.ingredients;
  document.getElementById('pModalQty').value = 1;

  const addBtn = document.getElementById('pModalAddBtn');
  addBtn.onclick = () => {
    const qty = parseInt(document.getElementById('pModalQty').value);
    addToCart(product, qty);
    closeProductModal();
  };

  document.getElementById('productModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
  document.body.style.overflow = '';
}

function changeModalQty(delta) {
  const input = document.getElementById('pModalQty');
  if (!input) return;

  let val = parseInt(input.value) || 1;
  val += delta;
  if (val < 1) val = 1;
  input.value = val;
}

function addToCart(product, quantity = 1) {
  const existingItem = cart.find(item => item.id === product.id || item.title === product.title);

  if (existingItem) {
    existingItem.qty += quantity;
  } else {
    cart.push({
      id: product.id || product.title,
      title: product.title,
      price: product.price,
      image: product.image,
      qty: quantity
    });
  }

  saveCart();
  updateNavCartCount();
  playNotification(`✅ ${product.title} (${quantity} шт.) в корзине!`, 'success');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCartItems();
  updateNavCartCount();
}

function updateCartQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty < 1) cart[index].qty = 1;
  saveCart();
  renderCartItems();
  updateNavCartCount();
}

function saveCart() {
  localStorage.setItem('relive_cart', JSON.stringify(cart));
}

function updateNavCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('navCartCount');
  if (badge) badge.textContent = count;
}

function openCartModal() {
  renderCartItems();
  document.getElementById('cartModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartModal() {
  document.getElementById('cartModal').classList.remove('active');
  document.body.style.overflow = '';
}

function renderCartItems() {
  const list = document.getElementById('cartItemsList');
  const totalEl = document.getElementById('cartTotalPrice');

  if (cart.length === 0) {
    list.innerHTML = '<div class="empty-cart-msg">Ваша корзина пуста 🍃<br>Добавьте немного живого чая!</div>';
    totalEl.textContent = '0 ₽';
    return;
  }

  let html = '';
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    html += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-info">
          <span class="cart-item-title">${item.title}</span>
          <span class="cart-item-price">${item.price} ₽ × ${item.qty} = ${itemTotal} ₽</span>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-selector" style="height: 30px;">
            <button onclick="updateCartQty(${index}, -1)">−</button>
            <input type="number" value="${item.qty}" readonly style="width: 30px; font-size: 0.9rem;">
            <button onclick="updateCartQty(${index}, 1)">+</button>
          </div>
          <button class="cart-remove-btn" onclick="removeFromCart(${index})">×</button>
        </div>
      </div>
    `;
  });

  list.innerHTML = html;
  totalEl.textContent = `${total} ₽`;
}

function checkout() {
  if (cart.length === 0) return;
  alert('Переход к оплате... (В демо-режиме заказ оформлен!)');
  cart = [];
  saveCart();
  closeCartModal();
  updateNavCartCount();
  playNotification('🎉 Заказ успешно оформлен! Спасибо!', 'success');
}

// ===== ИНИЦИАЛИЗАЦИЯ КЛИКОВ ПО КАРТОЧКАМ =====
document.addEventListener('DOMContentLoaded', () => {
  updateNavCartCount();

  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    card.addEventListener('click', () => {
      const titleElement = card.querySelector('h3');
      const title = titleElement ? titleElement.textContent : "Unknown";

      const priceElement = card.querySelector('.product-price');
      const priceText = priceElement ? priceElement.childNodes[0].textContent.replace(/\D/g, '') : "200";
      const price = parseInt(priceText) || 200;

      const imgElement = card.querySelector('img');
      const imgSrc = imgElement ? imgElement.src : "";

      const dbProduct = PRODUCTS_DB.find(p => p.title === title);

      if (dbProduct) {
        openProductDetail(dbProduct.id);
      } else {
        const tempProduct = {
          id: title,
          title: title,
          price: price,
          image: imgSrc,
          desc: "Описание этого вкуса скоро появится. Но поверьте, это очень вкусно!",
          ingredients: "Классический состав ReLive",
          category: "Kombucha",
          volume: "330 мл"
        };
        if (!PRODUCTS_DB.some(p => p.id === tempProduct.id)) {
          PRODUCTS_DB.push(tempProduct);
        }
        openProductDetail(tempProduct.id);
      }
    });

    const innerBtn = card.querySelector('.cart-btn');
    if (innerBtn) {
      innerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const title = card.querySelector('h3').textContent;
        const priceText = card.querySelector('.product-price').textContent.replace(/\D/g, '');
        const imgSrc = card.querySelector('img').src;

        addToCart({
          id: title,
          title: title,
          price: parseInt(priceText) || 200,
          image: imgSrc
        });
      });
    }
  });
});

// ===== АВТОИНИЦИАЛИЗАЦИЯ КАРТЫ =====
const mapObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !mapInitialized) {
      initMap();
      mapObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

const whereBuySection = document.getElementById('where-buy');
if (whereBuySection) {
  mapObserver.observe(whereBuySection);
}

// ===== ПАРАЛЛАКС =====
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrolled = window.scrollY;
      document.querySelectorAll('.blob').forEach((blob, index) => {
        const speed = 0.15 + index * 0.05;
        blob.style.transform = `translateY(${scrolled * speed}px)`;
      });
      ticking = false;
    });
    ticking = true;
  }
});

// ===== КЛАВИАТУРНЫЕ СОКРАЩЕНИЯ =====
document.addEventListener('keydown', (e) => {
  if (e.target.matches('input, textarea, select')) return;
  switch (e.key.toLowerCase()) {
    case 'g': scrollToSection('game'); break;
    case 'p': scrollToSection('products'); break;
    case 'c': scrollToSection('contacts'); break;
    case 'h': scrollToSection('our-story'); break;
    case 't': window.scrollTo({ top: 0, behavior: 'smooth' }); break;
  }
});

// ===== ОПРЕДЕЛЕНИЕ УСТРОЙСТВА =====
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  document.body.classList.add('is-mobile');
}

// ===== УМЕНЬШЕНИЕ АНИМАЦИЙ =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('reduce-motion');
  const style = document.createElement('style');
  style.textContent = `.reduce-motion * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }`;
  document.head.appendChild(style);
}

// ===== EASTER EGG - KONAMI CODE =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  if (konamiCode.join('') === konamiSequence.join('')) activateEasterEgg();
});

function activateEasterEgg() {
  document.body.style.animation = 'rainbow 2s infinite';
  const style = document.createElement('style');
  style.id = 'rainbow-style';
  style.textContent = `@keyframes rainbow { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }`;
  document.head.appendChild(style);

  if (mascotSpeech) {
    mascotSpeech.textContent = '🎉 Секретный код Ивана Тюленева! 🍵';
  }
  playNotification('🎮 Konami Code: Rainbow Mode Activated!', 'success');

  setTimeout(() => {
    document.body.style.animation = '';
    document.getElementById('rainbow-style')?.remove();
  }, 5000);
}

// ===== АДАПТИВНЫЙ VH =====
function setVH() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
setVH();
window.addEventListener('resize', setVH);

// ===== ПРЕДЗАГРУЗКА ИЗОБРАЖЕНИЙ =====
function preloadCriticalImages() {
  const images = ['assets/ReLive.png', 'assets/scoby.png'];
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// ===== ЛЕНИВАЯ ЗАГРУЗКА =====
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

// ===== СЧЁТЧИК ПОСЕЩЕНИЙ =====
function trackVisit() {
  const visits = parseInt(localStorage.getItem('relive_visits') || '0') + 1;
  localStorage.setItem('relive_visits', visits.toString());

  if (visits === 1) {
    setTimeout(() => {
      playNotification('👋 Добро пожаловать на сайт ReLive Kombucha!', 'info');
    }, 1500);
  } else if (visits === 5) {
    setTimeout(() => {
      playNotification('🎉 Вы уже 5 раз посетили наш сайт! Спасибо!', 'success');
    }, 2000);
  }
}

// ===== ГЛАВНАЯ ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
  AOS.init();
  preloadCriticalImages();
  initLazyLoading();
  trackVisit();
  
  // Инициализация твоей игры
  initMyGame();
  
  console.log('%c🍵 ReLive Kombucha', 'font-size: 24px; font-weight: bold; color: #4F7942;');
  console.log('%c🎮 Мини-игра загружена!', 'font-size: 14px; color: #FF7F50;');
});
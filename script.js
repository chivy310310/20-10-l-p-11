/**
 * LOGIC TƯƠNG TÁC CHO WEBSITE 20/10: "A LITTLE GIFT FOR YOU 💌"
 * Giữ nguyên duy nhất 1 câu chúc theo yêu cầu, tập trung trọn vẹn vào trải nghiệm mở quà & âm nhạc.
 */

const SINGLE_WISH = `Gửi {name} 💗
Chúc cậu ngày 20/10 luôn nhẹ lòng, bình thản và hạnh phúc từ những điều giản đơn nhất. Mong cậu luôn giữ vững niềm tin, luôn mạnh mẽ vượt qua mọi cơn gió ngược để vươn tới bầu trời của riêng mình! 🌤️✨`;

let currentName = '';

document.addEventListener('DOMContentLoaded', () => {
  initForm();
  initPetalsEffect();
  initAudioPlayer();
  initHeartReactions();
});

// ==========================================================================
// 1. XỬ LÝ NHẬP TÊN & MỞ MÓN QUÀ
// ==========================================================================
function initForm() {
  const nameInput = document.getElementById('name-input');
  const openBtn = document.getElementById('open-gift-btn');

  const handleOpen = () => {
    const rawName = nameInput.value.trim();
    if (!rawName) {
      showError('Cậu hãy nhập tên của mình để mở quà nhé! 💗');
      nameInput.focus();
      return;
    }

    clearError();
    currentName = formatName(rawName);
    triggerGiftOpening();
  };

  if (openBtn) {
    openBtn.addEventListener('click', handleOpen);
  }

  if (nameInput) {
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleOpen();
      }
    });

    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim()) {
        clearError();
      }
    });
  }
}

function triggerGiftOpening() {
  const overlay = document.getElementById('opening-overlay');
  const envelope = document.getElementById('envelope-box');
  const homeView = document.getElementById('home-view');
  const cardView = document.getElementById('card-view');

  // Khởi phát nhạc nền cùng hiệu ứng mở quà
  playAudio();

  if (overlay && envelope) {
    overlay.classList.add('active');
    envelope.classList.remove('open');

    setTimeout(() => {
      envelope.classList.add('open');
      shootConfetti();
    }, 250);

    setTimeout(() => {
      overlay.classList.remove('active');
      envelope.classList.remove('open');

      if (homeView) homeView.classList.add('hidden');
      if (cardView) {
        cardView.classList.remove('hidden');
        displayWish(currentName);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 1100);
  } else {
    if (homeView) homeView.classList.add('hidden');
    if (cardView) {
      cardView.classList.remove('hidden');
      displayWish(currentName);
    }
  }
}

// ==========================================================================
// 2. HIỂN THỊ CÂU CHÚC DUY NHẤT ĐƯỢC CHỌN
// ==========================================================================
function displayWish(name) {
  const personalizedWish = SINGLE_WISH.replace(/\{name\}/g, name);

  const titleEl = document.getElementById('card-title-name');
  const wishEl = document.getElementById('wish-paragraph');

  if (titleEl) {
    titleEl.textContent = `Happy 20/10, ${name} 💖`;
  }

  if (wishEl) {
    wishEl.textContent = personalizedWish;
  }
}

function formatName(str) {
  if (!str) return '';
  return str.split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function showError(msg) {
  const errorEl = document.getElementById('error-msg');
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.style.opacity = '1';
  }
}

function clearError() {
  const errorEl = document.getElementById('error-msg');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.style.opacity = '0';
  }
}

// ==========================================================================
// 3. THẢ TIM TƯƠNG TÁC (HEART BURST)
// ==========================================================================
function initHeartReactions() {
  const heartBtn = document.getElementById('heart-burst-btn');
  if (!heartBtn) return;

  const heartIcons = ['💖', '💕', '💗', '🌸', '✨', '🌷'];

  heartBtn.addEventListener('click', () => {
    const rect = heartBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    for (let i = 0; i < 4; i++) {
      createFloatingHeart(x + (Math.random() * 40 - 20), y, heartIcons[Math.floor(Math.random() * heartIcons.length)]);
    }
  });
}

function createFloatingHeart(x, y, icon) {
  const heart = document.createElement('div');
  heart.className = 'floating-heart-el';
  heart.textContent = icon;
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 1800);
}

// ==========================================================================
// 4. HIỆU ỨNG CÁNH HOA & ĐỐM SÁNG RƠI (CANVAS ENGINE)
// ==========================================================================
function initPetalsEffect() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalsCount = 26;
  const petals = [];
  const colors = [
    'rgba(248, 187, 208, 0.75)',
    'rgba(252, 228, 236, 0.85)',
    'rgba(244, 143, 177, 0.65)',
    'rgba(255, 224, 130, 0.60)'
  ];

  for (let i = 0; i < petalsCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedX: Math.random() * 1.2 - 0.6,
      speedY: Math.random() * 1.1 + 0.7,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 1.5 - 0.75,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  let isTabActive = true;
  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
  });

  function render() {
    if (isTabActive) {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

// ==========================================================================
// 5. HIỆU ỨNG PHÁO HOA CONFETTI LẤP LÁNH
// ==========================================================================
function shootConfetti() {
  const colors = ['#EC407A', '#F48FB1', '#FFD54F', '#BA68C8', '#FFF'];
  for (let i = 0; i < 60; i++) {
    createParticle(colors[Math.floor(Math.random() * colors.length)]);
  }
}

function createParticle(color) {
  const p = document.createElement('div');
  p.style.position = 'fixed';
  p.style.zIndex = '9999';
  p.style.pointerEvents = 'none';
  p.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
  p.style.width = `${Math.random() * 10 + 6}px`;
  p.style.height = `${Math.random() * 10 + 6}px`;
  p.style.backgroundColor = color;

  const startX = window.innerWidth / 2;
  const startY = window.innerHeight * 0.45;
  p.style.left = `${startX}px`;
  p.style.top = `${startY}px`;

  const angle = Math.random() * Math.PI * 2;
  const velocity = Math.random() * 320 + 80;
  const targetX = startX + Math.cos(angle) * velocity;
  const targetY = startY + Math.sin(angle) * velocity + 150;

  document.body.appendChild(p);

  p.animate([
    { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
    { transform: `translate(${targetX - startX}px, ${targetY - startY}px) scale(0.4) rotate(${Math.random() * 720}deg)`, opacity: 0 }
  ], {
    duration: Math.random() * 500 + 700,
    easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
  }).onfinish = () => p.remove();
}

// ==========================================================================
// 6. BỘ PHÁT NHẠC NỀN BẰNG BÀI HÁT TẢI LÊN (BGM.MP3)
// ==========================================================================
let bgmAudio = null;
let isAudioPlaying = false;

function playAudio() {
  if (!bgmAudio) bgmAudio = document.getElementById('bgm-audio');
  if (!bgmAudio) return;

  const musicBtn = document.getElementById('music-toggle-btn');
  bgmAudio.play().then(() => {
    isAudioPlaying = true;
    if (musicBtn) {
      musicBtn.classList.add('active');
      musicBtn.innerHTML = `<span>🎵</span> Nhạc: Đang bật`;
    }
  }).catch((err) => {
    console.log('Play blocked or user interaction needed:', err);
  });
}

function pauseAudio() {
  if (!bgmAudio) bgmAudio = document.getElementById('bgm-audio');
  if (!bgmAudio) return;

  const musicBtn = document.getElementById('music-toggle-btn');
  bgmAudio.pause();
  isAudioPlaying = false;
  if (musicBtn) {
    musicBtn.classList.remove('active');
    musicBtn.innerHTML = `<span>🔇</span> Nhạc nền`;
  }
}

function initAudioPlayer() {
  const musicBtn = document.getElementById('music-toggle-btn');
  bgmAudio = document.getElementById('bgm-audio');
  if (!musicBtn || !bgmAudio) return;

  bgmAudio.volume = 0.65;

  musicBtn.addEventListener('click', () => {
    if (!isAudioPlaying) {
      playAudio();
    } else {
      pauseAudio();
    }
  });
}

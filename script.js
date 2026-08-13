/* ===================================================
   1. Fundo de Partículas Interativas (HTML5 Canvas)
   =================================================== */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];

const mouse = {
  x: null,
  y: null,
  radius: 130
};

// Redimensiona o canvas quando a janela muda de tamanho
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Rastreamos o movimento do mouse
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

// Classe para gerenciar cada partícula
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 1.0;
    this.speedY = (Math.random() - 0.5) * 1.0;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particlesArray = [];
  const numberOfParticles = Math.floor((canvas.width * canvas.height) / 11000);
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}
initParticles();

// Animação e conexões entre partículas/mouse
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();

    // Conecta partículas próximas entre si
    for (let j = i + 1; j < particlesArray.length; j++) {
      const dx = particlesArray[i].x - particlesArray[j].x;
      const dy = particlesArray[i].y - particlesArray[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 110) {
        ctx.strokeStyle = `rgba(168, 85, 247, ${1 - distance / 110})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
      }
    }

    // Conecta partículas ao ponteiro do mouse
    if (mouse.x !== null) {
      const dx = particlesArray[i].x - mouse.x;
      const dy = particlesArray[i].y - mouse.y;
      const mouseDist = Math.sqrt(dx * dx + dy * dy);

      if (mouseDist < mouse.radius) {
        ctx.strokeStyle = `rgba(56, 189, 248, ${1 - mouseDist / mouse.radius})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ===================================================
   2. Barra de Progresso de Leitura Neon
   =================================================== */
const progressBar = document.getElementById('progress-bar');

window.addEventListener('scroll', () => {
  const totalScroll = document.documentElement.scrollTop;
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercentage = (totalScroll / windowHeight) * 100;
  progressBar.style.width = scrollPercentage + '%';
});

/* ===================================================
   3. Contador de Likes com Persistence (LocalStorage)
   =================================================== */
const DEFAULT_LIKES = 428;
const globalLikeButton = document.getElementById('globalLikeButton');
const globalLikeDisplay = document.getElementById('globalLikeDisplay');
const globalHeartIcon = document.getElementById('globalHeartIcon');

let totalLikes = parseInt(localStorage.getItem('blogtech_global_likes_count')) || DEFAULT_LIKES;
let userHasLiked = localStorage.getItem('blogtech_global_user_liked') === 'true';

function updateGlobalLikeUI() {
  globalLikeDisplay.textContent = `${totalLikes} curtidas`;
  if (userHasLiked) {
    globalLikeButton.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  } else {
    globalLikeButton.style.background = 'linear-gradient(135deg, #2563eb, #7c3aed)';
  }
}

updateGlobalLikeUI();

globalLikeButton.addEventListener('click', () => {
  if (!userHasLiked) {
    totalLikes++;
    userHasLiked = true;
  } else {
    totalLikes--;
    userHasLiked = false;
  }

  localStorage.setItem('blogtech_global_likes_count', totalLikes);
  localStorage.setItem('blogtech_global_user_liked', userHasLiked);

  updateGlobalLikeUI();

  // Efeito visual de pulso no ícone do coração
  globalHeartIcon.classList.add('pulse');
  setTimeout(() => globalHeartIcon.classList.remove('pulse'), 300);
});

/* ===================================================
   4. Botão Flutuante "Voltar ao Topo" (Smooth Scroll)
   =================================================== */
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 350) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ============================================================
// FALLING FLOWERS — SVG petals drift from top to bottom
// ============================================================
(function () {
  const field = document.getElementById('flowerField');
  if (!field) return;

  // Colour palette matching the dark crimson theme
  const colours = [
    '#C8393A', '#9a1a20', '#F5EBE6',
    '#C4909A', '#e05050', '#7a0e14',
    '#F0E4E0', '#A84350'
  ];

  // Four SVG flower shapes (as inline SVG strings)
  const shapes = [
    // 5-petal rounded flower
    (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="${c}" opacity="0.65" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(0   20 20)"/>
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(72  20 20)"/>
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(144 20 20)"/>
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(216 20 20)"/>
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(288 20 20)"/>
      <circle  cx="20" cy="20" r="5" fill="${c}" opacity="0.8"/>
    </svg>`,

    // 6-petal daisy
    (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="${c}" opacity="0.6" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(0   20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(60  20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(120 20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(180 20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(240 20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(300 20 20)"/>
      <circle  cx="20" cy="20" r="4.5" fill="${c}" opacity="0.8"/>
    </svg>`,

    // Single petal / leaf shape
    (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="${c}" opacity="0.55" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4 C 28 12, 28 28, 20 36 C 12 28, 12 12, 20 4 Z"/>
    </svg>`,

    // 4-petal sakura style
    (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="${c}" opacity="0.6" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="8"  rx="5.5" ry="10" transform="rotate(0   20 20)"/>
      <ellipse cx="20" cy="8"  rx="5.5" ry="10" transform="rotate(90  20 20)"/>
      <ellipse cx="20" cy="8"  rx="5.5" ry="10" transform="rotate(180 20 20)"/>
      <ellipse cx="20" cy="8"  rx="5.5" ry="10" transform="rotate(270 20 20)"/>
      <circle  cx="20" cy="20" r="4" fill="${c}" opacity="0.75"/>
    </svg>`,
  ];

  const TOTAL = 10;  // number of flowers in the pool
  const rnd = (a, b) => Math.random() * (b - a) + a;
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  for (let i = 0; i < TOTAL; i++) {
    const el = document.createElement('div');
    el.className = 'flower';

    const size = rnd(14, 32);                   // px
    const colour = pick(colours);
    const shapeIdx = Math.floor(rnd(0, shapes.length));
    const duration = rnd(7, 18);                // fall speed (s)
    const spinSpeed = rnd(4, 14);               // rotation speed (s)
    const delay = rnd(-duration, 0);            // stagger so they're already mid-air
    const leftPct = rnd(0, 100);                // horizontal start
    const drift = `${rnd(-80, 80)}px`;          // horizontal wander during fall

    el.style.cssText = `
      left: ${leftPct}%;
      --drift: ${drift};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    el.innerHTML = shapes[shapeIdx](colour, Math.round(size));

    // Apply spin speed to the inner svg
    const svg = el.querySelector('svg');
    if (svg) {
      svg.style.animationDuration = `${spinSpeed}s`;
    }

    field.appendChild(el);
  }
})();

// ============================================================
// COUNTDOWN TIMER — Targets Nikah on 24 Dec 2026 at 11:30 AM IST
// ============================================================
const NIKAH_DATE = new Date('2026-12-24T11:30:00+05:30').getTime();

const cdDays = document.getElementById('cd-days');
const cdHours = document.getElementById('cd-hours');
const cdMins = document.getElementById('cd-mins');
const cdSecs = document.getElementById('cd-secs');

function pad(n) { return String(n).padStart(2, '0'); }

function updateCountdown() {
  const now = Date.now();
  let diff = NIKAH_DATE - now;

  if (diff <= 0) {
    if (cdDays) cdDays.textContent = '00';
    if (cdHours) cdHours.textContent = '00';
    if (cdMins) cdMins.textContent = '00';
    if (cdSecs) cdSecs.textContent = '00';
    return;
  }

  const days = Math.floor(diff / 86400000); diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
  const mins = Math.floor(diff / 60000); diff -= mins * 60000;
  const secs = Math.floor(diff / 1000);

  if (cdDays) cdDays.textContent = pad(days);
  if (cdHours) cdHours.textContent = pad(hours);
  if (cdMins) cdMins.textContent = pad(mins);
  if (cdSecs) cdSecs.textContent = pad(secs);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ============================================================
// SPLASH SCREEN — dismiss on "Open Invitation" click + autoplay music
// ============================================================
const splashOverlay = document.getElementById('splashOverlay');
const openInvitationBtn = document.getElementById('openInvitationBtn');
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const musicRing = document.getElementById('musicRing');
const iconOn = musicBtn ? musicBtn.querySelector('.music-icon--on') : null;
const iconOff = musicBtn ? musicBtn.querySelector('.music-icon--off') : null;

// Update button appearance to match actual playing state
function syncMusicBtn(playing) {
  if (!musicBtn) return;
  if (playing) {
    if (iconOn) iconOn.style.display = '';
    if (iconOff) iconOff.style.display = 'none';
    musicBtn.setAttribute('aria-label', 'Pause music');
    if (musicRing) musicRing.classList.add('spinning');
  } else {
    if (iconOn) iconOn.style.display = 'none';
    if (iconOff) iconOff.style.display = '';
    musicBtn.setAttribute('aria-label', 'Play music');
    if (musicRing) musicRing.classList.remove('spinning');
  }
}

// Attempt autoplay when user clicks "Open Invitation"
if (openInvitationBtn && splashOverlay) {
  openInvitationBtn.addEventListener('click', () => {
    splashOverlay.classList.add('hidden');
    splashOverlay.addEventListener('transitionend', () => {
      splashOverlay.remove();
    }, { once: true });

    // Make the floating music toggle button visible
    if (musicBtn) musicBtn.classList.add('visible');

    // Autoplay — browsers allow this after a user gesture
    if (bgMusic) {
      bgMusic.volume = 0.55;
      bgMusic.play().then(() => {
        syncMusicBtn(true);
      }).catch(() => {
        // Autoplay blocked — show button in paused state
        syncMusicBtn(false);
      });
    }
  });
}

// Toggle play / pause via floating button
if (musicBtn && bgMusic) {
  musicBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => syncMusicBtn(true));
    } else {
      bgMusic.pause();
      syncMusicBtn(false);
    }
  });

  bgMusic.addEventListener('pause', () => syncMusicBtn(false));
  bgMusic.addEventListener('play', () => syncMusicBtn(true));
}

// ============================================================
// REVEAL ON SCROLL
// ============================================================
const revealTargets = document.querySelectorAll(
  '.occasion-card, .family-card, .countdown-grid, .venue-card, .rsvp-card, .section-title, .section-eyebrow, .invite-note p, .couples-img-container, .shiyas-dedication, .wish-card'
);

revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => observer.observe(el));

// ============================================================
// WHATSAPP WISHES CONTROLLER (9744560630)
// ============================================================
const WHATSAPP_NUMBER = '919744560630';

function sendWishWhatsApp(e) {
  if (e && e.preventDefault) e.preventDefault();

  const nameInput = document.getElementById('wishName');
  const msgInput  = document.getElementById('wishMessage');
  const submitBtn = document.getElementById('wishSubmitBtn');

  const name = nameInput ? nameInput.value.trim() : '';
  const message = msgInput ? msgInput.value.trim() : '';

  // Validation: Name is required
  if (!name) {
    if (nameInput) {
      nameInput.focus();
      nameInput.style.borderColor = 'var(--gold)';
      nameInput.style.boxShadow = '0 0 0 3px rgba(200,57,58,0.35)';
      setTimeout(() => {
        nameInput.style.borderColor = '';
        nameInput.style.boxShadow = '';
      }, 2000);
    }
    return;
  }

  // Validation: Message is required
  if (!message) {
    if (msgInput) {
      msgInput.focus();
      msgInput.style.borderColor = 'var(--gold)';
      msgInput.style.boxShadow = '0 0 0 3px rgba(200,57,58,0.35)';
      setTimeout(() => {
        msgInput.style.borderColor = '';
        msgInput.style.boxShadow = '';
      }, 2000);
    }
    return;
  }

  // Visual feedback
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Connecting to WhatsApp…';
  }

  // Construct message for WhatsApp
  const textBody =
    `*Wedding Wishes for Shahin S & Beegam Shibina* ✨\n\n` +
    `*From:* ${name}\n\n` +
    `*Message:*\n${message}\n\n` +
    `_Sent via Wedding Invitation Website_`;

  const waUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(textBody)}`;

  // Show success box
  const form = document.getElementById('wishesForm');
  const successBox = document.getElementById('wishesSuccessBox');
  if (form) form.hidden = true;
  if (successBox) successBox.hidden = false;

  // Open WhatsApp in new tab
  window.open(waUrl, '_blank');

  setTimeout(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.44 19.65L5.27 16.62L5.07 16.31C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.95 7.15C8.74 7.15 8.39 7.23 8.1 7.54C7.81 7.86 6.99 8.63 6.99 10.19C6.99 11.76 8.13 13.27 8.29 13.48C8.45 13.69 10.49 16.84 13.67 18.08C16.31 19.12 16.85 18.91 17.41 18.86C17.97 18.81 19.23 18.11 19.49 17.39C19.75 16.66 19.75 16.04 19.67 15.91C19.59 15.78 19.38 15.7 19.07 15.54C18.76 15.39 17.22 14.63 16.93 14.53C16.65 14.43 16.44 14.37 16.23 14.68C16.02 14.99 15.42 15.7 15.24 15.91C15.06 16.12 14.88 16.14 14.57 15.99C14.26 15.83 13.26 15.51 12.08 14.45C11.16 13.63 10.54 12.61 10.36 12.3C10.18 11.99 10.34 11.83 10.5 11.67C10.64 11.53 10.81 11.31 10.97 11.13C11.13 10.95 11.18 10.82 11.28 10.61C11.38 10.4 11.33 10.22 11.25 10.06C11.17 9.9 10.55 8.37 10.29 7.75C10.04 7.15 9.78 7.23 9.58 7.22C9.39 7.21 9.17 7.21 8.95 7.15Z"/>
        </svg>
        Send Wish on WhatsApp
      `;
    }
  }, 1000);
}

function resetWishesForm() {
  const form = document.getElementById('wishesForm');
  const successBox = document.getElementById('wishesSuccessBox');
  if (form) {
    form.reset();
    form.hidden = false;
  }
  if (successBox) {
    successBox.hidden = true;
  }
}

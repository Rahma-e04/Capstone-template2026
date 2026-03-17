/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */
var hamburgerButton = document.getElementById("hamburger");

hamburgerButton.addEventListener("click", toggleMobileMenu);
function toggleMobileMenu() {
    const isOpen = hamburgerButton.classList.toggle('is-open');
  hamburgerButton.setAttribute('aria-expanded', isOpen);
  var x = document.getElementById("navLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

/* Digital rain (Matrix-style) background for the main container */
(function() {
  const heroElem = document.querySelector('.hero-word');
  if (!heroElem) return;

  // Append full-viewport canvas to the document body so the fixed hero-word aligns with it
  const canvas = document.createElement('canvas');
  canvas.id = 'digital-rain';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  // Offscreen canvas for rain trails (keeps history and trailing effect)
  const rainCanvas = document.createElement('canvas');
  const rainCtx = rainCanvas.getContext('2d');

  let width = 0;
  let height = 0;
  let columns = 0;
  let drops = [];
  let fontSize = 16;
  // control how many rows each drop advances per frame (smaller = slower)
  let fallSpeed = 0.45; // default slower speed; adjust between 0.1 (very slow) and 1.5 (fast)

  // text that will be filled by the rain
  const heroText = 'OURCHIVES';
  // reveal animation controls
  let revealProgress = 0; // 0..1
  const revealDuration = 3000; // milliseconds for full fill
  let revealStart = null;

  const chars = '01'; // simple binary look; change to katakana for a different style
  // read rain color from CSS variable (fallback to the previous RGB)
  const cssVars = getComputedStyle(container);
  let rainRgb = cssVars.getPropertyValue('--rain-rgb') || '36, 213, 109';
  rainRgb = rainRgb.trim();

  function resize() {
  const dpr = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

  // match offscreen rain canvas size
  rainCanvas.width = Math.floor(width * dpr);
  rainCanvas.height = Math.floor(height * dpr);
  rainCanvas.style.width = width + 'px';
  rainCanvas.style.height = height + 'px';

    // reset transform to avoid compounding scales
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

    fontSize = Math.max(10, Math.min(22, Math.floor(width / 80)));
    columns = Math.floor(width / fontSize) + 1;
    drops = new Array(columns).fill(1);
    ctx.font = fontSize + 'px monospace';

  // also set font on rain ctx
  rainCtx.setTransform(1, 0, 0, 1, 0, 0);
  rainCtx.scale(dpr, dpr);
  rainCtx.font = fontSize + 'px monospace';

  // set canvas element size in CSS pixels
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  }

  function draw() {
    // Update reveal progress
    if (revealStart === null) revealStart = performance.now();
    const now = performance.now();
    revealProgress = Math.min(1, (now - revealStart) / revealDuration);

    // --- Draw rain onto offscreen rainCanvas so we can keep trails ---
    // translucent black to create trailing effect on rain canvas
    rainCtx.fillStyle = 'rgba(0,0,0,0.08)';
    rainCtx.fillRect(0, 0, width, height);

    for (let i = 0; i < columns; i++) {
      const ch = chars.charAt(Math.floor(Math.random() * chars.length));
      const x = i * fontSize + (fontSize / 2);
      const y = drops[i] * fontSize;

  // use the CSS variable for the rain head color
  rainCtx.fillStyle = `rgba(${rainRgb}, 0.95)`;
      rainCtx.font = `${fontSize}px monospace`;
      rainCtx.fillText(ch, x, y);

      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += fallSpeed;
    }

    // --- Composite rain onto main canvas, masked by the hero text clipped by reveal ---
    ctx.clearRect(0, 0, width, height);
    // draw the rain buffer onto main
    ctx.drawImage(rainCanvas, 0, 0, width, height);

    // prepare masking: keep only rain pixels that overlap with the hero text within the reveal clip
    ctx.globalCompositeOperation = 'destination-in';

    // compute hero text position using viewport coordinates (canvas covers the viewport)
    let heroFontSize = 96;
    let textX = width / 2;
    let textY = height / 2;
    if (heroElem) {
      const heroStyle = getComputedStyle(heroElem);
      heroFontSize = parseFloat(heroStyle.fontSize) || heroFontSize;
      const heroRect = heroElem.getBoundingClientRect();
      // heroRect is already in viewport coordinates; use center directly
      textX = heroRect.left + heroRect.width / 2;
      textY = heroRect.top + heroRect.height / 2;
    }

    // determine reveal clipping rectangle (from top to revealHeight)
    const revealHeight = height * revealProgress;
    const revealTop = 0; // start revealing from top; fills downward

    // clip to reveal rectangle then draw the hero text as opaque source for destination-in
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, revealTop, width, revealHeight);
    ctx.clip();

    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.font = `${heroFontSize}px GridlitePEVF, 'Gridlite PE Variable', monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(heroText, textX, textY);
    ctx.restore();

    // reset composite mode
    ctx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(draw);
  }

  // handle resize with a small debounce
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      resize();
    }, 150);
  });

  // initialize and start
  resize();
  draw();
})();

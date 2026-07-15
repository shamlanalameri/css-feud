/* ========================= confetti ========================= */
export function confetti(dur) {
  const cv = document.getElementById('confetti');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  cv.width = innerWidth;
  cv.height = innerHeight;
  const cols = ['#CBA344', '#F8C027', '#4F98FF', '#81C1FF', '#EA4F49', '#4A9D5C', '#ffffff'];
  const ps = Array.from({ length: 180 }, () => ({
    x: Math.random() * cv.width,
    y: -20 - Math.random() * cv.height * 0.5,
    w: 6 + Math.random() * 7,
    h: 8 + Math.random() * 10,
    vy: 2 + Math.random() * 3.5,
    vx: -1.5 + Math.random() * 3,
    r: Math.random() * Math.PI,
    vr: -0.1 + Math.random() * 0.2,
    c: cols[Math.floor(Math.random() * cols.length)],
  }));
  const end = Date.now() + (dur || 4000);
  (function frame() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    if (Date.now() > end) return;
    ps.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      if (p.y > cv.height + 20) {
        p.y = -20;
        p.x = Math.random() * cv.width;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    requestAnimationFrame(frame);
  })();
}

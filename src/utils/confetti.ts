import confetti from 'canvas-confetti';

export function triggerRomanticConfetti() {
  // Celebration burst 1: hearts/stars-like soft colors
  confetti({
    particleCount: 70,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#a78bfa', '#60a5fa'],
    disableForReducedMotion: true,
  });

  // Secondary burst with delayed twinkle
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.6 },
      colors: ['#0284c7', '#9333ea', '#e879f9', '#38bdf8'],
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.6 },
      colors: ['#0284c7', '#9333ea', '#e879f9', '#38bdf8'],
      disableForReducedMotion: true,
    });
  }, 200);
}

function createSound(path) {
  const audio = new Audio(path);
  audio.preload = "auto";
  return audio;
}

export const sounds = {
  attack: createSound("/sounds/attack.mp3"),
  countdown: createSound("/sounds/countdown.mp3"),
  win: createSound("/sounds/win.mp3"),
};

export function play(sound) {
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

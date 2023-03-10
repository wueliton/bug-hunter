export class GameSounds<SoundList = unknown> {
  #playlist: { [k: string]: HTMLAudioElement } = {};

  get playlist() {
    return this.#playlist as SoundList;
  }

  constructor(playlist: { [k in string]: string }) {
    Object.entries(playlist).forEach(([key, sound]) => {
      const audio = document.createElement('audio');
      audio.src = sound;
      audio.preload = 'auto';
      audio.volume = 0.02;
      this.#playlist[key] = audio;
    });
  }
}

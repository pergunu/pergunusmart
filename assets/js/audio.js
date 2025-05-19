// Audio management
class AudioManager {
    constructor() {
        this.audioElements = {};
        this.currentTrack = null;
        this.isPlaying = false;
    }
    
    addAudio(id, src) {
        this.audioElements[id] = new Audio(src);
    }
    
    play(id) {
        if (this.audioElements[id]) {
            this.audioElements[id].currentTime = 0;
            this.audioElements[id].play();
        }
    }
    
    stop(id) {
        if (this.audioElements[id]) {
            this.audioElements[id].pause();
            this.audioElements[id].currentTime = 0;
        }
    }
    
    setVolume(volume) {
        for (const id in this.audioElements) {
            this.audioElements[id].volume = volume;
        }
    }
}

// Initialize audio manager
const audioManager = new AudioManager();

// Add audio files
audioManager.addAudio('opening', 'assets/audio/opening.mp3');
audioManager.addAudio('applause', 'assets/audio/applause.mp3');
audioManager.addAudio('correct', 'assets/audio/jawabanbenar.mp3');
audioManager.addAudio('wrong', 'assets/audio/jawbansalah.mp3');
audioManager.addAudio('button', 'assets/audio/audiotombol.mp3');

// Play opening audio
audioManager.play('opening');

'use strict';

angular.module('flappyBirdThreeJs')
  .service('soundService', function (ngAudio) {
    class SoundService {
            loadSounds(){
      					this.backgroundSound = ngAudio.load('assets/audio/Happy8bit.mp3');
      					this.backgroundSound.loop = true;
      					this.backgroundSound.volume = 0.1;
      					this.birdFlap = ngAudio.load('assets/audio/birdFlap.mp3');
      					this.collision = ngAudio.load('assets/audio/collision.mp3');
                this.backgroundSound.play();
            }

        }
        return new SoundService();
  });

define(['jquery', 'clamp', '../log', '../audio', 'mixedice', 'eventmap'], function($, clamp, Log, Audio, mixedice, EventMap) {
  'use strict';

  var AudioManager = function() {

    mixedice([this, AudioManager.prototype], new EventMap());
    this.audioFiles = {};
  };

  var volume = 1;
  // default

  Object.defineProperty(AudioManager, 'volume', {
    get : function() {
      return volume;
    },
    set : function(value) {
      volume = clamp(value, 0, 1);
    }
  });

  /**
   * Add a new sound file to be manager by lyria
   * @param {Object} options
   * @param {String} options.type - ['music', 'sound']
   * @param {String} options id - unique identifier for this audio file
   * @param {Boolean} options.loop - -1 if unlimited, else 0 if no looping and a positive number for n loops
   * @param {Number} options.volume - volume between 0..1
   * @param {Array} options.paths - paths to audio file with defined fallbacks
   *
   */
  AudioManager.prototype.add = function(options) {
    options = $.extend({
      'id' : '',
      'type' : 'sound',
      'loop' : false,
      'volume' : 1.0,
      'paths' : []
    }, options);

    // set volume in relation to current max volume
    options.volume *= volume;

    if (options.id === '') {
      Log.e('AudioManager.add: No id was given for new audio object');
      return;
    }

    this.audioFiles[options.id] = new Audio(options);
    this.trigger('added', options.id, this.audioFiles[options.id]);
    return this.audioFiles[options];
  };

  AudioManager.prototype.play = function(id, loop) {
    if (!this.audioFiles[id]) {
      Log.e('AudioManager.play: No audio element found under id ' + id);
      return;
    }
    
    $('#lyria-audio-' + id).off('ended');
    $('#lyria-audio-' + id).on('ended', {
      'audioFile' : this.audioFiles[id],
      'audioManager' : this,
      'id' : id
    }, function(event) {
      if (event.data.audioFile.attr('loop') > 0 || event.data.audioFile.attr('loop') === -1) {
        event.data.audioFile.play();
        event.data.audioManager.trigger('loopEnded', event.data.id, event.data.audioFile);
      } else {
        event.data.audioManager.trigger('ended', event.data.id, event.data.audioFile);
      }
    });
    
    this.audioFiles[id].play(loop);
    this.trigger('play', id, this.audioFiles[id]);
  };

  AudioManager.prototype.pause = function(id) {
    if (!this.audioFiles[id]) {
      Log.e('AudioManager.pause: No audio element found under id ' + id);
      return;
    }
    this.audioFiles[id].pause();
    this.trigger('paused', id, this.audioFiles[id]);
  };

  AudioManager.prototype.stop = function(id) {
    if (!this.audioFiles[id]) {
      Log.e('AudioManager.stop: No audio element found under id ' + id);
      return;
    }
    this.audioFiles[id].stop();
    // ended event should be triggered automatically
  };

  AudioManager.prototype.volume = function(id, volume) {
    if (!this.audioFiles[id]) {
      Log.e('AudioManager.volume: No audio element found under id ' + id);
      return;
    }
    if (volume) {
      this.audioFiles[id].volume = clamp(volume, 0, 1);
    } else {
      return this.audioFiles[id].volume;
    }
  };
  return AudioManager;
});

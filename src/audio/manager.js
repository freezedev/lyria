define(['jquery', 'clamp', 'lyria/log', 'lyria/audio', 'mixer', 'eventmap'], function($, clamp, Log, Audio, mixer, EventMap) {


  var AudioManager = function() {

    mixer([this, AudioManager.prototype], new EventMap());
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
   *
   * @param {Object} options
   * @param {String} options.type ['music', 'sound']
   * @param {String} options id
   * @param {Boolean} options loop
   * @param {Number} options volume
   * @param {Array} options paths paths to audio file with defined fallbacks
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

  AudioManager.prototype.play = function(id) {
    if (!this.audioFiles[id]) {
      Log.e('AudioManager.play: No audio element found under id ' + id);
      return;
    }
    this.audioFiles[id].play();
    this.trigger('play', id, this.audioFiles[id]);
    $('#' + id).one('ended', {
      'audioFile' : this.audioFiles[id],
      'id' : id
    }, function(event) {
      if (event.data.audioFile.attr('loop')) {
        event.data.audioFile.play();
      }
      this.trigger('ended', event.data.id, event.data.audioFile);
    });
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

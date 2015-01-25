define(['root', 'jquery'], function(root, $) {'use strict';

  /**
   * @module lyria/audio
   * @requires root
   * @requires jquery 
   */

  var supportedTypes = {
    'mp3' : 'audio/mpeg',
    'wav' : 'audio/wav',
    'ogg' : 'audio/ogg'
  };

  /**
   * Create a new html audio object managed by lyria
   *
   * @class
   * @alias module:lyria/audio
   *
   * @param {Object} options
   * @param {String} options.id - unique identifier for this audio file
   * @param {String[]} options.paths -  paths with different file types of the same audio file (fallback if browser doesnt support one)
   * @param {Number} options.volume - volume between 0..1
   * @param {Number} options.loop - -1 if unlimited, else 0 if no looping and a positive number for n loops
   */
  var Audio = function(options) {
    options = $.extend({
      'id' : '',
      'volume' : 1.0,
      'loop' : 1,
      'paths' : []
    }, options);
    this.options = options;
    this.audio = new window.Audio();
    for (var i = 0; i < options.paths.length; i++) {
      var fileExtension = options.paths[i].split('.').pop();

      if (supportedTypes[fileExtension] && this.audio.canPlayType(supportedTypes[fileExtension])) {
        this.audio.type = supportedTypes[fileExtension];
        this.audio.src = options.paths[i];
        break;
      }
    }
    this.audio.volume = options.volume;
    this.audio.id = 'lyria-audio-'+options.id;
    // Preloading is set to false, as this is handled by lyria/preloader
    this.audio.preload = 'none';
    $('body').append(this.audio);
  };

  /**
   *
   * @param {Number} loop - amount of loops this song should be played (-1 if unlimited)
   */
  Audio.prototype.play = function(loop) {
    // reset currentTime to 0 if already played
    if (this.audio.currentTime) {
      this.audio.currentTime = 0;
    }
    // reload audio file on chrome to be able to play an audio file more than once
    if (detectr.is('browser-chrome')) {
      this.audio.load();
    }
    if (loop != null) {
      this.options.loop = loop;
    }
    if (this.options.loop && this.options.loop > 0) {
      this.options.loop--;
    }
    this.audio.play();
  };

  Audio.prototype.pause = function() {
    this.audio.pause();
  };

  /**
   * Stop audio
   */
  Audio.prototype.stop = function() {
    this.options.loop = 1;
    this.audio.pause();
    // reset currentTime if it was already set
    if (this.audio.currentTime) {
      this.audio.currentTime = 0;
    }
  };

  /**
   * Sets or gets properties of the audio object
   *
   * @param {String} prop -  property to set or get
   * @param {*} [value] -  set value if passed
   */
  Audio.prototype.attr = function(prop, value) {
    switch (prop) {
      case 'duration':
      case 'length':
        return this.audio.duration;
      case 'position':
      case 'pos':
        if ( typeof value === 'undefined') {
          return this.audio.currentTime;
        } else {
          this.audio.currentTime = value;
        }
        break;
      case 'loop':
        if ( typeof value === 'undefined') {
          return this.options.loop;
        } else {
          this.options.loop = value;
        }
        break;
      case 'volume':
      case 'vol':
        if ( typeof value === 'undefined') {
          return this.audio.volume;
        } else {
          this.audio.volume = value;
        }
        break;
    }
  };

  return Audio;
});

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
   * @class
   * @alias module:lyria/audio
   *
   * @param {Object} options
   * @param {String} options.id
   * @param {String[]} options.paths
   * @param {Number} options.volume Volume between 0..1
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
    $('body').append(this.audio);
  };

  /**
   *
   * @param {String} loop amount of loops this song should be played (-1 if unlimited) 
   */
  Audio.prototype.play = function(loop) {
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

  Audio.prototype.stop = function() {
    this.options.loop = 1;
    this.audio.pause();
    this.audio.currentTime = 0;
  };

  /**
   * Sets or gets properties of the audio object
   *
   * @param {Object} prop
   * @param {Object} value (optional)
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

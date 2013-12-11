/**
 * @module Lyria
 */
define(['root', 'jquery'], function(root, $) {'use strict';

  var supportedTypes = {
    'mp3' : 'audio/mpeg',
    'wav' : 'audio/wav',
    'ogg' : 'audio/ogg'
  };

  var Audio = function(options) {
    options = $.extend({
      'id' : '',
      'type' : 'sound',
      'loop' : false,
      'volume' : 1.0,
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
  };

  Audio.prototype.play = function() {
    if (this.options.loop && typeof this.options.loop === 'number') {
      this.options.loop--;
    }
    this.audio.play();
  };

  Audio.prototype.pause = function() {
    this.audio.pause();
  };

  Audio.prototype.stop = function() {
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

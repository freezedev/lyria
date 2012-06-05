/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
var Lyria = Lyria || {};

/**
 * @class Lyria.Audio
 * This class creates an HTML5 audio element
 */
Lyria.Audio = function() {
	// Private audio element ID
	var audioElement,
	/**
	 * Loads one or multiple audio files
	 *
	 * @param {string} or {array} filename
	 */
	loadFromFile = function(filename) {
		if( typeof (filename) === "undefined")
			return;

		audioElement = document.createElement('audio');

		if( typeof (filename) === "object") {
			for(var i; i < filename.length; i++)
				$(audioElement).append('<source src="' + filename[i] + '" />');
		} else if( typeof (filename) === "string")
			audioElement.setAttribute('src', filename);

		audioElement.setAttribute('preload', 'auto');

	},
	/**
	 * Plays the audio file(s)
	 *
	 * @param {boolean} infinite (optional)
	 */
	play = function(infinite) {
		audioElement.addEventListener('ended', function() {
			if(infinite)
				this.currentTime = 0;
		}, false);

		audioElement.play();
	},
	/**
	 * Pauses the audio file
	 */
	pause = function() {
		audioElement.pause();
	},
	/**
	 * Stops playing the audio file
	 */
	stop = function() {
		audioElement.pause();
		audioElement.currentTime = 0;
	},
	/**
	 * Get the length of the sound file
	 */
	getLength = function() {
		return audioElement.duration;
	},
	/**
	 * Sets or gets the volume of the audio file
	 *
	 * @param {number} value
	 */
	volume = function(value) {
		if( typeof (value) === "number")
			audioElement.volume = value;
		else
			return audioElement.volume;
	},
	/**
	 * Sets or gets the position of the audio file
	 *
	 * @param {number} value
	 */
	pos = function(value) {
		if( typeof (value) === "number")
			audioElement.currentTime = value;
		else
			return audioElement.currentTime;
	},
	/**
	 * Sets or gets properties of the audio object
	 * TODO: Method chaining
	 *
	 * @param {Object} prop
	 * @param {Object} value (optional)
	 */
	attr = function(prop, value) {
		switch (prop) {
			case 'duration':
			case 'length': {
				return getLength();

				break;
			}

			case 'position':
			case 'pos': {
				if( typeof (value) === "undefined")
					return pos();
				else
					pos(value);

				break;
			}

			case 'volume': {
				if( typeof (value) === "undefined")
					return volume();
				else
					volume(value);

				break;
			}
		}
	};

	return {
		loadFromFile: loadFromFile,
		play: play,
		pause: pause,
		stop: stop,

		getLength: getLength,
		volume: volume,
		pos: pos,
		attr: attr
	};
}

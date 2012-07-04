/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
;(function(Lyria, undefined) {
	
	/**
	 * @class Lyria.Audio
	 * This class creates an HTML5 audio element
	 * 
	 * @example
	 * 	var sound = new Lyria.Audio();
	 *	sound.addAudioElement('carousel', {
	 *	     filepath : 'assets/audio/444143_Carousel.mp3',
	 *		 loop : false,
	 *		 play : false
	 *	});
	 *	sound.addAudioElement('wind', {
	 *		 filepath : 'assets/audio/wind.wav',
	 *		 playAfter : 'carousel',
	 *		 loop : true,
	 *		 play : true
	 *	});
	 */
	Lyria.Audio = function() {
		
		/**
		 * Private audio elements 
		 * 
		 * @example : {
		 * 	filepath : 'assets/audio/example.ogg',
		 *  playAfter : 'example2',
		 *  loop : false,
		 *  play : false
		 * }
		 */
		var audioElements = {},
		/**
		 * Loads one or multiple audio files
		 * @param {strin} 
		 * 		id			identifier of this sound (has to be unique!)
		 * @param {object}
		 * 		filepath	filepath of the sound
		 * 		playAfter	should sth be played after this sound has ended
		 * 		loop		loop this sound
		 * 		play		should this sound be played immediatelly?
		 */
		addAudioElement = function(id, fileObj) {
			if (!fileObj || typeof (fileObj) != 'object')
				return;
			var audioElement = document.createElement('audio');
			audioElements[id] = fileObj;
			$(audioElement).attr('id', id);
			$(audioElement).attr('preload', 'auto');
			$(audioElement).append('<source src="' + fileObj.filepath + '" />');
			
			$('body').append(audioElement);
			if (fileObj.play) {
				this.play(id);
			}
		},
		/**
		 * Plays the audio file 
		 *
		 * @param {string} element idenfifier
		 */
		play = function(elem) {
			var sound = audioElements[elem];
			$('#'+elem).off();
			$('#'+elem).on('ended', {audioManager: this}, function(event) {
				if (window.chrome) $(this).load()
				else $(this).currentTime = 0;
				
				var id = $(this).attr('id');
				var sound = event.data.audioManager.getSound(id);
				if (sound.playAfter) {
					event.data.audioManager.play(sound.playAfter)
				}
				if (sound.loop) {
					event.data.audioManager.play($(this).attr('id'));
				}
			});
			$('#'+elem)[0].play();
		},
		/**
		 * Get the audio file object
		 *
		 * @param {string} element idenfifier
		 */
		getSound = function(elem) {
			return audioElements[elem];
		}
		/**
		 * Pauses the audio file
		 * 
		 * @param {string} element idenfifier
		 */
		pause = function(elem) {
			$('#'+elem)[0].pause();
		},
		/**
		 * Stops playing the audio file
		 * 
		 * @param {string} element idenfifier
		 */
		stop = function(elem) {
			$('#'+elem)[0].pause();
			$('#'+elem)[0].currentTime = 0;
		},
		/**
		 * Get the length of the sound file
		 * 
		 * @param {string} element idenfifier
		 */
		getLength = function(elem) {
			return $('#'+elem)[0].duration;
		},
		/**
		 * Sets or gets the volume of the audio file
		 *
		 * @param {string} element idenfifier
		 * @param {number} value
		 */
		volume = function(elem, value) {
			if( typeof (value) === "number")
				$('#'+elem)[0].volume = value;
			else
				return $('#'+elem)[0].volume;
		},
		/**
		 * Sets or gets the position of the audio file
		 *
		 * @param {string} element idenfifier
		 * @param {number} value
		 */
		pos = function(elem, value) {
			if( typeof (value) === "number")
				$('#'+elem)[0].currentTime = value;
			else
				return $('#'+elem)[0].currentTime;
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
			addAudioElement: addAudioElement,
			play: play,
			getSound: getSound,
			pause: pause,
			stop: stop,
	
			getLength: getLength,
			volume: volume,
			pos: pos,
			attr: attr
		};
	}
	
})(window.Lyria = window.Lyria || {});

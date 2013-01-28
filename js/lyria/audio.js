/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
;(function(Lyria, undefined) {
	'use strict';
	
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
		var muted = false;
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
		var audioElements = {};
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
		var addAudioElement = function(id, fileObj) {
			if (!fileObj || typeof (fileObj) !== 'object')
				return;
			var audioElement = document.createElement('audio');
			audioElements[id] = fileObj;
			$(audioElement).attr('id', id).attr('preload', 'auto').append('<source src="' + fileObj.filepath + '" />');
			
			$('body').append(audioElement);
			if (fileObj.play) {
				this.play(id);
			}
		};
		var removeAudioElement = function(id) {
			if (!id || typeof (fileObj) != 'string')
				return;
			$('#'+id).remove();
			console.log('Lyria.audio.removeAudioElement: '+ id + ' removed');
		};
		/**
		 * Plays the audio file 
		 *
		 * @param {string} element identifier
		 */
		var play = function(elem) {
			var sound = audioElements[elem];
			$('#'+elem).one('ended', {audioManager: this}, function(event) {
				if (window.chrome) $(this).load()
				else $(this).currentTime = 0;
				
				var id = $(this).attr('id');
				var sound = event.data.audioManager.getSound(id);
				// only play after song defined in playAfter if song is initialized
				if (sound.playAfter && $('#'+sound.playAfter).length > 0) {
					event.data.audioManager.play(sound.playAfter)
				}
				if (sound.loop) {
					event.data.audioManager.play($(this).attr('id'));
				}
			});
			$('#'+elem)[0].play();
			if (muted) {
                $('#'+elem)[0].volume = 0;
            }
		};
		/**
		 * Get the audio file object
		 *
		 * @param {string} element identifier
		 */
		var getSound = function(elem) {
			return audioElements[elem];
		};
		/**
		 * Pauses the audio file
		 * 
		 * @param {string} element identifier
		 */
		var pause = function(elem) {
		    if ($('#'+elem).length > 0) {
		        $('#'+elem)[0].pause();
		    } else {
		        console.log('error', 'Lyria.Audio.pause: cant finde element '+elem+' to pause');
		    }
		};
		/**
		 * Stops playing the audio file
		 * 
		 * @param {string} element identifier
		 */
		var stop = function(elem) {
		    if ($('#'+elem).length > 0 && $('#'+elem)[0] && $('#'+elem)[0].pause) {
                $('#'+elem)[0].pause();
                $('#'+elem)[0].currentTime = 0;
		    }
		};
		/**
		 * Get the length of the sound file
		 * 
		 * @param {string} element identifier
		 */
		var getLength = function(elem) {
			return $('#'+elem)[0].duration;
		};
		/**
		 * Sets or gets the volume of the audio file
		 *
		 * @param {string} element identifier
		 * @param {number} value (between 0 .. 1)
		 */
		var volume = function(elem, value) {
		    if ($('#'+elem).length >0) {
                if( typeof (value) === "number")
                    $('#'+elem)[0].volume = value;
                else
                    return $('#'+elem)[0].volume;   
		    } else {
		        return 0;
		    }

		};
		/**
		 * Sets or gets the position of the audio file
		 *
		 * @param {string} element identifier
		 * @param {number} value
		 */
		var pos = function(elem, value) {
			if( typeof (value) === "number")
				$('#'+elem)[0].currentTime = value;
			else
				return $('#'+elem)[0].currentTime;
		};
		/**
		 * Sets or gets properties of the audio object
		 * TODO: Method chaining
		 *
		 * @param {Object} prop
		 * @param {Object} value (optional)
		 */
		var attr = function(prop, value) {
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
		
		/**
		 * Mute all sound of the game
         * @param {boolean} value
		 */
		var muteSounds = function(value) {
            muted = value;
            for (var i in audioElements) {
               if (audioElements.hasOwnProperty(i)) {
                  if ($('#'+i).length > 0) {
                      $('#'+i)[0].volume = value ? 0 : 1; 
                  }
               }
            }
        };
	
		return {
			addAudioElement: addAudioElement,
			removeAudioElement: removeAudioElement,
			play: play,
			getSound: getSound,
			pause: pause,
			stop: stop,
			muteSounds: muteSounds,
	
			getLength: getLength,
			volume: volume,
			pos: pos,
			attr: attr
		};
	}
	
})(window.Lyria = window.Lyria || {});

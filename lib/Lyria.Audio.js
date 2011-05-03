if (typeof Lyria === 'undefined') var Lyria = {};

Lyria.Audio = function()
{
	var
	_audioElement,
	
	loadFromFile = function(filename)
	{
		if (typeof(filename) === "undefined") return;
		
		_audioElement = document.createElement('audio');
		
		if (typeof(filename) === "object")
		{
			for (var i; i < filename.length; i++)
				$(_audioElement).append('<source src="' + filename[i] + '" />');
		}
		else
			if (typeof(filename) === "string")
				_audioElement.setAttribute('src', filename);
			
		_audioElement.setAttribute('preload', 'auto');
		
	},
	
	play = function(infinite)
	{
		_audioElement.addEventListener('ended', function()
		{ 
			if (infinite) this.currentTime = 0;
		}, false);
		
		_audioElement.play();
	},
	
	pause = function()
	{
		_audioElement.pause();
	},
	
	stop = function()
	{
		_audioElement.pause();
		_audioElement.currentTime = 0;
	},
	
	getLength = function()
	{
		return _audioElement.duration;
	},
	
	volume = function(value)
	{
		if (typeof(value) === "number")
			_audioElement.volume = value;
		else
			return _audioElement.volume;
	},
	
	pos = function(value)
	{
		if (typeof(value) === "number")
			_audioElement.currentTime = value;
		else
			return _audioElement.currentTime;
	},
	
	attr = function(prop, value)
	{
		switch (prop)
		{
			case 'duration':
			case 'length':
			{
				return getLength();
				
				break;
			}
			
			case 'position':
			case 'pos':
			{
				if (typeof(value) === "undefined") return pos();
				else pos(value);
				
				break;
			}
			
			case 'volume':
			{
				if (typeof(value) === "undefined") return volume();
				else volume(value);
				
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

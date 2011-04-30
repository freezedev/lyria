// http://jsperf.com/javascript-trunc
function trunc(number) { return (number | 0); }

// Format string, something we need quite often
String.prototype.format = function()
{
    var formatted = this;
    for (var i = 0; i < arguments.length; i++)
    {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

function getUrlParam(name)
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}



Lyria.Platform = function()
{
	var
	Browser = 
	{
		get: function() { return navigator.userAgent; },
		getName: function() { return navigator.appName; },
		getVersion: function() { return navigator.appVersion; }
	},
	
	getName = function()
	{
		return navigator.platform;
	},
	
	is = function(value)
	{
		if (typeof(value) === "undefined") return;
		
		switch (value.toLowerCase())
		{
			case '32bit':
			case '32-bit': break;
			
			case '64bit':
			case '64-bit': return (navigator.platform.match(/x86_64/i)); break;
			
			case 'ios': return (is('iphone') || is('ipod') || is('ipad')); break; 
			
			case 'iphone': return navigator.userAgent.match(/iPhone/i); break;
			
			case 'ipod': return navigator.userAgent.match(/iPod/i); break;
			
			case 'ipad': return navigator.userAgent.match(/iPad/i); break;
			
			case 'android': return navigator.userAgent.match(/Android/i); break;
			
			case 'bada': return navigator.userAgent.match(/Bada/i); break;
			
			case 'webos': return navigator.userAgent.match(/webOS/i); break;
			
			case 'mobile': return (is('android') || is('bada') || is('webos') || is('ios')); break;
			
			case 'desktop': return !(is('mobile')); break;
		}
	},
	
	isMobile = function()
	{
		return is('mobile');
	},
	
	getLanguage = function()
	{
		return navigator.language;
	};
	
	return {
		Browser: Browser,
		getName: getName,
		is: is,
		isMobile: isMobile,
		getLanguage: getLanguage
	};
}();

Lyria.Screen = function()
{
	var
	getWidth = function()
	{
		return $(window).width();
	},
	
	getHeight = function()
	{
		return $(window).height();
	};
	
	return {
		getWidth: getWidth,
		getHeight: getHeight
	}
}();

Lyria.Cursor = function()
{
	var
	
	pos = function(postype)
	{
		switch (postype)
		{
			case 'left':
			case 'x':
			{
				break;
			}
			
			case 'top':
			case 'y':
			{
				break;
			}
			
			case 'right':
			{
				break;
			}
			
			case 'bottom':
			{
				break;
			}
			
			default:
			{
				break;
			}
		}
	};
	
	return {
		pos: pos
	};
}();

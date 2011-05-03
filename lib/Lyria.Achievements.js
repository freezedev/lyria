if (typeof Lyria === 'undefined') var Lyria = {};

// Achievement "Singleton": Revealing module pattern
Lyria.Achievements = function()
{
	//Private object "array" stores all achievements
	var array = {},
		_localStorageKey,
	
	initialize = function(localStorageKey)
	{
		// Saves localStorage key internally
		_localStorageKey = localStorageKey;
	
		// Loads achievements from local storage if any
		if (window.localStorage)
			if ((typeof(window.localStorage[_localStorageKey]) != "undefined") && (window.localStorage[_localStorageKey] != null) && (window.localStorage[_localStorageKey] != "")) array = JSON.parse(window.localStorage[_localStorageKey]);
	},
	
	register = function(text, description, icon)
	{
		array[text] = { active: false };
		if (typeof(description) !== "undefined") array[text]["description"] = description;
		if (typeof(icon) !== "undefined") array[text]["icon"] = icon;
	},
	
	getCount = function()
	{
		var count = 0;
		for (var i in array) count++;
		return count;
	}
	
	getUnlockedCount = function()
	{
		var count = 0;
		for (var i in array)
		{
			if (array[i]["active"]) count++;
		}
		return count;
	}
	
	list = function()
	{
		// Locked achievements will be shown in a grey-ish color
		var result = "";
		for (var i in array)
		{
			if (array[i]["active"]) result += '<div class="ach_box unlocked"><span class="ach_unlocked">' + i + '</span><br /><span class="ach_details">' + array[i]["description"] + '</span></div><br /><br />';
			else result += '<div class="ach_box locked"><span class="ach_locked">' + i + '</span><br /><span class="ach_details">' + array[i]["description"] + '</span></div><br /><br />';
		}
		
		return result;
	}
	
	show = function(text)
	{
		// If someone forget to register an achievement
		if (array[text] === "undefined") register(text);
	
		if (!array[text]["active"])
		{
			if ((typeof(array[text].icon) != "undefined") && (array[text].icon != "")) $('#achievement_box').css("background-image", "url(" + array[text].icon + ")");
			
			
			$('#ach_text').html(text);
			$('#achievement_box').css({opacity: 0.0});
			
			$('#achievement_box').animate({opacity: 1.0, bottom: '8px'}, 750);
			
			setTimeout(function() 
			{ 
			  $('#achievement_box').animate({opacity: 0.0, bottom: '-80px'}, 750);
			}, 2500);
			
			array[text].active = true;
		}
		
		if (window.localStorage) window.localStorage[_localStorageKey] = JSON.stringify(array);
	};
	
	return {
		initialize: initialize,
		getCount: getCount,
		getUnlockedCount: getUnlockedCount,
		list: list,
		register: register,
		show: show
	};
}();

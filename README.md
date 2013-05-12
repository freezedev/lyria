Lyria.js
========
Lightweight prototyping javascript game framework based on jQuery. 

The Lyria template can be found here: https://github.com/freezedev/lyria-template

What do I need?
---------------
All libraries are included in the repository, so you don't need to worry about browsing the internet and downloading the libraries you need.

* [jQuery](http://jquery.com/) 2.0 or higher
* [Modernizr](http://modernizr.com/)
* [Handlebars.js](http://handlebarsjs.com/)
* detectr
* checkt


What does it look like?
-----------------------

The core of it all is the scene manger. (The scene manger in Lyria.js is quite similar to the one in [Elysion](https://github.com/freezedev/elysion).)  
If you are coming from a game developer background, you may already know what a scene is. A scene in a game enviroment can be a main menu, a settings screen or the game itself. Or in 2D point-and-click-adventure, a scene can by any location the character is traveling to.  
So in Lyria.js a scene is that as well, but seperated in a markup file, a data file and localization JSON file. Templating is build in through Handlebars.js.

```javascript
Lyria.SceneManager.add('myScene');
Lyria.SceneManager.show('myScene');
```

Our scene called myScene might look this:  

**1) scene.html**  
The markup of the scene  

```html
{{#someText}}
	<span>{{someText}}</span>
{{/someText}}

{{#buttons}}
	<div id="{{id}}">{{caption}}</div>
{{/buttons}}
```

**2) scene.js**  
The data section of a scene. You can use it to prepare data you want to display, calculate stuff or directly set the variables you want to show in the template.

```javascript
(function(sender, localization) {
	
	var buttonArray = [];
	var button1 = "button1";
	var button2 = "button2";

	buttonArray.push({id: button1, caption: localization[button1]});
	buttonArray.push({id: button2, caption: localization[button2]});

	return {
		someText: 'Hello there.',
		buttons: buttonArray
	};
})(sender, localization);
```

**3) localization.json**  
Contains localized strings as a JSON file

```json
{
	"en": {
		"button1": "This is the first button.",
		"button2": "This is the second button."
	},
	"de": {
		"button1": "Das ist der erste Button.",
		"button2": "Das ist der zweite Button."
	}
}
```

The result will look this:

```html
<span>Hello there.</span>

<div id="button1">This is the first button.</div>
<div id="button2">This is the second button.</div>
```

Assuming you opened the web application in a browser with an english language pack. Opening the page in a browser with a german language pack will show this:

```html
<span>Hello there.</span>

<div id="button1">Das ist der erste Button.</div>
<div id="button2">Das ist der zweite Button.</div>
```

If the page is opened with a browser in a language that is not supported (i.e. not defined in localization.json) the english version will be displayed, as english is the default fallback language in Lyria.


Of course, this only a simple example of what you can do with scenes. You can also add partials, helper functions and directly bind events to elements.


If you are already have worked with the [CouchDB eventlys](https://github.com/jchris/evently), this concept might feel very familiar to you.


How do I get started?
---------------------

You are already half-way there. Either download the latest stable version, the current development version if you are feeling adventurous or clone this repository.  
Head on over to the [wiki](https://github.com/freezedev/Lyria.js/wiki) to have step by step instructions on how to use this framework.


What does Lyria mean?
---------------------
* It's "freedom" in albanian (free as in not proprietary, free as in open-source)
* It's also a reference to Lyrium from Bioware's Dragon Age series, in which Lyrium is the essence for magic
* It's a reference to Illyria, a powerful being from the TV series Angel
	

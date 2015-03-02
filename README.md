Lyria
=====
[![Build Status](https://travis-ci.org/freezedev/lyria.png?branch=master)](https://travis-ci.org/freezedev/lyria)
[![Dependency Status](https://david-dm.org/freezedev/lyria.png)](https://david-dm.org/freezedev/lyria)
[![devDependency Status](https://david-dm.org/freezedev/lyria/dev-status.png)](https://david-dm.org/freezedev/lyria#info=devDependencies)
[![bitHound Score](https://www.bithound.io/freezedev/lyria/badges/score.svg)](https://www.bithound.io/freezedev/lyria)

Lyria is a jQuery game framework.

The Lyria template can be found here: https://github.com/freezedev/lyria-template

Getting Lyria
-------------

If you have Bower installed, simply do:
`bower install lyria`  
(If you don't have bower installed, simply do a `npm install -g bower` in the command-line of your choice. To learn more about Bower, go to http://bower.io)
If you want to save lyria in your `bower.json` file, use `bower install lyria --save`.

If you have Yeoman installed, you can actually just type `yo lyria` in the terminal when inside an empty folder. This will automatically get the lyria template and get you started.


What does it look like?
-----------------------

First create a new game object.

```javascript
define('mygame', ['lyria/game'], function(Game) {
  var myGame = new Game();
});
```

Lyria uses AMD modules extensively and it is very much recommended to use the AMD pattern for organizing your game as well.

Every game object (as in a `lyria/game` instance, not an actual game object) has a scene manager, a viewport and a preloader. The core of it all is the scene manger. (The scene manger in Lyria.js is quite similar to the one in [Elysion](https://github.com/freezedev/elysion).)  
If you are coming from a game developer background, you may already know what a scene is. A scene in a game enviroment can be a main menu, a settings screen or the game itself. Or in 2D point-and-click-adventure, a scene can by any location the character is traveling to.  
So in Lyria a scene is that as well, but seperated in a markup file, a data file and localization JSON file. Templating is build in through Handlebars.

```javascript
define('mygame', ['lyria/game'], function(Game) {
  var myGame = new Game();
  
  myGame.director.add('myScene');
});
```

Our scene called `myScene` might look this:  

**1) scene.html**  
The markup of the scene  

```html
{{#if someText}}
	<span>{{someText}}</span>
{{/if someText}}

{{#each buttons}}
	<div id="{{id}}">{{caption}}</div>
{{/each buttons}}
```

**2) scene.js**  
The data section of a scene. You can use it to prepare data you want to display, calculate stuff or directly set the variables you want to show in the template.

```javascript
(function() {

  var self = this;
  
  var buttonArray = [];
  var button1 = "button1";
  var button2 = "button2";

  buttonArray.push({id: button1, caption: self.t(button1)});
  buttonArray.push({id: button2, caption: self.t(button2)});

  // Expose these values to the template engine
  this.expose({
    buttons: buttonArray,
    someText: 'Hello there.'
  });
  
  // Bind events to the scene using our good friend jQuery
  this.bindEvents({
    'span': {
      click: function() {
        alert($(this).text());
      }
    }
  });

}).call(this);
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

If the page is opened with a browser in a language that is not supported (i.e. not defined in `localization.json`) the english version will be displayed, as english is the default fallback language in Lyria.


Of course, this only a simple example of what you can do with scenes. You can also add partials, helper functions and directly bind events to elements.


How do I get started?
---------------------

You are already half-way there. Either download the latest stable version, the current development version if you are feeling adventurous or clone this repository.  
Head on over to the [wiki](https://github.com/freezedev/lyria/wiki) to have step by step instructions on how to use this framework.


License
-------
Lyria is public domain. If this doesn't suit you, feel free to use it under the terms of the MIT license.


What does Lyria mean?
---------------------
* It's "freedom" in albanian (free as in not proprietary, free as in open-source)
* It's also a reference to Lyrium from Bioware's Dragon Age series, in which Lyrium is the essence for magic
* It's a reference to Illyria, a powerful being from the TV series Angel
	


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/freezedev/lyria/trend.png)](https://bitdeli.com/free "Bitdeli Badge")


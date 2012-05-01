/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
var Lyria = Lyria || {};

/**
 * @class Lyria.Utils
 * Utils class
 */
Lyria.UI = {};

Lyria.UI.Button = function(element, options) {
	if(!element)
		return;

	var defaultOptions = {
		caption: '',
		buttonClass: 'button',
		onClick: function(event) {
		},
		onMouseOver: function(event) {
		},
		onMouseOut: function(event) {
		}
	};
	options = $.extend(true, defaultOptions, options);

	elementObj = (options.element instanceof jQuery) ? options.element : $(element);

	elementObj.addClass(options.buttonClass);
	if(options.caption) {
		elementObj.html('<span>' + options.caption + '</span>');
	}
	
	// Kill previously binded event listeners
	//element.off();
	
	// Bind the events
	//element.on
}

Lyria.UI.Lightbox = {

}



Lyria.UI.Dialog = {
	
}

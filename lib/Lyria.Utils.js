/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
var Lyria = Lyria || {};

/**
 * @class Lyria.Utils
 * Utils class
 */
Lyria.Utils = {};

Lyria.Utils.isArray = function(object) {
	if(Object.prototype.toString.call(object) === '[object Array]') {
		return true;
	} else {
		return false;
	}
}

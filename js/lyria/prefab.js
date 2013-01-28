/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
;(function(Lyria, $, undefined) {
	'use strict';

	Lyria.Prefab = function(prefabName, options) {
		
		var defaultOptions = {
			target: null,
			template: 'prefab.html',
			data: 'prefab.js',
			path: 'prefab',
			isPrefab: true
		};
		
		options = $.extend(true, defaultOptions, options);
		
		return Lyria.Scene(prefabName, options);
		
	}

})(this.Lyria = this.Lyria || {}, this.jQuery);
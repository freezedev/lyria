/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/prefab', ['jquery', 'lyria/scene'], function($, Scene) {
	'use strict';

	//Lyria.Prefab
	return function(prefabName, options) {
		
		var defaultOptions = {
			target: null,
			template: 'prefab.html',
			data: 'prefab.js',
			path: 'prefab',
			isPrefab: true
		};
		
		options = $.extend(true, defaultOptions, options);
		
		return new Scene(prefabName, options);
		
	};
  
});
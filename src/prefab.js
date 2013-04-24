/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/prefab', ['lyria/scene', 'jquery'], function(scene, $) {
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
		
		return Lyria.Scene(prefabName, options);
		
	};
  
});
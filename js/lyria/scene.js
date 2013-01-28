/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
;(function(Lyria, $, undefined) {
	'use strict';

  Lyria.SceneNew = function(sceneName, sceneFunction, options) {
    if (!sceneName) {
      return;
    }
    
    var defaultOptions = {
      target: '#' + sceneName,
      template: 'scene.html',
      path: 'scene',
      partials: {},
      helpers: {},
      localization: 'localization.json',
      parent: null,
      route: '/' + sceneName,
      isPrefab: false,
      name: sceneName
    };
    
    options = $.extend(true, defaultOptions, options);
    
    var deferTemplate = $.Deferred(function(defer) {
      
    });
    
    var deferLoc = $.Deferred(function(defer) {
      
    });
    
  }

	/**
	 * 
	 * @param {Object} sceneName
	 * @param {Object} options
	 */
	Lyria.Scene = function(sceneName, options) {
		if(!sceneName) {
			return;
		}
	
		var defaultOptions = {
			target: '#' + sceneName,
			template: 'scene.html',
			data: 'scene.js',
			path: 'scene',
			partials: {},
			helpers: {},
			localization: 'localization.json',
			parent: null,
			route: '/' + sceneName,
			name: sceneName,
			transition: {
				effect: '',
				length: 0
			},
			init: function() {
			},
			render: function() {
			},
			update: function(dt) {
			},
			resize: function(width, height) {
			},
			onActive: function() {
				
			},
			onDeactivated: function() {
				
			}
		};
		options = $.extend(true, defaultOptions, options);
	
		var scenePath = Lyria.Resource.path[options.path] + '.' + sceneName;
		var templateMarkup = "";
		var generatedMarkup = "";
		var dataObj = {};
		var partialObj = {};
		var helperObj = {};
		var localizationObj = {};
		var targetObj = null;
		var eventsObj = {};
	
		function buildTemplateObject(inputObject, templateOptions) {
			var templateDefaultOptions = {
				evaluateInput: false,
				argObject: {},
				dataType: 'json'
			}
			templateOptions = $.extend(true, templateDefaultOptions, templateOptions);
	
			var outputObject = {};
			
			
			var senderObject = {
				target: options.target,
				template: options.template,
				data: options.data,
				parent: options.parent,
				localization: options.localization,
				route: options.route,
				name: options.name,
				asObject: $('#' + options.name),
				getData: function(assetName, options) {
					var defaultOptions = {
						async: false,
						dataType: 'json',
						success: function() {}
					}
					
					options = $.extend(defaultOptions, options);
					
					
				},
				get model() {
					
				}
			};
	
			Lyria.Utils.isObjectOrString(inputObject, function(arg) {
				$.each(arg, function(key, value) {
					if(Lyria.Utils.isFile(value)) {
						$.ajax({
							url: Lyria.Resource.name(value, scenePath),
							// Needs to synchronous as we don't really know when the different files are
							// ready for us
							async: false,
							dataType: templateOptions.dataType,
							success: function(data) {
								if(templateOptions.evaluateInput) {
									templateOptions.argObject = options.argObject || {};
									
									var functionData = 'return ' + data;
									
									outputObject[key.split('.')[0]] = (new Function('sender', 'localization', functionData))(senderObject, templateOptions.argObject);
								} else {
									outputObject[key.split('.')[0]] = data;
								}
							}
						});
					} else {
						outputObject[key] = value;
					}
				});
			}, function(arg) {
				if(Lyria.Utils.isFile(arg)) {
					$.ajax({
						url: Lyria.Resource.name(arg, scenePath),
						// Needs to synchronous as we don't really know when the different files are
						// ready for us
						async: false,
						dataType: templateOptions.dataType,
						success: function(data) {
							if(templateOptions.evaluateInput) {
								templateOptions.argObject = templateOptions.argObject || {};
								
								var functionData = 'return ' + data;
								
								outputObject = (new Function('sender', 'localization', functionData))(senderObject, templateOptions.argObject);
							} else {
								outputObject = data;
							}
						}
					});
				}
			});
	
			return outputObject;
		}
	
		partialObj = buildTemplateObject(options.partials);
		helperObj = buildTemplateObject(options.helpers);
	
		// Check for localization
		localizationObj = Lyria.Localization(Lyria.Resource.name(options.localization, scenePath)).get();
	
		dataObj = buildTemplateObject(options.data, {
			evaluateInput: true,
			argObject: localizationObj,
			dataType: 'text'
		});
	
		// Transfer init, resize, render and update functions
		if (dataObj) {
			if (dataObj.init && (typeof dataObj.init === "function")) {
				options.init = dataObj.init;
				delete dataObj.init;
			}
			
			if (dataObj.render && (typeof dataObj.render === "function")) {
				options.render = dataObj.render;
				delete dataObj.render;
			}
			
			if (dataObj.update && (typeof dataObj.update === "function")) {
				options.update = dataObj.update;
				delete dataObj.update;
			}
			
			if (dataObj.resize && (typeof dataObj.resize === "function")) {
				options.resize = dataObj.resize;
				delete dataObj.resize;
			}
			
			if (dataObj.onActive && (typeof dataObj.onActive === "function")) {
				options.onActive = dataObj.onActive;
				delete dataObj.onActive;
			}
			
			if (dataObj.onDeactivated && (typeof dataObj.onDeactivated === "function")) {
				options.onDeactivated = dataObj.onDeactivated;
				delete dataObj.onDeactivated;
			}
		}
	
	
		// Get markup
		if(Lyria.Utils.isFile(options.template)) {
			$.ajax({
				url: Lyria.Resource.name(options.template, scenePath),
				dataType: 'text',
				error: function(err) {
					
				},
				success: function(data) {
					templateMarkup = data;
	
					// Put 'em all together
					var template = Handlebars.compile(templateMarkup);
	
					var templateOptions = {};
					if(!$.isEmptyObject(helperObj)) {
						templateOptions['helpers'] = helperObj;
					}
					if(!$.isEmptyObject(partialObj)) {
						templateOptions['partials'] = partialObj;
					}
	
					// Extract events
					if (dataObj && dataObj.events) {
						eventsObj = dataObj.events;
						delete dataObj.events;
					}
					
					generatedMarkup = template(dataObj, templateOptions);
	
					if(options.target) {
						targetObj = (options.target instanceof jQuery) ? options.target : $(options.target);
						targetObj.html(generatedMarkup);
					} else {
						return generatedMarkup;
					}
	
					// Bind events
					if(eventsObj) {
					  if (options.isPrefab) {
  						eventsObj.delegate = (options.target) ? options.target : 'body';					    
					  } else {
					    eventsObj.delegate = '#' + sceneName;
					  }
	
						$.each(eventsObj, function(key, value) {
							if(( typeof value === "object") && (key !== "delegate")) {
								
								// Check global event map and re-bind events
								$.each(value, function(eventKey, eventValue) {
								  if (Lyria.EventMap && Lyria.EventMap[eventKey] && (typeof Lyria.EventMap[eventKey] === "object")) {
								  	
								  	//console.log(Lyria.EventMap[eventKey]);
								  	
								  	$.each(Lyria.EventMap[eventKey], function(eventMapKey, eventMapValue) {
										console.log(eventMapKey);
										console.log(eventMapValue);
									  });
								  }
								  
								});
								
								$(eventsObj.delegate).on(value, key);
							}
						});
					}
	
					// Call init procedure
					options.init();
					
					// Add resize event
					$(window).resize(function() {
						options.resize($(window).width(), $(window).height());
					});
	

					return {
						name: sceneName,
						route: options.route,
						transition: options.transition,
						init: options.init,
						render: options.render,
						update: options.update,
						resize: options.resize,
						onActive: options.onActive,
						onDeactivated: options.onDeactivated
					};
	
				}
			});
	
		} 
		
		if (options.path !== "prefab") {
			return {
				name: sceneName,
				route: options.route,
				transition: options.transition,
				init: options.init,
				render: options.render,
				update: options.update,
				resize: options.resize,
				onActive: options.onActive,
				onDeactivated: options.onDeactivated
			};			
		}
		
	}
	
})(this.Lyria = this.Lyria || {}, this.jQuery);

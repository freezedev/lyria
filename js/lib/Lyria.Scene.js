/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
var Lyria = Lyria || {};

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
		template: sceneName + '.html',
		data: sceneName + '.js',
		partials: {},
		helpers: {},
		localization: 'localization.json',
		route: '/' + sceneName,
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
		onSceneActive: function() {
			
		},
		onSceneDeactivated: function() {
			
		}
	};
	options = $.extend(true, defaultOptions, options);

	var scenePath = Lyria.Resource.path['scene'] + '.' + sceneName;
	var templateMarkup = "";
	var generatedMarkup = "";
	var dataObj = {};
	var partialObj = {};
	var helperObj = {};
	var localizationObj = {};
	var targetObj = null;
	var eventsObj = {};

	function buildTemplateObject(inputObject, options) {
		var defaultOptions = {
			evaluateInput: false,
			argObject: {},
			dataType: 'json'
		}
		options = $.extend(true, defaultOptions, options);

		var outputObject = {};

		Lyria.Utils.isObjectOrString(inputObject, function(arg) {
			$.each(arg, function(key, value) {
				if(Lyria.Utils.isFile(value)) {
					$.ajax({
						url: Lyria.Resource.name(value, scenePath),
						// Needs to synchronous as we don't really know when the different files are
						// ready for us
						async: false,
						dataType: options.dataType,
						success: function(data) {
							if(options.evaluateInput) {
								options.argObject = options.argObject || {};
								outputObject[key.split('.')[0]] = (new Function('return (' + data + ')("' + sceneName + '",' + JSON.stringify(options.argObject) + ')'))();
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
					dataType: options.dataType,
					success: function(data) {
						if(options.evaluateInput) {
							options.argObject = options.argObject || {};
							outputObject = (new Function('return (' + data + ')("' + sceneName + '",' + JSON.stringify(options.argObject) + ')'))();
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
	
	if (dataObj.onSceneActive && (typeof dataObj.onSceneActive === "function")) {
		options.onSceneActive = dataObj.onSceneActive;
		delete dataObj.onSceneActive;
	}
	
	if (dataObj.onSceneDeactivated && (typeof dataObj.onSceneDeactivated === "function")) {
		options.onSceneDeactivated = dataObj.onSceneDeactivated;
		delete dataObj.onSceneDeactivated;
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
				if (dataObj.events) {
					eventsObj = dataObj.events;
					delete dataObj.events;
				}

				generatedMarkup = template(dataObj, templateOptions);

				if(options.target) {
					targetObj = (options.target instanceof jQuery) ? options.target : $(options.target);
					targetObj.html(generatedMarkup);
				}

				// Bind events
				if(eventsObj) {
					eventsObj.delegate = (options.target) ? options.target : 'body';

					$.each(eventsObj, function(key, value) {
						if(( typeof value === "object") && (key !== "delegate")) {
							
							// Check global event map and re-bind events
							$.each(value, function(eventKey, eventValue) {
							  if (Lyria.EventMap && Lyria.EventMap[eventKey] && (typeof Lyria.EventMap[eventKey] === "object")) {
							  	
							  	console.log(Lyria.EventMap[eventKey]);
							  	
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
					view: generatedMarkup,
					name: sceneName,
					route: options.route,
					transition: options.transition,
					init: options.init,
					render: options.render,
					update: options.update,
					resize: options.resize,
					onSceneActive: options.onSceneActive,
					onSceneDeactivated: options.onSceneDeactivated
				}
			}
		});

	}

	return {
		name: sceneName,
		route: options.route,
		transition: options.transition,
		init: options.init,
		render: options.render,
		update: options.update,
		resize: options.resize,
		onSceneActive: options.onSceneActive,
		onSceneDeactivated: options.onSceneDeactivated
	}

}

/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
var Lyria = Lyria || {};

Lyria.Scene = function(sceneName, options) {
	if(!sceneName) {
		return;
	}

	var defaultOptions = {
		target: $('#' + sceneName),
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

	function buildTemplateObject(inputObject, evaluateInput, argObject) {
		var outputObject = {};

		Lyria.Utils.isObjectOrString(inputObject, function(arg) {
			$.each(arg, function(key, value) {
				if(Lyria.Utils.isFile(value)) {
					$.ajax({
						url: Lyria.Resource.name(value, scenePath),
						// Needs to synchronous as we don't really know when the different files are
						// ready for us
						async: false,
						success: function(data) {
							if(evaluateInput) {
								argObject = argObject || {};
								outputObject[key.split('.')[0]] = (new Function('return (' + data + ')("' + sceneName + '",' + JSON.stringify(argObject) + ')'))();
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
					success: function(data) {
						if(evaluateInput) {
							argObject = argObject || {};
							outputObject = (new Function('return (' + data + ')("' + sceneName + '",' + JSON.stringify(argObject) + ')'))();
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
	
	dataObj = buildTemplateObject(options.data, true, localizationObj);


	// Get markup
	// Ok, let's do this synchronously for now. I don't like it that way, but it
	// would require
	// too much testing at the moment to get it working asynchronously
	if(Lyria.Utils.isFile(options.template)) {
		$.ajax({
			url: Lyria.Resource.name(options.template, scenePath),
			dataType: 'text',
			async: false,
			success: function(data) {
				templateMarkup = data;
			}
		});

		// Put 'em all together
		var template = Handlebars.compile(templateMarkup);

		var templateOptions = {};
		if(!$.isEmptyObject(helperObj)) {
			templateOptions['helpers'] = helperObj;
		}
		if(!$.isEmptyObject(partialObj)) {
			templateOptions['partials'] = partialObj;
		}

		generatedMarkup = template(dataObj, templateOptions);


		if(options.target) {
			targetObj = (options.target instanceof jQuery) ? options.target : $(options.target);
			targetObj.html(generatedMarkup);
		}

	}

	// Call init procedure
	options.init();

	return {
		view: generatedMarkup,
		name: sceneName,
		route: options.route,
		transition: options.transition,
		init: options.init,
		render: options.render,
		update: options.update
	}
}

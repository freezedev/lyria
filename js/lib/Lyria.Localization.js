/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
var Lyria = Lyria || {};

/**
 * 
 * @param {Object} localization
 * @param {Object} options
 */
Lyria.Localization = function(localization, options) {
	if(!localization) {
		return;
	}

	var defaultOptions = {
		language: Lyria.Language
	}
	options = $.extend(true, defaultOptions, options);

	var localizeObject = {};
	
	Lyria.Utils.isObjectOrString(localization, function(arg) {
		// Object
		localizeObject = arg;
	}, function(arg) {
		// String: AJAX request to file
		$.ajax({
			url: arg,
			async: false,
			dataType: 'json',
			success: function(data) {
				localizeObject = data;
			}
		});
	});

	var localizeLangObject = localizeObject[options.language];

	// Language not found, switch to default language if available
	if(!localizeLangObject) {
		localizeLangObject = localizeObject[Lyria.DefaultLanguage];
	}

	/**
	 * 
 	 * @param {Object} name
     * @param {Object} fallback
	 */
	function get(name, fallback) {
		if(localizeLangObject) {
			if(localizeLangObject[name]) {
				return localizeLangObject[name];
			}

		}

		if((!name) && (!fallback)) {
			return localizeLangObject;
		} else {
			if(!name) {
				return fallback;
			} else {

				if(fallback) {
					return fallback;
				} else {
					return name;
				}

			}
		}

	}

	return {
		get: get
	}
}

Lyria.GlobalLocalization = Lyria.Localization(Lyria.Resource.name("i18n.json"));

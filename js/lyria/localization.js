/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
;(function(Lyria, $, undefined) {'use strict';

  Lyria.Localization = function(localization, options) {
    /**
     *
     * @param {Object} localization
     * @param {Object} options
     */
    var Localization = function(localization, options) {
      if (!localization) {
        return;
      }
      var localizeLangObject = {};
      var defaultOptions = {
        language: Lyria.Language
      };

      options = $.extend(true, defaultOptions, options);

      var localizeObject = {};
      
      Lyria.Utils.isObjectOrString(localization, function(arg) {
        // Object
        localizeObject = arg;
      }, function(arg) {
        // String: AJAX request to file
        // TODO: Promise object
        $.ajax({
          url: arg,
          async: false,
          dataType: 'json',
          success: function(data) {
            localizeObject = data;
          }
        });
      });

      localizeLangObject = localizeObject[options.language];

      // Language not found, switch to default language if available
      if (!localizeLangObject) {
        localizeLangObject = localizeObject[Lyria.DefaultLanguage];
      }
      
      return localizeLangObject;
    };
    
    this.localizeLangObject = Localization(localization, options);
    
    /**
     *
     * @param {Object} name
     * @param {Object} fallback
     */
    this.get = function(name, fallback) {   
      if (this.localizeLangObject) {
        if (this.localizeLangObject[name]) {
          return this.localizeLangObject[name];
        }

      }

      if ((!name) && (!fallback)) {
        return this.localizeLangObject;
      } else {
        if (!name) {
          return fallback;
        } else {

          if (fallback) {
            return fallback;
          } else {
            return name;
          }

        }
      }

    };
  };

  Lyria.GlobalLocalization = new Lyria.Localization(Lyria.Resource.name("i18n.json"));

})(this.Lyria = this.Lyria || {}, this.jQuery);

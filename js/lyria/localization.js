/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
;(function(Lyria, $, undefined) {'use strict';

  Lyria.Localization = (function() {

    var localizeObject = {};
    var localizeLangObject = null;

    /**
     *
     * @param {Object} localization
     * @param {Object} options
     */
    var Localization = function(localization, options) {
      if (!localization) {
        return;
      }

      var defaultOptions = {
        language: Lyria.Language
      };

      options = $.extend(true, defaultOptions, options);

      localizeObject = {};
      
      check(localization).string(function(value) {
        localizeObject = $.Deferred(function(defer) {
          defer.resolve(value);
        }).promise();
      }).object(function() {
        
      });

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

      var localizeLangObject = localizeObject[options.language];

      // Language not found, switch to default language if available
      if (!localizeLangObject) {
        localizeLangObject = localizeObject[Lyria.DefaultLanguage];
      }
    }
    
    /**
     *
     * @param {Object} name
     * @param {Object} fallback
     */
    Localization.prototype.get = function(name, fallback) {
      if (localizeLangObject) {
        if (localizeLangObject[name]) {
          return localizeLangObject[name];
        }

      }

      if ((!name) && (!fallback)) {
        return localizeLangObject;
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

    return Localization;

  })();

  Lyria.GlobalLocalization = new Lyria.Localization(Lyria.Resource.name("i18n.json"));

})(this.Lyria = this.Lyria || {}, this.jQuery);

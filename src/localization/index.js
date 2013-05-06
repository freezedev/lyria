/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/localization', ['check', 'jquery', 'lyria/language'], function(check, $, language) {'use strict';

  //Lyria.Localization
  return (function() {
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
        language: language
      };

      options = $.extend(true, defaultOptions, options);

      var localizeObject = {};
      
      check(localization, {
        object: function(arg) {
          localizeObject = arg;
        },
        string: function(arg) {
          // AJAX request to file
          // TODO: Promise object
          $.ajax({
            url: arg,
            async: false,
            dataType: 'json',
            success: function(data) {
              localizeObject = data;
            }
          });
        }
      });

      localizeLangObject = localizeObject[options.language];

      // Language not found, switch to default language if available
      if (!localizeLangObject) {
        localizeLangObject = localizeObject['en'];
      }
      
      this.localizeLangObject = localizeLangObject;
    };
    
    /**
     *
     * @param {Object} name
     * @param {Object} fallback
     */
    Localization.prototype.get = function(name, fallback) {   
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
    
    return Localization;
    
  })();
  
});
define('lyria/localization', ['lyria/language', 'lyria/template/string', 'lyria/mixin/language'], function(Language, templateString, langMixin) {

  var Localization = (function() {
    var Localization = function(data) {
      this.data = data;

      var langValue = Language.language;

      langMixin(this, langValue, this);
    };

    Localization.elements = function(localeData, localeLang, fallbackLang) {
      if (fallbackLang == null) {
        fallbackLang = 'en';
      }
      
      return function(name, parameter) {
        if (!localeData || Object.keys(localeData).length === 0) {
          return '[[No language data found]]';          
        }
        
        if (!localeData[localeLang] || Object.keys(localeData[localeLang]).length === 0) {
          localeLang = fallbackLang;
        }
        
        if (localeData[localeLang]) {
          
          if (localeData[localeLang][name] == null) {
            return '[[Missing localization for ' + name + ']]';
          }

          if ( typeof localeData[localeLang][name] === 'string') {
            return templateString.process(localeData[localeLang][name], parameter);
          } else {
            return {
              plural: function(n) {
                if (localeData[localeLang][name][n]) {
                  return templateString.process(localeData[localeLang][name][n], parameter);
                } else {
                  return templateString.process(localeData[localeLang][name]['n'], parameter);
                }
              }
            };
          }
        } else {
          return '[[No language definition found for ' + localeLang + ']]';
        }
      };
    };

    Localization.prototype.exists = function(name) {
      return (this.data && this.data[this.language] && this.data[this.language][name]);
    };

    Localization.prototype.t = function() {
      return Localization.elements(this.data, this.language).apply(this, arguments);
    };

    return Localization;
  })();

  return Localization;
});
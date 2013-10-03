define('lyria/localization', ['lyria/language', 'lyria/template/string', 'lyria/mixin/language'], function(Language, templateString, langMixin) {

  var Localization = (function() {
    var Localization = function(data) {
      var self = this;
      
      this.data = data;
      
      var langValue = Language.language;

      langMixin(self, langValue, self);
    };

    Localization.prototype.t = function(name, parameter) {
      var self = this;
      
      if (this.data && this.data[this.language]) {
        if (this.data[this.language][name] == null) {
          return '[[Missing localization for ' + name + ']]';
        }

        if ( typeof this.data[this.language][name] === 'string') {
          return templateString.process(this.data[this.language][name], parameter);
        } else {
          return {
            plural: function(n) {
              if (self.data[self.language][name][n]) {
                return templateString.process(self.localization[self.language][name][n], parameter);
              } else {
                return templateString.process(self.localization[self.language][name]['n'], parameter);
              }
            }
          };
        }
      }
    };

    return Localization;
  })();

  return Localization;
});

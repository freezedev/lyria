define('hbs', ['handlebars', 'handlebars.runtime'], function(hbs, hbsRuntime) {
  return ((hbs && hbs['default']) || hbsRuntime);
});
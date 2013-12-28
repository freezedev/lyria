define('hbs', ['handlebars', 'handlebars.runtime'], function(hbs, hbsRuntime) {
  'use strict';
  
  return ((hbs && hbs['default']) || hbsRuntime);
});
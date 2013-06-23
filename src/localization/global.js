define('lyria/localization/global', ['lyria/localization', 'lyria/resource'], function(Localization, Resource) {
  var instance = instance || new Localization(Resource.name('i18n.json'));
  
  return instance;
});
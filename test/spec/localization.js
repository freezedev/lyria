define('spec/localization', ['lyria/localization'], function(Localization) {
  'use strict';
  
  describe('lyria/localization', function() {
    
    var localization = new Localization();
    
    it('is a function', function() {
      expect(Localization).to.be.a('function');
    });
    
    it('can be instantiated', function() {
      expect(localization).to.be.a('object');
      expect(localization).to.be.an.instanceOf(Localization);
    });
    
  });
  
});

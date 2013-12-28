define('spec/templateengine', ['lyria/template/engine'], function(TemplateEngine) {
  'use strict';
  
  describe('lyria/template/engine', function() {
    
    it('is an object', function() {
      expect(TemplateEngine).to.be.a('function');
    });
    
  });
  
});

define('spec/templateconnector', ['lyria/template/connector'], function(TemplateConnector) {
  'use strict';
  
  describe('lyria/template/connector', function() {
    
    var connector = new TemplateConnector();
    
    it('is a function', function() {
      expect(TemplateConnector).to.be.a('function');
    });
    
    it('can be instantiated', function() {
      expect(connector).to.be.a('object');
    });
    
  });
  
});

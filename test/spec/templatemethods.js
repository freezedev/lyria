define('spec/templatemethods', ['lyria/template/methods'], function(methods) {
  'use strict';
  
  describe('lyria/template/methods', function() {
    
    it('is an array', function() {
      expect(methods).to.be.a('array');
      expect(methods).to.not.be.empty;
    });
    
  });
  
});

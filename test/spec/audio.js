define('spec/audio', ['lyria/audio'], function(Audio) {
  'use strict';
  
  describe('lyria/audio', function() {
    
    it('is an object', function() {
      expect(Audio).to.be.a('function');
    });
    
  });
  
});

define('spec/spritemanager', ['lyria/sprite/manager'], function(SpriteManager) {
  'use strict';
  
  describe('lyria/sprite/manager', function() {
    
    var spriteManager = new SpriteManager();
    
    it('is a function', function() {
      expect(SpriteManager).to.be.a('function');
    });
    
    it('can be instantiated', function() {
      expect(spriteManager).to.be.a('object');
      expect(spriteManager).to.be.an.instanceOf(SpriteManager);
    });
    
  });
  
});

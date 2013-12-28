define('spec/scenedirector', ['lyria/scene/director'], function(SceneDirector) {
  'use strict';
  
  describe('lyria/scene/director', function() {
    
    var sceneDirector = new SceneDirector();
    
    it('is a function', function() {
      expect(SceneDirector).to.be.a('function');
    });
    
    it('can be instantiated', function() {
      expect(sceneDirector).to.be.a('object');
      expect(sceneDirector).to.be.an.instanceOf(SceneDirector);
    });
    
  });
  
});

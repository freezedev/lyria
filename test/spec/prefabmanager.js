define('spec/prefabmanager', ['lyria/prefab/manager'], function(PrefabManager) {
  'use strict';
  
  describe('lyria/prefab/manager', function() {
    
    it('is an object', function() {
      expect(PrefabManager).to.be.a('object');
    });
    
    it('.prefabs', function() {
      expect(PrefabManager).to.have.property('prefabs');
      expect(PrefabManager.prefabs).to.be.a('object');
    });

    it('.viewport', function() {
      expect(PrefabManager).to.have.property('viewport');
      expect(PrefabManager.viewport).to.equal(null);
    });

    it('.className', function() {
      expect(PrefabManager).to.have.property('className');
      expect(PrefabManager.className).to.be.a('string');
    });    
    
    it('.append', function() {
      expect(PrefabManager).to.have.property('append');
      expect(PrefabManager.append).to.be.a('function');
    });
    
    it('.prepend', function() {
      expect(PrefabManager).to.have.property('prepend');
      expect(PrefabManager.prepend).to.be.a('function');
    });
    
    it('.insert', function() {
      expect(PrefabManager).to.have.property('insert');
      expect(PrefabManager.insert).to.be.a('function');
    });
    
  });
  
});

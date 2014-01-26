define('spec/scene', ['lyria/scene'], function(Scene) {'use strict';

  describe('lyria/scene', function() {

    var scene = new Scene('scene');

    it('is a function', function() {
      expect(Scene).to.be.a('function');
    });

    it('can be instantiated', function() {
      expect(scene).to.be.a('object');
      expect(scene).to.be.an.instanceOf(Scene);
    });
    
    it('throws an error without a name', function() {
      expect(function() {
        new Scene();
      }).to.throw(Error);
    });
    
    it('.requireAlways', function() {
      expect(Scene).to.have.property('requireAlways');
      expect(Scene.requireAlways).to.be.a('object');
    });
    
    it('.defaultEvent', function() {
      expect(Scene).to.have.property('defaultEvent');
      expect(Scene.defaultEvent).to.be.a('string');
      expect(Scene.defaultEvent).to.equal('click');
    });

    describe('#name', function() {
      it('check for scene name', function() {
        var localScene = new Scene('localScene', function() {
  
        });
  
        expect(localScene).to.be.a('object');
        expect(localScene).to.be.an.instanceOf(Scene);
        expect(localScene.name).to.equal('localScene');
      });
    });


  });

});

define('spec/game', ['lyria/game', 'lyria/viewport', 'lyria/scene/director', 'lyria/preloader', 'lyria/world', 'lyria/checkpoints'], function(Game, Viewport, Director, Preloader, World, Checkpoints) {
  'use strict';

  // Starting the loop doen't work in a test environment
  var game = new Game({
    startLoop: false
  });

  describe('lyria/game', function() {
    it('is a function', function() {
      expect(Game).to.be.a('function');
    });

    it('can be instantiated', function() {
      expect(game).to.be.a('object');
      expect(game).to.be.an.instanceOf(Game);
    });

    it('Instance has property viewport', function() {
      expect(game).to.have.property('viewport');
      expect(game.viewport).to.be.a('object');
      expect(game.viewport).to.be.an.instanceOf(Viewport);
    });

    it('Instance property viewport references parent', function() {
      expect(game.viewport).to.have.property('parent');
      expect(game.viewport.parent).to.equal(game);
    });

    it('Instance has property director', function() {
      expect(game).to.have.property('director');
      expect(game.director).to.be.a('object');
      expect(game.director).to.be.an.instanceOf(Director);
    });

    it('Instance property director references parent', function() {
      expect(game.director).to.have.property('parent');
      expect(game.director.parent).to.equal(game);
    });

    it('Instance has property preloader', function() {
      expect(game).to.have.property('preloader');
      expect(game.preloader).to.be.a('object');
      expect(game.preloader).to.be.an.instanceOf(Preloader);
    });

    it('Instance property preloader references parent', function() {
      expect(game.preloader).to.have.property('parent');
      expect(game.preloader.parent).to.equal(game);
    });

    it('Instance has property world', function() {
      expect(game).to.have.property('world');
      expect(game.world).to.be.a('object');
      expect(game.world).to.be.an.instanceOf(World);
    });

    it('Instance property world references parent', function() {
      expect(game.world).to.have.property('parent');
      expect(game.world.parent).to.equal(game);
    });

    it('Instance has property checkpoints', function() {
      expect(game).to.have.property('checkpoints');
      expect(game.checkpoints).to.be.a('object');
      expect(game.checkpoints).to.be.an.instanceOf(Checkpoints);
    });

    it('Instance has property mute', function() {
      expect(game).to.have.property('mute');
      expect(game.mute).to.be.a('boolean');
    });

    it('Instance has property paused', function() {
      expect(game).to.have.property('paused');
      expect(game.paused).to.be.a('boolean');
    });

    it('#addScene exists', function() {
      expect(Game.prototype.addScene).to.be.a('function');
      expect(game).to.have.property('addScene');
      expect(game.addScene).to.equal(Game.prototype.addScene);
    });
    
    it('#showScene exists', function() {
      expect(Game.prototype.showScene).to.be.a('function');
      expect(game).to.have.property('showScene');
      expect(game.showScene).to.equal(Game.prototype.showScene);
    });

    it('has a reference to lyria/loop', function() {
      expect(Game).to.have.a.property('Loop');
      expect(Game.Loop).to.be.a('object');
    });

  });

});

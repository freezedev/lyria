define('spec/game', ['lyria/game'], function(Game) {
  
  var game = new Game();
  
  describe('lyria/game', function() {
    it('is a function', function() {
      expect(Game).to.be.a('function');
    });
    
    it('can be instantiated', function() {
      expect(game).to.be.a('object');
    });
  });
  
});

define('spec/inputkey', ['lyria/input/key'], function(Key) {
  'use strict';
  
  describe('lyria/input/key', function() {
    
    it('is an object', function() {
      expect(Key).to.be.a('object');
    });
    
    describe('.define', function() {
      it('exists', function() {
        expect(Key).to.have.property('define');
        expect(Key.define).to.be.a('function');
      });
      
      it('without parameter', function() {
        var keyLength = Object.keys(Key).length;
        
        expect(Key.define()).to.equal(undefined);
        expect(keyLength).to.equal(Object.keys(Key).length);
      });
      
      it('without key parameter', function() {
        var keyLength = Object.keys(Key).length;
        
        expect(Key.define('test')).to.equal(undefined);
        expect(keyLength).to.equal(Object.keys(Key).length);
      });
      
      it('with name and key', function() {
        expect(Key.define('action', 20)).to.equal(undefined);
        expect(Key).to.have.property('action');
        expect(Key.action).to.equal(20);
      });
      
      it('does not overwrite existing keys', function() {
        expect(Key.define('a', 20)).to.equal(undefined);
        expect(Key.a).to.not.equal(20);
      });
      
      it('converts functions into a getter', function() {
        expect(Key.define('fire', function() { return 50; })).to.equal(undefined);
        expect(Key.fire).to.equal(50);
      });
    });
    
  });
  
});

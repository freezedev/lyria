define('spec/achievement', ['lyria/achievement'], function(Achievement) {
  'use strict';
  
  describe('lyria/achievement', function() {
    
    it('is a function', function() {
      expect(Achievement).to.be.a('function');
    });
    
    describe('constructor', function() {
      it('can be instantiated', function() {
        var achievement = new Achievement('test');

        expect(achievement).to.be.a('object');
        expect(achievement).to.be.an.instanceOf(Achievement);
      });
      
      it('calling without parameters throws an error', function() {
        expect(function() {
          new Achievement();
        }).to.throw(Error);
      });
      
      it('calling without a name throws an error', function() {
        expect(function() {
          new Achievement({});
        }).to.throw(Error);
      });
      
      it('calling with object parameter', function() {
        var achievement = new Achievement({name: 'first'});
        
        expect(achievement).to.have.property('name');
        expect(achievement.name).to.equal('first');
      });
      
      it('calling with string parameter', function() {
        var achievement = new Achievement('second');
        
        expect(achievement).to.have.property('name');
        expect(achievement.name).to.equal('second');
      });
    });
    
    
  });
  
});

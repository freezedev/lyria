define('spec/resource', ['lyria/resource'], function(Resource) {
  'use strict';
  
  describe('lyria/resource', function() {
    
    it('is an object', function() {
      expect(Resource).to.be.a('object');
    });
    
    it('.path', function() {
      expect(Resource).to.have.property('path');
      expect(Resource.path).to.be.a('object');
    });
    
    describe('.name', function() {
      it('does exist', function() {
        expect(Resource).to.have.property('name');
        expect(Resource.name).to.be.a('function');
      });
      
      it('calling without parameters', function() {
        expect(Resource.name()).to.equal(undefined);
      });
      
      it('calling without type parameter', function() {
        expect(Resource.name('test')).to.be.a('string');
      });
      
      it('calling with filename and type parameter', function() {
        expect(Resource.name('test', 'image')).to.be.a('string');
      });
    });
    
  });
  
});

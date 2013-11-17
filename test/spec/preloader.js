define('spec/preloader', ['lyria/preloader'], function(Preloader) {
  
  describe('lyria/preloader', function() {
    
    var preloader = new Preloader();
    
    it('is a function', function() {
      expect(Preloader).to.be.a('function');
    });
    
    describe('constructor', function() {
      it('lyria/game is instantiable', function() {
        expect(preloader).to.be.a('object');
        expect(preloader).to.be.an.instanceOf(Preloader);
      });
      
      it('Instance has default values', function() {
        expect(preloader.assets).to.be.empty;
        expect(preloader.maxAssets).to.equal(0);
        expect(preloader.assetsLoaded).to.equal(0);
        expect(preloader.steps).to.be.empty;
        expect(preloader.taskList).to.be.empty;
      });
    });
    
    
    it('Instance has property assets', function() {
      expect(preloader).to.have.property('assets');
      expect(preloader.assets).to.be.a('object');
    });
    
    it('Instance has property maxAssets', function() {
      expect(preloader).to.have.property('maxAssets');
      expect(preloader.maxAssets).to.be.a('number');
    });
    
    it('Instance has property assetsLoaded', function() {
      expect(preloader).to.have.property('assetsLoaded');
      expect(preloader.assetsLoaded).to.be.a('number');
    });
    
    it('Instance has property steps', function() {
      expect(preloader).to.have.property('steps');
      expect(preloader.steps).to.be.a('array');
    });
    
    it('Instance has property taskList', function() {
      expect(preloader).to.have.property('taskList');
      expect(preloader.taskList).to.be.a('array');
    });
    
    it('#start', function() {
      expect(Preloader.prototype.start).to.be.a('function');
      expect(preloader).to.have.property('start');
      expect(preloader.start).to.equal(Preloader.prototype.start);
    });
    
    it('#task', function() {
      expect(Preloader.prototype.task).to.be.a('function');
      expect(preloader).to.have.property('start');
      expect(preloader.task).to.equal(Preloader.prototype.task);
    });
    
    
  });
  
});

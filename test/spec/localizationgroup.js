define('spec/localizationgroup', ['lyria/localization/group'], function(LocalizationGroup) {
  
  describe('lyria/localization/group', function() {
    
    var group = new LocalizationGroup();
    
    it('is a function', function() {
      expect(LocalizationGroup).to.be.a('function');
    });
    
    it('can be instantiated', function() {
      expect(group).to.be.a('object');
      expect(group).to.be.an.instanceOf(LocalizationGroup);
    });
    
  });
  
});

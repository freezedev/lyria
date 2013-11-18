define('spec/achievementmanager', ['lyria/achievement/manager'], function(AchievementManager) {
  
  describe('lyria/localization', function() {
    
    var achievementManager = new AchievementManager();
    
    it('is a function', function() {
      expect(AchievementManager).to.be.a('object');
    });
    
  });
  
});

define('lyria/achievement/manager', ['root', 'jquery', 'lyria/achievement'], function(root, $, Achievement) {
  
  var achievementStore = {};
  
  var AchievementManager = {
    add: function(achievement) {
      if (achievement instanceof Achievement) {
        achievementStore[achievement.name] = achievement;
      }
    },
    remove: function(achName) {
      if (Object.hasOwnProperty.call(achievementStore, achName)) {
        delete achievementStore[achName];
      }
    },
    list: function() {
      
    },
    show: function(achName) {
      
    }
  };
  
  return AchievementManager;
  
});

define('lyria/achievement/manager', ['jquery', 'lyria/achievement', 'lyria/template/engine'], function($, Achievement, TemplateEngine) {
  
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
      //TemplateEngine.compile()
    },
    show: function(achName) {
      //TemplateEngine.compile();
    },
    toJSON: function() {
      //return achievementStore;
    },
    toString: function() {
      return JSON.stringify(AchievementManager.toJSON());
    },
    templates: {
      achievement: '',
      list: ''
    }
  };
  
  return AchievementManager;
  
});

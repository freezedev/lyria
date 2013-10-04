define('lyria/achievement/manager', ['jquery', 'lyria/achievement', 'lyria/template/engine', 'lyria/template/list', 'lyria/localization'], function($, Achievement, TemplateEngine, templateList, Localization) {
  
  var achievementStore = {};
  
  var AchievementManager = {
    localization: new Localization(),
    add: function(achievement) {
      if (achievement instanceof Achievement) {
        if (!Object.hasOwnProperty.call(achievementStore, achievement.name)) {
          achievementStore[achievement.name] = achievement;          
        }
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
      var title = (AchievementManager.localization.exists(achName)) ? Achievement.localization.t(achName) : achName;
      var description = (AchievementManager.localization.exists(achName + '-description')) ? Achievement.localization.t(achName + '-description') : achievementStore[achName].description;
      
      TemplateEngine.compile(templateList['achievements'], {
        title: title,
        description: description
      });
      //TemplateEngine.compile();
    },
    toJSON: function() {
      var key, value;
      var result = {};
      
      for (key in achievementStore) {
        value = achievementStore[key];
        result[key] = value.toJSON();
      }
      
      return result;
    },
    toString: function() {
      var result = '';
      
      try {
        result = JSON.stringify(AchievementManager.toJSON());
      } catch (e) {
        throw new Error('Error while serializing achievements in AchievementManger: ' + e);
      }
      return result;
    },
    fromJSON: function(achievements) {
      var key, value;
      
      for (key in achievements) {
        value = achievements[key];
        AchievementManager.add(value);
      }
    },
    fromString: function(achievements) {
      var deserializedValue = {};
      
      try {
        deserializedValue = JSON.parse(achievements);
      } catch (e) {
        throw new Error('Error while deserializing achivements in AchievementManager: ' + e);
      }
      
      return AchievementManager.fromJSON(deserializedValue);
    },
    templates: {
      achievement: '',
      list: ''
    }
  };
  
  Object.defineProperty(AchievementManager, 'length', {
    get: function() {
      return Object.keys(achievementStore).length;
    }
  });
  
  Object.defineProperty(AchievementManager, 'unlockedCount', {
    get: function() {
      var counter = 0;
      
      $.each(achievementStore, function(key, value) {
        if (value.unlocked) {
          counter++;
        }
      });
      
      return counter;
    }
  });
  
  
  return AchievementManager;
  
});

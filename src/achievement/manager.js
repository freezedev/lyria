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
    viewport: null,
    remove: function(achName) {
      if (Object.hasOwnProperty.call(achievementStore, achName)) {
        delete achievementStore[achName];
      }
    },
    list: function() {
      //TemplateEngine.compile()
    },
    show: function(achName) {
      var currentAchievement = achievementStore[achName];
      
      if (currentAchievement == null) {
        throw new Error('Achievement ' + achName + ' not found.');        
      }
      
      var title = (AchievementManager.localization.exists(currentAchievement.name)) ? Achievement.localization.t(currentAchievement.name) : currentAchievement.name;
      var description = (AchievementManager.localization.exists(currentAchievement.name + '-description')) ? Achievement.localization.t(currentAchievement.name + '-description') : currentAchievement.description;
      
      var achTemplate = TemplateEngine.compile(templateList['achievement'])({
        id: currentAchievement.id,
        title: title,
        description: description
      });
      
      var $currentAchievement = $('#' + currentAchievement.id);
      
      if (AchievementManager.viewport == null) {
        $('body').append(achTemplate);        
      } else {
        AchievementManager.viewport.$element.append(achTemplate);
      }
      
      $currentAchievement.addClass('offscreen');
      $currentAchievement.removeClass('offscreen');
      $currentAchievement.on('transitionend', function() {
        $currentAchievement.remove();
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

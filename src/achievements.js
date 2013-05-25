/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/achievements', ['root', 'jquery'], function(root, $) {
  'use strict';
  
  // Achievement "Singleton": Revealing module pattern
  var Achievements = function() {
    //Private object "array" stores all achievements
    var array = {},
    // Private
    _localStorageKey,
    // Initializes the achievements object with the some juicy
    initialize = function(localStorageKey) {
      // Saves localStorage key internally
      _localStorageKey = localStorageKey;
  
      // Loads achievements from local storage if any
      if(root.localStorage) {
        if(root.localStorage[_localStorageKey]) {
          array = JSON.parse(root.localStorage[_localStorageKey]);                  
        }
      }
    }, register = function(text, description, icon) {
      array[text] = {
        active: false
      };
      if( typeof (description) !== "undefined")
        array[text]["description"] = description;
      if( typeof (icon) !== "undefined")
        array[text]["icon"] = icon;
    }, getCount = function() {
      return Object.keys(array).length;
    },
    /**
     * Gets the number of how many achievements have been unlocked
     *
     * @returns {number} The exact number of unlocked achievements
     */
    getUnlockedCount = function() {
      var count = 0;
      for(var i in array) {
        if(array[i]["active"])
          count++;
      }
      return count;
    },
    /**
     * Lists all achievements in a list of <div>s
     *
     * @returns {string} The markup for the list
     */
    list = function() {
      // Locked achievements will be shown in a grey-ish color
      var result = "";
      for(var i in array) {
        if(array[i]["active"])
          result += '<div class="ach_box unlocked"><span class="ach_unlocked">' + i + '</span><br /><span class="ach_details">' + array[i]["description"] + '</span></div><br /><br />';
        else
          result += '<div class="ach_box locked"><span class="ach_locked">' + i + '</span><br /><span class="ach_details">' + array[i]["description"] + '</span></div><br /><br />';
      }
  
      return result;
    },
    /**
     * Displays an achievement if it hasn't been displayed yet
     *
     * @param {string} text
     */
    show = function(text) {
      // If someone forget to register an achievement
      if(array[text] === "undefined")
        register(text);
  
      if(!array[text]["active"]) {
        if(!array[text].icon)
          $('.status.achievement').css("background-image", "url(" + array[text].icon + ")");
  
        $('.achievement .text').html(text);
        $('.status.achievement').css({
          opacity: 0.0
        }).animate({
          opacity: 1.0,
          bottom: '8px'
        }, 750).delay(2500).animate({
          opacity: 0.0,
          bottom: '-80px'
        }, 750);
  
        array[text].active = true;
      }
  
      if(root.localStorage)
        root.localStorage[_localStorageKey] = JSON.stringify(array);
    };
  
    return {
      initialize: initialize,
      getCount: getCount,
      getUnlockedCount: getUnlockedCount,
      list: list,
      register: register,
      show: show
    };
  }();
  
  return Achievements;
});
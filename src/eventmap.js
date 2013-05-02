/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/eventmap', function() {'use strict';

  /**
   * This is directly taken from
   * https://github.com/elysion-powered/elyssa/blob/master/src/core/events.coffee
   * Just using a different namespace
   */
  var __slice = [].slice;

  return (function() {
    var eventFunctions, eventMap;
  
    eventMap = {};
  
    eventFunctions = {};
  
    function EventMap(sender) {
      this.sender = sender;
      eventMap = {};
      eventFunctions = {};
    }
  
    EventMap.prototype.validEvents = [];
  
    EventMap.prototype.on = function(eventName, eventFunction) {
      var eventDesc;
  
      if (!eventFunction) {
        return;
      }
      if (this.validEvents.length > 0) {
        if (validEvents.indexOf(eventName) === -1) {
          return;
        }
      }
      eventDesc = {
        event: eventFunction,
        id: -1,
        type: '',
        sender: this.sender
      };
      if (!eventMap[eventName]) {
        eventMap[eventName] = [eventDesc];
      } else {
        eventMap[eventName].push(eventDesc);
      }
      return this;
    };
  
    EventMap.prototype.off = function(eventName) {
      if (!eventName) {
        return;
      }
      if (eventMap[eventName].type === 'once' || eventMap[eventName].type === 'repeat') {
        if (eventMap[eventName].type === 'repeat') {
          window.clearInterval(eventMap[eventName].id);
        }
        if (eventMap[eventName].type === 'once') {
          window.clearTimeout(eventMap[eventName].id);
        }
      }
      if (eventMap[eventName]) {
        delete eventMap[eventName];
      }
      return this;
    };
  
    EventMap.prototype.trigger = function() {
      var args, context, eventName, i, interval, name, repeat, triggerFunction, _i, _len, _ref;
  
      eventName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (eventName == null) {
        return;
      }
      if (typeof eventName === 'object') {
        name = eventName.name, interval = eventName.interval, repeat = eventName.repeat, context = eventName.context;
      } else {
        name = eventName;
      }
      if (!eventMap[name]) {
        return;
      }
      if (interval == null) {
        interval = 0;
      }
      if (repeat == null) {
        repeat = false;
      }
      if (context == null) {
        context = this;
      }
      _ref = eventMap[name];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        triggerFunction = function(evObject) {
          return i.event.apply(context, [[i.sender], args].reduce(function(a, b) {
            return a.concat(b);
          }));
        };
        if (interval) {
          if (repeat) {
            i.type = 'repeat';
            i.id = window.setInterval(triggerFunction, interval);
          } else {
            i.type = 'once';
            i.id = window.setTimeout(triggerFunction, interval);
          }
        } else {
          i.type = 'direct';
          triggerFunction.call(this);
        }
      }
      return this;
    };
  
    return EventMap;
  
  })();
});
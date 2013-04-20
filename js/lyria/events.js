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

  // Lyria.EventMap
  return (function() {
    var eventFunctions, eventMap;

    eventMap = {};

    eventFunctions = {};

    function EventMap() {
      eventMap = {};
      eventFunctions = {};
    }


    EventMap.prototype.validEvents = [];

    EventMap.prototype.on = function(eventName, eventFunction) {
      if (!eventFunction) {
        return;
      }
      if (this.validEvents.length > 0) {
        if (validEvents.indexOf(eventName) === -1) {
          return;
        }
      }
      eventMap[eventName] = {
        event: eventFunction,
        id: -1,
        type: ''
      };
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
      var args, context, eventName, interval, name, repeat, triggerFunction;
      eventName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (eventName == null) {
        return;
      }
      if ( typeof eventName === 'object') {
        name = eventName.name, interval = eventName.interval, repeat = eventName.repeat, context = eventName.context;
      } else {
        name = eventName;
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
      triggerFunction = function() {
        if (eventMap[name]) {
          return eventMap[name].event.apply(context, args);
        }
      };
      if (interval) {
        if (repeat) {
          eventMap[name].type = 'repeat';
          eventMap[name].id = window.setInterval(triggerFunction, interval);
        } else {
          eventMap[name].type = 'once';
          eventMap[name].id = window.setTimeout(triggerFunction, interval);
        }
      } else {
        eventMap[name].type = 'direct';
        triggerFunction.call(this);
      }
      return this;
    };

    return EventMap;

  })();
});

define('lyria/events', ['lyria/eventmap'], function(EventMap) {
  var instance = instance || new EventMap();

  return instance;
});

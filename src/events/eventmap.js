/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/eventmap', ['root'], function(root) {'use strict';

  /**
   * This is directly taken from
   * https://github.com/elysion-powered/elyssa/blob/master/src/core/events.coffee
   */
  var EventMap = (function() {
    function EventMap(sender) {
      this.sender = sender;
      this.events = {};
      this.validEvents = [];
    }


    EventMap.prototype.serialize = function() {
      var err, result;
      try {
        result = JSON.stringify(this.events, function(key, value) {
          if ( typeof value === 'function') {
            value = value.toString();
          }
          return value;
        });
      } catch (_error) {
        err = _error;
        console.error("Error while serializing eventmap: " + err);
      }
      return result;
    };

    EventMap.prototype.deserialize = function(string) {
      /*jshint evil:true*/
      var err, events;
      try {
        events = JSON.parse(string, function(key, value) {
          if (value.indexOf('function') === 0) {
            value = new Function(value)();
          }
          return value;
        });
      } catch (_error) {
        err = _error;
        console.error("Error while deserializing eventmap: " + err);
        return false;
      }
      this.events = events;
      return true;
    };

    EventMap.prototype.on = function(eventName, eventFunction) {
      var eventDesc;
      if (!eventFunction) {
        return;
      }
      if (this.validEvents.length > 0) {
        if (this.validEvents.indexOf(eventName) === -1) {
          return;
        }
      }
      eventDesc = {
        event: eventFunction,
        id: -1,
        type: '',
        sender: this.sender
      };
      if (!this.events[eventName]) {
        this.events[eventName] = [eventDesc];
      } else {
        this.events[eventName].push(eventDesc);
      }
      return this;
    };

    EventMap.prototype.off = function(eventName) {
      var eventType;
      if (!eventName) {
        return;
      }
      eventType = this.events[eventName].type;
      if (eventType === 'once' || eventType === 'repeat') {
        if (eventType === 'repeat') {
          root.clearInterval(this.events[eventName].id);
        }
        if (eventType === 'once') {
          root.clearTimeout(this.events[eventName].id);
        }
      }
      if (this.events[eventName]) {
        delete this.events[eventName];
      }
      return this;
    };

    EventMap.prototype.clear = function() {
      this.events = {};
      this.validEvents = [];
      return this;
    };

    EventMap.prototype.trigger = function() {
      var args, context, delay, eventName, i, interval, name, repeat, timeoutId, triggerEvent, triggerFunction, _i, _len, _ref;
      eventName = arguments[0], args = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];
      if (eventName == null) {
        return;
      }
      if ( typeof eventName === 'object') {
        name = eventName.name, interval = eventName.interval, repeat = eventName.repeat, context = eventName.context, delay = eventName.delay;
      } else {
        name = eventName;
      }
      if (!this.events[name]) {
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
      if (delay == null) {
        delay = 0;
      }
      _ref = this.events[name];
      for ( _i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        triggerFunction = function() {
          if (i.sender) {
            return i.event.apply(context, [].concat.apply([], [[i.sender], args]));
          } else {
            return i.event.apply(context, args);
          }
        };
        triggerEvent = function() {
          if (interval) {
            if (repeat) {
              i.type = 'repeat';
              i.id = root.setInterval(triggerFunction, interval);
            } else {
              i.type = 'once';
              i.id = root.setTimeout(triggerFunction, interval);
            }
          } else {
            i.type = 'direct';
            triggerFunction.call(this);
          }
          return null;
        };
        if (delay) {
          timeoutId = root.setTimeout(function() {
            triggerEvent.call(this);
            return root.clearTimeout(timeoutId);
          });
        } else {
          triggerEvent.call(this);
        }
      }
      return this;
    };

    return EventMap;

  })();

  return EventMap;
});

define('lyria/data/store', ['lyria/eventmap'], function(EventMap) {

  var data = {};
  var eventMap = new EventMap();

  var DataStore = {
    has: function(key) {
      return data.hasOwnProperty('key');
    },
    get: function(key) {
      return data[key];
    },
    set: function(key, value) {
      data[key] = value;
    }
  };

  return DataStore;

});

define(['jqueryify', 'jquery', 'root'], function($ify, $, root) {
  'use strict';
  
  var PrefabManager = {};

  PrefabManager.prefabs = {};
  PrefabManager.viewport = null;
  PrefabManager.className = 'prefab';

  var createElement = function(type) {
    return function(options, data) {
      var name = options.name;
      // Allow target to be an alias for parent
      var parent = options.parent || options.target;
      
      // TODO: Streamline the way of passing data to scenes and prefabs
      data = data || options.data || {};
      
      if (options.wrap == null) {
        options.wrap = true;
      }
      
      // TODO: Wrap typically wraps the content - this is default behavior right now
      var wrap = options.wrap;
      
      if (parent == null) {
        parent = ((PrefabManager.viewport) ? PrefabManager.viewport.$element :
        void 0) || 'body';
      }
      
      var prefab = null;
      
      if (name.indexOf('.') >= 0) {
        name = name.replace(/./g, '--');
      }
      
      if (name.indexOf('/') >= 0) {
        name = name.replace(/\//g, '--');
      }
      
      if (name.indexOf('#') >= 0) {
        name = name.replace(/#/g, '--');
      }
      
      var prefabId = PrefabManager.className + '-' + name + '-' + Date.now();
      
      data.id = prefabId;
      
      if (!PrefabManager.prefabs[name]) {
        throw new Error('No valid prefab called ' + name + ' found.');
      } else {
        prefab = PrefabManager.prefabs[name](data);
      }

      var $parent = $ify(parent);

      if ($parent) {
        if ($('#' + prefab.name).length === 0) {
          $parent[type]($(root.document.createElement('div')).attr('id', prefabId).attr('class', PrefabManager.className));
        }

        if (!prefab.isAsync) {
          prefab.trigger('added', function() {
            prefab.trigger('active');
          });
        }
      }
    };
  };

  PrefabManager.append = function() {
    createElement('append').apply(this, arguments);
  };

  PrefabManager.prepend = function() {
    createElement('prepend').apply(this, arguments);
  };
  
  PrefabManager.insert = function() {
    createElement('html').apply(this, arguments);
  };

  return PrefabManager;
});

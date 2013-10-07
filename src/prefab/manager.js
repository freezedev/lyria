define('lyria/prefab/manager', ['jqueryify', 'jquery', 'root'], function($ify, $, root) {
  var PrefabManager = {};

  PrefabManager.prefabs = {};
  PrefabManager.viewport = null;
  PrefabManager.className = 'prefab';

  var createElement = function(type) {
    return function(name, parent) {
      if (parent == null) {
        parent = ((PrefabManager.viewport) ? PrefabManager.viewport.$element :
        void 0) || 'body';
      }
      
      var prefab = null;
      
      if (!PrefabManager.prefabs[name]) {
        throw new Error('No valid prefab called ' + name + ' found.');
      }

      var $parent = $ify(parent);

      if ($parent) {
        if ($('#' + prefab.name).length === 0) {
          $parent[type]($(root.document.createElement('div')).attr('id', prefab.name).attr('class', PrefabManager.className));
        }

        if (!prefab.isAsync) {
          prefab.trigger('added');
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

  return PrefabManager;
});

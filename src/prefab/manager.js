define('lyria/prefab/manager', function() {
  var PrefabManager = {};
  
  PrefabManager.create = function(name) {
    if (PrefabManager.precompiledPrefabs) {
      return PrefabManager.precompiledPrefabs[name];
    }
  };
  
  return PrefabManager;
});

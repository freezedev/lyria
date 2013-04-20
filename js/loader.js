;(function(global, $LAB) {
  
  $LAB
      // Load dependencies
      .script('js/lib/es6-shim.js')
      .script('js/lib/jquery.js')
      .script('js/lib/detectr.js')
      .script('js/lib/check.js')
      .script('js/lib/modernizr.js')
      .script('js/lib/handlebars.js').wait()
      // Load libraries
      .script('js/lyria/constants.js')
      .script('js/lyria/core.js')
      .script('js/lyria/events.js')
      .script('js/lyria/logger.js')
      .script('js/lyria/utils.js').wait()
      .script('js/lyria/loop.js')
      .script('js/lyria/achievements.js')
      .script('js/lyria/assets.js')
      .script('js/lyria/audio.js')
      .script('js/lyria/localization.js')
      .script('js/lyria/preloader.js')
      .script('js/lyria/templates.js')
      .script('js/lyria/scene.js')
      .script('js/lyria/viewport.js')
      .script('js/lyria/scenedirector.js')
      .script('js/lyria/prefab.js')
      .script('js/lyria/video.js').wait()
      // Game-specific elements
      .script('js/lyria/component.js')
      .script('js/lyria/entity.js')
      .script('js/lyria/gameobject.js')
      .script('js/lyria/game.js').wait()
      // Load application 
      .script('js/scenes.js')
      .script('js/template.js');
  
})(this, this.$LAB);

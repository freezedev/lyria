(function(eos, Lyria) {
  
  Lyria.TemplateConnector = (function() {
    
    var TemplateConnector = function(functionRefs) {
      if (typeof functionRefs === 'object') {
        
        eos.each(functionRefs, function(key, value) {
          
        });
        
      }
    };
    
    return TemplateConnector;
    
  })();
  
  Lyria.TemplateEngine = function(functionRefs) {
    var noop = function() {};
    
    
  };
  
})(this.eos, this.Lyria = this.Lyria || {});

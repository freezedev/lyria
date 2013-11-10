require(['mocha', 'chai'], function(mocha, chai) {
  
  mocha.setup('bdd');
  
  require(['spec/' + spec], function() {
    mocha.run();
  });
  
});

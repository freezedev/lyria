(function() {Lyria.Scenes["scene1"] = new Lyria.Scene("scene1", function(sender) {var localization = sender.localization = {
	"en": {
		"title": "This is "
	},
	"de": {
		"title": "Das ist "
	}
}
;sender.template = function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n\n<span id=\"btnSwitch\">";
  if (stack1 = helpers.btnSwitchToNextScene) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.btnSwitchToNextScene; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>";
  return buffer;
  };(function(sender, localization) {
	
	console.log(sender);
	console.log(localization);
	
	return {
		events: {
			'#btnSwitch': {
				'click': function() {
					sender.parent.show('scene2');
				}
			}
		},
		btnSwitchToNextScene: "Switch to next scene",
		test: "Hallo"
	};
})(sender, localization);
});Lyria.Scenes["scene2"] = new Lyria.Scene("scene2", function(sender) {var localization = sender.localization = {
	"en": {},
	"de": {}
}
;sender.template = function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div>";
  if (stack1 = helpers.test) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.test; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>";
  return buffer;
  };(function(sender, localization) {
	
	console.log(sender);
	console.log(localization);
	
	return {
		test: "Hallo"
	};
})(sender, localization);
});})();
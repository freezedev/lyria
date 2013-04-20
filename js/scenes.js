(function(Lyria) {Lyria.Scenes["scene1"] = new Lyria.Scene("scene1", function(scene) {this.localization = {
	"en": {
		"title": "This is "
	},
	"de": {
		"title": "Das ist "
	}
}
;this.template = Lyria.TemplateEngine.compile(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\r\n\r\n<span id=\"btnSwitch\">";
  if (stack1 = helpers.btnSwitchToNextScene) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.btnSwitchToNextScene; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>";
  return buffer;
  });return (function(sender, localization) {
	
	console.log(sender);
	console.log(localization);
	
	sender.events = {
		'#btnSwitch': {
			'click': function(event) {
				event.data.scene.parent.show('scene2');
			}
		}
	};
	
	return {
		btnSwitchToNextScene: "Switch to next scene",
		test: "Hallo",
		title: sender.name
	};
	
})(this, this.localization);
;});Lyria.Scenes["scene2"] = new Lyria.Scene("scene2", function(scene) {this.localization = {
	"en": {},
	"de": {}
}
;this.template = Lyria.TemplateEngine.compile(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div>";
  if (stack1 = helpers.test) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.test; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>";
  return buffer;
  });return (function(sender, localization) {
	
	console.log(sender);
	console.log(localization);
	
	return {
		test: "Hallo"
	};
	
})(this, this.localization);
;});})(this.Lyria = this.Lyria || {});
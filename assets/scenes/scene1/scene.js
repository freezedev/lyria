(function(sender, localization) {
	
	console.log(sender);
	console.log(localization);
	
	sender.events = {
		'#btnSwitch': {
			'click': function() {
				sender.parent.show('scene2');
			}
		}
	};
	
	return {
		btnSwitchToNextScene: "Switch to next scene",
		test: "Hallo",
		title: sender.name
	};
})(this, this.localization);

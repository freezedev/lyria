(function(sender, localization) {
	
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

(function(sender, localization) {
	
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
	}
})(sender, localization);

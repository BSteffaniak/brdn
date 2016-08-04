app.service("$analytics", ['$server', function ($server) {
	function sendAnalytics(data, success, failure) {
		/*
		$server.dataRequest("$analytics", data, function (data) {
				success(data);
			}, function (data) {
				if (failure(data) !== false) {
					console.log("Failed to send analytic (", data, ")");
				}
			});*/
	};
	
	this.updateViewingPlatform = function (platform) {
		sendAnalytics({ viewingPlatform: platform }, function (data) {
			
		});
	};
}]);
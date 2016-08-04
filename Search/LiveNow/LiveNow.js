app.controller('LiveNow', [ '$scope', '$localStorage', '$server', '$happeningUtils', function($scope, $localStorage, $server, $happeningUtils) {
	var happeningBuilder = $happeningUtils.buildQuery()
		.where("$timeMillis > start_time and $timeMillis < end_time");
	
	$server.dataRequest(happeningBuilder.toMQL(), {
		success: function(data) {
			$scope.happenings = data;
		}
	});
}]);
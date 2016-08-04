app.controller('Login', [ '$scope', '$localStorage', '$server', '$loginUtils', function($scope, $localStorage, $server, $loginUtils) {
	$scope.submit = function () {
	    $loginUtils.login($scope.username || "", $scope.password || "", function (success) {
	    	if (success) {
	    		$scope.openUrl("Events");
		    } else {
		    	$scope.errorText = "Incorrect username or password.";
		    }
	    });
	};
}]);
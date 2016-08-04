app.controller('SplashScreen', [ '$loginUtils', '$scope', function($loginUtils, $scope) {
	$scope.signup = $scope.signup || {};
	
	$scope.setScreenOrientation("portrait");
	
	$scope.submit = function () {
	    $loginUtils.login($scope.username || "", $scope.password || "", function (success) {
	    	if (success) {
	    		$scope.openUrl("Events");
		    } else if (success === false) {
		    	$scope.errorText = "Incorrect username or password.";
		    } else {
				$scope.errorText = "Couldn't connect to server.";
			}
	    });
	};
}]);
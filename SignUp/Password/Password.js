app.controller('Password', [ '$scope', function($scope) {
	$scope.session.signup = $scope.session.signup || {};
	
	$scope.validate = function (e) {
		if (typeof $scope.session.signup.password === 'undefined') {
			$scope.error = "You must enter a password.";
			
			return false;
		}
		
		if ($scope.session.signup.password.length < 4) {
			$scope.error = "Your password is too short.";
			
			return false;
		}
		
		if ($scope.session.signup.password.length > 512) {
			$scope.error = "Your password is too long.";
			
			return false;
		}
		
		if ($scope.session.signup.password !== $scope.session.signup.passwordConf) {
			$scope.error = "Your passwords do not match.";
			
			return false;
		}
		
		$scope.openUrl(e.target.getAttribute("url"));
	};
	
	submitFunction = $scope.validate;
}]);
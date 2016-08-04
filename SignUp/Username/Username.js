app.controller('Username', [ '$scope', '$server', function($scope, $server) {
	$scope.session.signup = $scope.session.signup || {};
	
	$scope.validate = function (e) {
		$scope.session.signup.username = typeof $scope.session.signup.username === 'undefined' ? $scope.session.signup.username : $scope.session.signup.username.trim();
		
		if (typeof $scope.session.signup.username === 'undefined' || $scope.session.signup.username.length == 0) {
			$scope.error = "You must enter a username.";
			
			return false;
		}
		
		if ($scope.session.signup.username.length > 16) {
			$scope.error = "Your username is too long.";
			
			return false;
		}
		
		var validUsername = /^([a-z0-9$!%^*\(\)\-\\])+$/gi; 
		
		if (!validUsername.test($scope.session.signup.username)) {
			$scope.error = "Your username contains invalid characters.";
			
			return false;
		}
		
		$server.get("GetUser", { username: $scope.session.signup.username }, {
			success: function (data) {
				if (typeof data.username !== 'undefined') {
					$scope.error = "That username already exists.";
					
					return false;
				} else {
					$scope.openUrl(e.target.getAttribute("url"));
				}
			},
			failure: function () {
				$scope.error = "Could not connect to the server.";
			}
		});
	};
	
	submitFunction = $scope.validate;
}]);
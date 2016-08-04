app.controller('Email', [ '$scope', function($scope) {
	$scope.session.signup = $scope.session.signup || {};
	
	$scope.validate = function (e) {
		if (typeof $scope.session.signup.email === 'undefined' || $scope.session.signup.email.length == 0) {
			$scope.error = "Please enter your email.";
			
			return false;
		}
		
		var emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
		
		if (!emailFormat.test($scope.session.signup.email)) {
			$scope.error = "Please enter a valid email.";
			
			return false;
		}
		
		if ($scope.session.signup.email.length > 512) {
			$scope.error = "Your email is too long.";
			
			return false;
		}
		
		$scope.openUrl(e.target.getAttribute("url"));
	};
	
	submitFunction = $scope.validate;
}]);
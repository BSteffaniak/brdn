app.controller('PhoneNumber', [ '$scope', function($scope) {
	$scope.session.signup = $scope.session.signup || {};
	
	$scope.validate = function (e) {
		if (typeof $scope.session.signup.phoneNumber === 'undefined') {
			$scope.error = "You must enter your phone number.";
			
			return false;
		}
		
		if ($scope.session.signup.phoneNumber.length < 10) {
			$scope.error = "You must enter your full phone number.";
			
			return false;
		}
		
		$scope.openUrl(e.target.getAttribute("url"));
	};
	
	submitFunction = $scope.validate;
}]);
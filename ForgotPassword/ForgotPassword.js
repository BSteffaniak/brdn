app.controller('ForgotPassword', [ '$scope', '$server', function($scope, $server) {
	$scope.resetPassword = function () {
		if (!$scope.email) {
			$scope.error = "enter a valid email";
		} else {
			$scope.error = "";
			
			$server.post("ResetPassword", { email: $scope.email }, {
					callback: function (success) {
						if (success) {
							$scope.message = "sent password reset request";
						} else {
							$scope.error = "failed to send password reset request";
						}
					}
				})
		}
	};
}]);
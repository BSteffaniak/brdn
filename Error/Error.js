app.controller('Error', [ '$scope', function($scope) {
	if (typeof $scope.params !== 'undefined') {
		$scope.errorType = $scope.params.errorType;
		$scope.errorMessage = $scope.params.errorMessage;
	}
}]);
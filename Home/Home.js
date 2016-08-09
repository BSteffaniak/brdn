app.controller('Home', [ '$scope', function($scope) {
	$scope.paragraphCount = 0;
	
	$scope.nextParagraph = function () {
		$scope.paragraphCount++;
	};
	
	$scope.resetParagraphs = function () {
		$scope.paragraphCount = 0;
	};
	
	$scope.terminalSignature = "ubuntu@ip-192-168-1-101:";
	
	$scope.slides = {};
}]);
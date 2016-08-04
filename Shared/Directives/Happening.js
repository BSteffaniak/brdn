app.directive('happening', ['$rootScope', '$happeningUtils', function($rootScope, $happeningUtils) {
	return {
        restrict: 'E',
        scope: {
        	happening: "="
        },
        link: function (scope, element, attributes) {
        	scope.isPast = isPast;
			
			scope.setUserGoing = $happeningUtils.setUserGoing;
			
			scope.contextParams = $rootScope.contextParams;
        },
		templateUrl: 'Shared/Templates/Happening.html'
    };
}]);
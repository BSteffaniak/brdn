app.directive('wolfpaqList', ['$rootScope', function($rootScope) {
	return {
        restrict: 'EA',
        scope: {
        	list: "=",
        	defaultMessage: "@?",
			action: "=?",
			overlayHtml: "=?"
        },
		link: function (scope, elements, attrs) {
			scope.contextParams = $rootScope.contextParams;
			
			var skip = false;
			
			document.addEventListener("click", function (event) {
				if (!event.target.isChildOf(elements[0], true) && typeof scope.selected !== 'undefined' && typeof scope.action === 'function') {
					scope.selected = undefined;
					
					//scope.action(undefined, event);
					
					scope.$apply();
				}
			});
			
			scope.performAction = function(event, data) {
				scope.selected = data;
				
				if (typeof scope.action === 'function') {
					scope.action(data, event);
					
					skip = true;
				}
			}
		},
		templateUrl: 'Shared/Templates/WolfpaqList.html'
    };
}]);
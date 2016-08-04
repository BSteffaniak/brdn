app.directive('wpCheckbox', [function() {
	return {
        restrict: 'E',
        scope: {
        	label: "@?",
        	ngModel: "=?",
        	ngChange: "&?"
        },
        link: function (scope, elements, attributes) {
        	scope.clicked = function () {
        		if (typeof scope.ngChange !== 'function' || scope.ngChange() !== false) {
        			scope.ngModel = !scope.ngModel;
        		}
        	};
        },
        templateUrl: "Shared/Templates/Checkbox.html"
	};
}]);
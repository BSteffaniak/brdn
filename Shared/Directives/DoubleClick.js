app.directive('trDoubleClick', function() {
	return {
        restrict: 'A',
        link: function (scope, element, attributes) {
        	onDoubleClick(element[0], function () {
        		scope.$eval(attributes.trDoubleClick);
        		scope.$apply();
        	});
        }
    };
});
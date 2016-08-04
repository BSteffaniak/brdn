app.directive('howl', [function() {
    return {
		restrict: 'E',
		scope: {
			howl: "="
		},
		link: function(scope, elements, attrs) {
            
        },
        templateUrl: "Shared/Templates/Howl.html"
    };
}]);
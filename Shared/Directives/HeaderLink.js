app.directive('trHeaderLink', function() {
	return {
        restrict: 'EA',
        scope: {
        	text: "@",
        	imgSrc: "@"
        },
		templateUrl: 'Shared/Templates/HeaderLink.html'
    };
});
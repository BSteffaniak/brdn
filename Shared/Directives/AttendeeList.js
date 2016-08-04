app.directive('trAttendeeList', function() {
	return {
        restrict: 'EA',
        scope: {
        	happening: "="
        },
		templateUrl: 'Shared/Templates/AttendeeList.html'
    };
});
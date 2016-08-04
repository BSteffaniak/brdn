app.directive('timePicker', function() {
	return {
        restrict: 'EA',
        scope: {
        	ngModel: "=?",
			startTime: "=?"
        },
        link: function (scope, elements, attrs) {
			var input = $(d3.select(elements[0]).select("input").node());
			var format = "h:mm A";
			
			var data = {
				format: format,
				date: false,
				shortTime: true,
				nowButton: true
			};
			
			if (!attrs.startTime && scope.ngModel && scope.ngModel._isAMomentObject) {
				data.currentDate = scope.ngModel.format(format);
			}
			
			input.bootstrapMaterialDatePicker(data);
			
			input.change(function () {
				var mom = moment(input.val(), format, 'en');
				
				if (scope.ngModel && scope.ngModel._isAMomentObject) {
					scope.ngModel = scope.ngModel.hour(mom.hour()).minute(mom.minute());
				} else {
					scope.ngModel = mom;
				}
				
				scope.$apply();
			});
        },
		templateUrl: 'Shared/Templates/TimePicker.html'
    };
});
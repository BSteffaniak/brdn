app.directive('datePicker', function() {
	return {
        restrict: 'EA',
        scope: {
			minDate: "=?",
			maxDate: "=?",
			startDate: "=?",
        	ngModel: "=?"
        },
        link: function (scope, elements, attrs) {
			var input = $(d3.select(elements[0]).select("input").node());
			var format = "MM/DD/YYYY";
			
			var data = {
				format: format,
				time: false,
				nowButton: true,
				maxDate: scope.maxDate,
				currentDate: scope.startDate
			};
			
			if (!attrs.startDate && scope.ngModel && scope.ngModel._isAMomentObject) {
				data.currentDate = scope.ngModel.format(format);
			}
			if (scope.minDate) {
				data.minDate = scope.minDate;
			}
			
			input.bootstrapMaterialDatePicker(data);
			
			input.change(function () {
				var mom = moment(input.val(), format, 'en');
				
				if (scope.ngModel && scope.ngModel._isAMomentObject) {
					scope.ngModel = scope.ngModel.month(mom.month()).date(mom.date()).year(mom.year());
				} else {
					scope.ngModel = mom;
				}
				
				scope.$apply();
			});
        },
		templateUrl: 'Shared/Templates/DatePicker.html'
    };
});
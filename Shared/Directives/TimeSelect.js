app.directive('trTimeSelect', function() {
	return {
        restrict: 'EA',
        scope: {
        	start: "@",
        	end: "@",
        	ngModel: "=?",
        	activeModel: "=?"
        },
        link: function (scope, element, attributes) {
        	var date = new Date();
        	
        	var row = element.find("tr");
        	
        	var children = row.children();

        	var hourContainer = d3.select(children[0]).append("div");
        	var minuteContainer = d3.select(children[2]).append("div");
        	var ampmContainer = d3.select(children[4]).append("div");
        	
        	var hour = date.getHours();
        	var minute = date.getMinutes();
        	var ampm = hour >= 12 ? 'pm' : 'am';
        	
        	for (var i = 0; i < 24; i++) {
        		hourContainer.append("div").text(pad(i % 12 == 0 ? 12 : i % 12, 2));
        	}
        	for (var i = 0; i < 60; i++) {
        		minuteContainer.append("div").text(pad(i, 2));
        	}
        	for (var i = 0; i < 2; i++) {
        		ampmContainer.append("div").text(i == 0 ? "AM" : "PM");
        	}
        	
        	var args = {
        		tickSize: 81,
        		onDragStart: function () {
            		scope.activeModel = true,
            		scope.$apply();
        		},
        		onFinished: function () {
        			parseTime();
        		},
        		direction: "vertical",
        		wrap: true
        	};
        	
        	function parseTime(async) {
        		async = typeof async !== 'undefined' ? async : true;
        		
        		var hour = Math.round(-parseFloat(hourContainer.style("top")) / args.tickSize);
        		var minute = Math.round(-parseFloat(minuteContainer.style("top")) / args.tickSize);
        		var ampm = Math.round(-parseFloat(ampmContainer.style("top")) / args.tickSize);
        		
        		hour = hour % 12 == 0 ? 12 : hour % 12;
        		ampm = ampm == 0 ? "AM" : "PM";
        		
        		var time = hour + ":" + minute + " " + ampm;
        		
        		scope.ngModel = time;
        		scope.activeModel = false;
        		
        		if (async) {
        			scope.$apply();
        		}
        	}

			var hourY = -(args.tickSize * hour);
			var minuteY = -(args.tickSize * minute);
			var ampmY = -(ampm == 'am' ? 0 : args.tickSize);

        	hourContainer.style("top", hourY + "px");
        	minuteContainer.style("top", minuteY + "px");
        	ampmContainer.style("top", ampmY + "px");
			
			hourContainer.datum({ y: hourY });
			minuteContainer.datum({ y: minuteY });
			ampmContainer.datum({ y: ampmY });
        	
        	draggable([hourContainer, minuteContainer, ampmContainer], args);
			
        	parseTime(false);
        },
		templateUrl: 'Shared/Templates/TimeSelect.html'
    };
});
app.directive('trDateSelect', function() {
	return {
        restrict: 'EA',
        scope: {
        	start: "@",
        	end: "@",
        	ngModel: "=?"
        },
        link: function (scope, elements, attributes) {
        	var date = new Date();
        	var today = date;
        	
        	function parseDate() {
        		
        	}

        	var table = elements.find("table")[0];
        	var container = elements.find("div")[0];
        	
        	var args = {
        		tickSize: 57,
        		minIndex: 0,
        		onDragStart: function () {
            		scope.activeModel = true,
            		scope.$apply();
        		},
        		onFinished: function () {
        			parseDate();
        		},
        		onMove: function (offset, index) {
        			if (index >= children.length - 7) {
        				updateElements();
        			}
        		},
        		direction: "horizontal",
        		dragElement: d3.select(container)
        	};
        	
        	container.style.width = args.tickSize * 7 + "px";
        	table.style.width = "100%";
        	//table.style.tableLayout = "fixed";
        	
        	var row = elements.find("tr");
        	
        	var dayIndex = date.getDay();
        	var monthIndex = date.getMonth();
        	var dateIndex = date.getDate();
        	
        	var currentIndex = 0;
        	
        	function updateElements(count) {
        		count = typeof count !== 'undefined' ? count : 7;
        		
        		for (var i = 0; i < count; i++) {
            		row.append("<td>");
            		
            		var element = row[0].children[row[0].children.length - 1];
            		
            		element.style.boxSizing = "border-box";
            		//element.style.width = args.tickSize + "px";
            		
            		angular.element(element).append("<div style='width:{0}px;'><p class='day'>{1}</p><p class='month'>{2}</p></div>"
            				.format(args.tickSize, abbreviateDay(dayIndex).toUpperCase(), abbreviateDate(monthIndex, dateIndex, true).toUpperCase()));
            		
            		date = new Date(date.getTime() + 24 * 60 * 60 * 1000);
            		
            		dayIndex = date.getDay();
                	monthIndex = date.getMonth();
                	dateIndex = date.getDate();
            	}
        	}

        	updateElements(14);
        	
        	var children = row[0].children;
        	
        	//children[0].addClass("left-rounded");
        	//children[children.length - 1].addClass("right-rounded");
        	
        	children[0].addClass("selected");
        	
        	var selected = children[0];
        	
        	function selectDate(index, async) {
        		selected.removeClass("selected");
        		
        		selected = children[index];
        		
        		selected.addClass("selected");
        		
        		var selectedDate = new Date(today.getTime() + 24 * 60 * 60 * 1000 * index);
        		
        		scope.ngModel = moment(selectedDate).format("M/DD/YYYY");
        		
        		if (async) {
        			scope.$apply();
        		}
        	}
        	
        	selectDate(0);
        	
        	var d3Element = d3.select(table);
        	
        	d3Element.on("click", function () {
        		var coords = [0, 0];
        		coords = d3.mouse(this);
        		
        		selectDate(Math.floor(coords[0] / args.tickSize), true);
        	});
        	
        	draggable(d3Element, args);
        },
		templateUrl: 'Shared/Templates/DateSelect.html'
    };
});
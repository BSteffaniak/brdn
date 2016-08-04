app.directive('lineChart', [function() {
	return {
		restrict: 'E',
        replace: true,
        template: "<svg width='0' height='0'></svg>",
		scope: {
			data: "="
		},
		link: function(scope, elements, attrs) {
            var svg = d3.select(elements[0])
               .style("width", "100%")
               .style("height", "300px");
			   
			var x = d3.scale.linear();
			var y = d3.scale.linear();
			
			var minX = d3.min(scope.data, function (d) {
				return d.time;
			});
			
			var maxX = d3.max(scope.data, function (d) {
				return d.time;
			});
			
			var height = 260;
			
			x.domain([minX, maxX]).range([20, 280]);
			y.domain([0, scope.data.length]).range([height, 40]);
			
			var xAxis = d3.svg.axis().scale(x).orient("bottom");
			var yAxis = d3.svg.axis().scale(y).orient("left");
			
			var line = d3.svg.line()
				.x(function(d) { return x(d.time); })
				.y(function(d) { return y(scope.data.indexOf(d)); });
				
			var area = d3.svg.area()
				.x(function(d) { return x(d.time); })
				.y0(height)
				.y1(function(d) { return y(scope.data.indexOf(d)); });
				
			scope.lineColor = typeof scope.lineColor !== 'undefined' ? scope.lineColor : "#4491c9";
			scope.lineSize = typeof scope.lineSize !== 'undefined' ? scope.lineSize : 2;
			scope.pointColor = typeof scope.pointColor !== 'undefined' ? scope.pointColor : "#4491c9";
			scope.axisColor = typeof scope.axisColor !== 'undefined' ? scope.axisColor : "#000";
			scope.axisWidth = typeof scope.axisWidth !== 'undefined' ? scope.axisWidth : "2px";
			scope.areaOpacity = typeof scope.areaOpacity !== 'undefined' ? scope.areaOpacity : 0.3;
			
			var xAxisSelection = svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);
			
			xAxisSelection.select("path.domain")
				.style("fill", "none")
				.style("stroke", scope.axisColor)
				.style("stroke-width", scope.axisWidth)
				
			svg.append("path")
				.datum(scope.data)
				.attr("class", "area")
				.style("fill", scope.areaColor || scope.lineColor)
				.style("opacity", scope.areaOpacity)
				.attr("d", area);
			
			svg.append("path")
				.datum(scope.data)
				.attr("class", "line")
				.style("fill", "none")
				.style("stroke", scope.lineColor)
				.style("stroke-width", scope.lineSize)
				.attr("d", line);
            
			svg.selectAll(".point").data(scope.data).enter()
				.append("circle")
				.attr("cx", function (d) {
					return x(d.time);
				})
				.attr("cy", function (d) {
					return y(scope.data.indexOf(d));
				})
				.attr("r", 3)
				.attr("fill", scope.pointColor);
        }
    };
}]);
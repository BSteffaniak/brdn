app.directive('trSeparator', function() {
	return {
        restrict: 'E',
        link: function (scope, element, attributes) {
        	scope.thickness = typeof attributes.thickness !== 'undefined' ? attributes.thickness : "1px";
        	scope.borderStyle = typeof attributes.borderStyle !== 'undefined' ? attributes.borderStyle : "solid";
        	scope.color = typeof attributes.color !== 'undefined' ? attributes.color : "#eaecec";
        	scope.marginLeft = typeof attributes.marginLeft !== 'undefined' ? attributes.marginLeft : "0px";
        	scope.marginRight = typeof attributes.marginRight !== 'undefined' ? attributes.marginRight : "0px";
        	scope.marginTop = typeof attributes.marginTop !== 'undefined' ? attributes.marginTop : "6px";
        	scope.marginBottom = typeof attributes.marginBottom !== 'undefined' ? attributes.marginBottom : "6px";
        	
        	if (typeof attributes.margin !== 'undefined') {
        		var margins = attributes.margin.split(/\s+/);
        		
        		scope.marginTop = margins[0];
        		
        		if (margins.length == 2) {
        			scope.marginBottom = margin[0];
        			scope.marginLeft = margin[1];
        			scope.marginRight = margin[1];
        		}
        		if (margins.length == 4) {
        			scope.marginBottom = margin[2];
        			scope.marginLeft = margin[3];
        			scope.marginRight = margin[1];
        		}
        	}
        	
        	d3.select(element[0])
        		.classed("separator", true)
        		.style("margin-left", scope.marginLeft)
        		.style("margin-right", scope.marginRight)
        		.style("margin-top", scope.marginTop)
        		.style("margin-bottom", scope.marginBottom)
        		.style("border-bottom-width", scope.thickness)
        		.style("border-bottom-style", scope.borderStyle)
        		.style("border-bottom-color", scope.color);
        }
    };
});
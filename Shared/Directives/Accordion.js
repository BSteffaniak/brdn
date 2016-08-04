app.directive('trAccordion', function($compile, $interpolate, $templateCache, $timeout) {
	return {
        restrict: 'A',
        link: function (scope, elements, attributes) {
        	var element = d3.select(elements[0]);
        	attributes.speed = typeof attributes.speed !== 'undefined' ? parseFloat(attributes.speed) / 1000 : 0.3;
        	interpolatedHeader = $interpolate(attributes.header)(scope);
        	
        	var headerElement;
        	
        	if (interpolatedHeader == attributes.header && attributes.header == "previous-element") {
        		headerElement = d3.select(previousElement(element.node()));
        	} else if (interpolatedHeader == attributes.header && attributes.header.indexOf("parent-element") == 0) {
				if (attributes.header.indexOf("(") > 0) {
					var selector = attributes.header.substring(attributes.header.indexOf("(") + 1, attributes.header.indexOf(")"));
					
					headerElement = element.parentSelect(selector);
				} else {
					headerElement = d3.select(element.node().parentNode);
				}
			} else if (interpolatedHeader == attributes.header && attributes.header == "this-element") {
				headerElement = element;
			} else {
        		headerElement = d3.select(attributes.header);
        	}
        	
        	attributes.header = interpolatedHeader;
        	
        	var maxHeight = element.style("max-height");
        	
        	if (typeof attributes.open === 'string' && attributes.open !== "false") {
        		element.classed("active", true);
        	}
        	if (typeof attributes.group === 'string') {
        		element.classed("accordion-group-" + attributes.group, true);
        	}
        	
        	element.style("overflow-y", "auto")
        		.classed("wolfpaq-accordion", true);
        	
        	headerElement
        		.classed("wolfpaq-accordion-header", true)
        		.on("click", function () {
					// Set up the transitions only when first clicked in order to keep the elements from transitioning when first loaded.
	        		if ((!element.style("transition").length && !element.style("-webkit-transition").length) ||
	        				(element.style("transition").indexOf("all") === 0 || element.style("-webkit-transition").indexOf("all") === 0)) {
	        			element.style("-webkit-transition", attributes.speed + "s ease all")
	            			.style("transition", attributes.speed + "s ease all")
	            			.style("-webkit-transition-property", "max-height")
	            			.style("transition-property", "max-height");
	        		}
	        		
	        		if (typeof attributes.group === 'string') {
	        			d3.selectAll(".accordion-group-" + attributes.group).each(function (d, i) {
	        				var selection = d3.select(this);
	        				
	        				if (selection.node() != element.node()) {
	        					selection.classed("active", false);
	        				}
	        			});
	        		}
	        		
	        		element.classed("active", !element.classed("active"));
	        	});
        }
    };
});
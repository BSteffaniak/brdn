app.directive('trPopup', function($compile, $interpolate, $templateCache) {
	return {
        restrict: 'A',
        link: function (scope, element, attributes) {
        	var currentElements;
        	
        	function deletePopup() {
        		for (var i = 0; i < currentElements.length; i++) {
    				currentElements[i].remove();
    			}
        	}
        	
        	scope.redirect = function (location) {
        		var parameters;
        		var qIndex = location.indexOf("?");
        		
        		if (qIndex > 0) {
        			parameters = getQueryVariables(location.substr(qIndex + 1));
        			
        			location = location.substr(0, location.indexOf("?"));
        		}
        		
        		if (true || relative) {
        			location = scope.$parent.currentPage.key + "/" + location;
        		}
        		
        		scope.$parent.openUrl(location, parameters);
        		
        		deletePopup();
        	};
        	
        	scope.getLink = function (location) {
        		if (true || relative) {
        			location = scope.$parent.currentPage.key + "/" + location;
        		}
        		
        		return location;
        	};
        	
        	if (typeof attributes.data !== 'undefined') {
        		scope.header = scope.$eval(attributes.data.header);
        		scope.headers = scope.$eval(attributes.data.headers);
        		scope.links = scope.$eval(attributes.data.links);
        	}
        	if (typeof attributes.headers !== 'undefined') {
        		scope.headers = $interpolate(attributes.headers)(scope).split(",").map(function (d) { return d.trim(); });
        	}
        	if (typeof attributes.links !== 'undefined') {
        		scope.links = $interpolate(attributes.links)(scope).split(",").map(function (d) { return d.trim(); });
        	}

        	scope.header = typeof attributes.header !== 'undefined' ? $interpolate(attributes.header)(scope) : attributes.header;
        	
        	element[0].onclick = function () {
        		var template = $templateCache.get('Popup.html');
        		currentElements = $compile(template)(scope);
        		
        		// Don't forget this stupid line.
        		scope.$apply();
        		
        		for (var i = 0; i < currentElements.length; i++) {
        			document.body.appendChild(currentElements[i]);
        		}
        		
        		currentElements[1].onclick = function () {
        			deletePopup();
        		};
        	}
        }
    };
});
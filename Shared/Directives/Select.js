app.directive('select', ['$stateParams', '$timeout', function($stateParams, $timeout) {
    return {
		restrict: 'EA',
		scope: {
			options: "=",
            ngModel: "=?",
            label: "=?",
            backgroundColor: "@?",
            backgroundClass: "@?",
            darken: "=?",
            page: "@?",
            active: "=?"
		},
        transclude: true,
        compile: function(elements, attrs, transclude) {
			var element = elements[0];
            
            var d3Element = d3.select(element);
            
            d3Element.classed("select", true);
			
            return function (scope, children, iAttrs) {
                transclude(scope, function(clones) {
                    if (scope.page) {
                        var skip = false;
                        
                        $timeout(function () {
                            d3Element.select("div.page-container").on("click", function (e) {
                                skip = true;
                            });
                            
                            d3Element.on("click", function (e) {
                                if (!skip) {
                                    scope.active = !scope.active;
                                    
                                    scope.$apply();
                                }
                                
                                skip = false;
                            });
                        });
                        
                        var args = {};
                        
                        if (attrs.params) {
                            watchParams(scope, $stateParams, attrs.params, args);
                        }
                    } else {
                        scope.ngModel = typeof scope.ngModel !== 'undefined' ? scope.ngModel : scope.options[0];
                        scope.label = typeof attrs.label !== 'undefined' ? scope.label : scope.ngModel;
                        
                        if (typeof scope.backgroundColor === 'undefined') {
                            if (typeof scope.backgroundClass !== 'undefined') {
                                scope.backgroundColor = getCssStyleAttributeValue("background-color", { className: scope.backgroundClass });
                            } else {
                                scope.backgroundColor = getCssStyleAttributeValue("background-color", { element: element });
                                
                                scope.darken = typeof attrs.darken === 'undefined' ? true : scope.darken;
                            }
                        }
                        
                        scope.active = false;
                        
                        scope.optionSelected = function (e, option) {
                            scope.ngModel = option;
                            scope.label = typeof attrs.label !== 'undefined' ? scope.label : scope.ngModel;
                            
                            scope.active = false;
                            
                            e.stopPropagation();
                            
                            return false;
                        };
                        
                        var listener = function (e) {
                            if (element == null) {
                                document.removeEventListener("click", listener);
                                
                                return;
                            }
                            
                            if (!e.target.isChildOf(element, true) && scope.active) {
                                scope.$apply(function () {
                                    scope.active = false;
                                });
                            }
                        };
                        
                        document.addEventListener("click", listener);
                        
                        d3Element.on("click", function (e) {
                            scope.$apply(function () {
                                scope.active = !scope.active;
                            });
                        });
                    }
                });
            };
        },
        templateUrl: "Shared/Templates/Select.html"
    };
}]);
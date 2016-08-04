app.directive('settingsList', ['$sce', function($sce) {
	return {
		restrict: 'E',
		scope: true,
        transclude: true,
        compile: function(elements, attrs, transclude) {
			var element = elements[0];
			
            return function (scope, children, iAttrs) {
                transclude(scope, function(clone) {
					var parent = clone;
					
		            scope.sections = [];
		            
		            function createSetting(settingElement, section) {
		                var setting = {};
		                
						setting.text = $sce.trustAsHtml(settingElement.firstChild.outerHTML || settingElement.firstChild.data);
						setting.disabled = section.disabled || settingElement.hasAttribute("disabled") && scope.$parent.$eval(settingElement.getAttribute("disabled"));
						
						for (var i = 0; i < settingElement.children.length; i++) {
		                    var child = settingElement.children[i];
		                    var type = child.tagName.toLowerCase();
		                    
		                    if (type == "icon") {
		                        setting.icon = {
									src: child.getAttribute("src")
								};
		                    } else if (type == "slider") {
		                        setting.slider = {};
		                    }
		                }
						
		                return setting;
		            }
		            
		            function createSection(sectionElement) {
		                var section = {};
		                
		                section.name = sectionElement.getAttribute("name");
		                section.settings = [];
						section.disabled = sectionElement.hasAttribute("disabled") && scope.$eval(sectionElement.getAttribute("disabled"));
		                
		                for (var i = 0; i < sectionElement.children.length; i++) {
		                    var child = sectionElement.children[i];
		                    var type = child.tagName.toLowerCase();
		                    
		                    if (type == "setting") {
		                        section.settings.push(createSetting(child, section));
		                    }
		                }
		                
		                return section;
		            }
		            
		            for (var i = 0; i < parent.length; i++) {
		                var child = parent[i];
						
						if (typeof child.tagName !== 'undefined') {
			                var type = child.tagName.toLowerCase();
							
			                if (type == "section") {
			                    scope.sections.push(createSection(child));
			                }
						}
		            }
                });
            };
        },
        templateUrl: "Shared/Templates/SettingsList.html"
    };
}]);
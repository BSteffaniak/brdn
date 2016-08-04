app.directive('fileReader', function() {
	return {
		scope: {
			fileReader:"="
		},
		link: function(scope, element) {
			var file = element.attr("src");
			
			var r = new FileReader();
			r.onload = function(e) {
				var contents = e.target.result;
				scope.$apply(function () {
					scope.fileReader = contents;
				});
			};
			
			r.readAsText(file);
		}
	};
});
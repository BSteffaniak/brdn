app.controller('Search', [ '$scope', '$localStorage', '$server', '$mql', function($scope, $localStorage, $server, $mql) {
	$scope.models = {};
	
	$scope.models.searchingText = "";
	$scope.models.resultMessage = "";
	$scope.models.searchText = "";
	
	$scope.search = function (text) {
		if (text.length > 0) {
			$scope.models.searchingText = "Searching...";
			
			$server.get("SearchUsers", {
					search: text
				}, {
					success: function (data) {
						if (text == $scope.models.searchText) {
							$scope.searchResults = data;
							
							$scope.models.searchingText = $scope.searchResults.length > 0 ? "Search results" : "No results found.";
						}
					},
					failure: function (data) {
						$scope.models.searchingText = "Failed to search.";
					},
					retryOnFail: false
				});
		} else {
			$scope.searchResults = undefined;
		}
	};
	
	$server.get("TopFriends", {}, {
		success: function (data) {
			$scope.suggestedFriends = data;
		}
	});
}]);
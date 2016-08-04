app.controller('Name', [ '$scope', function($scope) {
	$scope.onNext(function () {
		if (typeof $scope.fullname === 'undefined' || $scope.fullname.length == 0) {
			$scope.errorOccurred("You must enter your name.");
			
			return false;
		}
		
		var names = $scope.fullname.split(" ");
		
		for (var i = names.length - 1; i >= 0; i--) {
			names[i] = names[i].trim();
			
			if (names[i].length == 0) {
				names.splice(i, 1);
			}
		}
		
		if (names.length <= 1) {
			$scope.errorOccurred("You must enter your full name.");
			
			return false;
		}
		
		var firstnameIndex = 0; 
		var lastnameIndex = 1;
		
		// Roman numeral regex
		var suffixes = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/gi;
		
		if (names.length > 2) {
			lastnameIndex = names.length - 1;
			
			if (names[lastnameIndex].match(suffixes)) {
				lastnameIndex--;
			}
			
			if (lastnameIndex > 3) {
				$scope.errorOccurred("Your name is too long.");
				
				return false;
			}
		}
		
		$scope.userInformation.firstname = names[firstnameIndex];
		
		if ($scope.userInformation.firstname.length > 32) {
			$scope.errorOccurred("Your first name is too long.");
			
			return false;
		}
		
		$scope.userInformation.lastname = names[lastnameIndex];
		
		if ($scope.userInformation.lastname.length > 32) {
			$scope.errorOccurred("Your first name is too long.");
			
			return false;
		}
		
		$scope.userInformation.fullname = names.join(" ");
		
		if ($scope.userInformation.firstname.length > 256) {
			$scope.errorOccurred("Your name is too long.");
			
			return false;
		}
	});
}]);
app.controller('FullName', [ '$scope', '$server', function($scope, $server) {
	$scope.session.signup = $scope.session.signup || {};
	
	$scope.validate = function (e) {
		if (typeof $scope.session.signup.fullName === 'undefined' || $scope.session.signup.fullName.length == 0) {
			$scope.error = "You must enter your name.";
			
			return false;
		}
		
		var names = $scope.session.signup.fullName.split(" ");
		
		for (var i = names.length - 1; i >= 0; i--) {
			names[i] = names[i].trim();
			
			if (names[i].length == 0) {
				names.splice(i, 1);
			}
		}
		
		if (names.length <= 1) {
			$scope.error = "You must enter your full name.";
			
			return false;
		}
		
		var firstNameIndex = 0; 
		var lastNameIndex = 1;
		
		// Roman numeral regex
		var suffixes = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/gi;
		
		if (names.length > 2) {
			lastNameIndex = names.length - 1;
			
			if (names[lastNameIndex].match(suffixes)) {
				lastNameIndex--;
			}
			
			if (lastNameIndex > 3) {
				$scope.error = "Your name is too long.";
				
				return false;
			}
		}
		
		$scope.session.signup.firstName = names[firstNameIndex];
		
		if ($scope.session.signup.firstName.length > 32) {
			$scope.error = "Your first name is too long.";
			
			return false;
		}
		
		$scope.session.signup.lastName = names[lastNameIndex];
		
		if ($scope.session.signup.lastName.length > 32) {
			$scope.error = "Your first name is too long.";
			
			return false;
		}
		
		$scope.session.signup.fullName = names.join(" ");
		
		if ($scope.session.signup.firstName.length > 256) {
			$scope.error = "Your name is too long.";
			
			return false;
		}
		
		$scope.openUrl(e.target.getAttribute("url"));
	};
	
	submitFunction = $scope.validate;
}]);
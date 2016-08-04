app.controller('SignUp', [ '$timeout', '$scope', '$server', '$state', function($timeout, $scope, $server, $state) {
	var nextListeners = [];
	
	$scope.errorText = "";
	
	$scope.currentSection = "Home";
	$scope.previousSections = [];
	$scope.nextSections = ["Email", "PhoneNumber", "Name", "Username", "Password", "ProfilePicture"];
	
	$scope.userInformation = {};
	
	$scope.canContinue = $scope.nextSections.length > 0;
	
	$scope.errorOccurred = function (error) {
		$scope.errorText = error;
	};
	
	$scope.onNext = function (callback) {
		nextListeners.push(callback);
	};
	
	$scope.previous = function () {
		$scope.errorText = "";
		nextListeners = [];
		
		$("#sign-up-container").animate({ left: "+=50%" }, function () {
			$scope.$apply(function () {
				$scope.nextSections.unshift($scope.currentUrl);
				$scope.currentUrl = $scope.previousSections.pop();
				
				$("#sign-up-container").css("left", "-50%");
				$("#sign-up-container").animate({ left: "50%" }, 300);
			});
		});
	};
	
	function registerUser() {
		var requestData = {
			userName: $scope.userInformation.username,
			email: $scope.userInformation.email,
			firstName: $scope.userInformation.firstname,
			lastName: $scope.userInformation.lastname,
			fullName: $scope.userInformation.fullname,
			password: $scope.userInformation.password,
			phoneNumber: $scope.userInformation.phoneNumber
		};
		
		$server.dataRequest("RegisterUser", requestData, function (data) {
			requestData.password = undefined;
			$scope.userInformation.password = undefined;
			
			$scope.home();
		});
	}
	
	$scope.next = function () {
		var success = true;
		
		for (var i = 0; i < nextListeners.length; i++) {
			success = nextListeners[i]() !== false && success;
		}
		
		if (success) {
			$scope.errorText = "";
			nextListeners = [];
			
			$("#sign-up-container").animate({ left: "-50%", }, 300, function () {
				$scope.$apply(function () {
					$scope.previousSections.push($scope.currentUrl);
					
					if ($scope.nextSections.length > 0) {
						$scope.currentUrl = $scope.nextSections.shift();
					} else {
						registerUser();
					}
				});

				$("#sign-up-container").css("left", "100%");
				$("#sign-up-container").animate({ left: "50%" }, 300);
			});
		}
	};
	console.log("hey ", $scope.currentSection)
	$scope.init = function () {
		$state.transitionTo("SplashScreen." + $scope.currentSection);
	}
	
	$scope.facebookSignIn = function () {
	    $scope.leavingPage();
	    
	    $scope.home();
	};
	
	$scope.setScreenOrientation("portrait");
}]);
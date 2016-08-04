var sendImagePart, finishImageSend, startImageSend;

'use strict';
app.controller('ProfilePicture', [ '$scope', '$registerUtils', function($scope, $registerUtils) {
	$scope.session.signup = $scope.session.signup || {};
	
	var fr = new FileReader();
	
	var img = document.getElementById("picture");
	var profilePicture;
	
	$scope.selectPicture = function () {
		androidContext.selectPicture();
	};
	
	$scope.takePicture = function () {
		androidContext.takePicture();
	};
	
	var imageData = "";
	
	startImageSend = function () {
		imageData = "";
	};
	
	sendImagePart = function (encoded) {
		imageData += encoded.replace(/>/g, "\n");
	};
	
	finishImageSend = function () {
        img.addEventListener("load", imageLoaded);
		img.src = "data:image/jpeg;base64," + imageData;
	};
	
	function imageLoaded() {
		$scope.imgStyle = {};
		$scope.imgStyle[img.width < img.height ? "width" : "height"] = "100%";
		
		$scope.$apply();
	}
	
	function createImage() {
        img.addEventListener("load", imageLoaded);
        img.src = fr.result;
    }
	
	$scope.attachedFile = function(element) {
		if (element.files[0] != profilePicture) {
            profilePicture = element.files[0];
			
            fr.onload = createImage;
            fr.readAsDataURL(profilePicture);
	        
			$scope.$apply();
		}
    };
	
	$scope.valid = function () {
		if (typeof profilePicture === 'undefined' && imageData.length == 0) {
			$scope.error = "You haven't uploaded a picture";
			
			return false;
		}
		
		$scope.session.signup.profilePicture = profilePicture;
		$scope.session.signup.imageData = imageData;
		
		return true;
	};
	
	$scope.validate = function (e) {
		if ($scope.valid()) {
			$scope.openUrl(e.target.getAttribute("url"))
			
			return true;
		}
		
		return false;
	};
	
	submitFunction = $scope.platform == "web" ? function() {} : $scope.validate;
	
	$scope.success = false;
	
	$scope.register = function () {
		$scope.success = null;
		
		$registerUtils.register(function (success) {
			$scope.success = success;
			
			if (success) {
				$scope.openUrl("Events");
			}
		});
	};
}]);
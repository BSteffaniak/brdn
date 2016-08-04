app.service('$registerUtils', ['$localStorage', '$server', '$loginUtils', function ($localStorage, $server, $loginUtils) {
	var self = this;
	
	this.register = function (callback) {
		if ($localStorage.signup) {
			var fd = new FormData();
			fd.append('file', $localStorage.signup.profilePicture);
			
			var profilePicture = $localStorage.signup.profilePicture;
			var imageData = $localStorage.signup.imageData;
			var imageDimensions = $localStorage.signup.imageDimensions;
			
			if (profilePicture) {
				$localStorage.signup.profilePicture = undefined;
				$localStorage.signup.imageDimensions = undefined;
			} else if (imageData) {
				$localStorage.signup.imageData = undefined;
				$localStorage.signup.imageDimensions = undefined;
			}
			
			$server.post("RegisterUser", $localStorage.signup, {
					success: function (data) {
						if (data.user) {
							$localStorage.signup = undefined;
							
							$loginUtils.setData(data);
							
							if (profilePicture) {
								$server.uploadFile("ProfilePicture", profilePicture, {
										callback: function (success) {
											if (!success) {
												console.log("Failed to upload profile picture");
											}
											
											callback(success);
										},
										data: { imageDimensions: imageDimensions }
									});
							} else if (imageData) {
								$server.post("ProfilePictureData", { data: imageData, imageDimensions: imageDimensions }, {
										callback: function (success) {
											if (!success) {
												console.log("Failed to upload profile picture");
											}
											
											callback(success);
										}
									});
							} else {
								callback(true, data);
							}
						} else {
							console.log("Failed to log in");
							callback(false);
						}
					},
					error: function (data) {
						callback(false);
					}
				});
		}
	};
}]);
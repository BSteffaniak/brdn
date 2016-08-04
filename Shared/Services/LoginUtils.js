app.service('$loginUtils', ['$rootScope', '$localStorage', '$interval', '$timeout', '$server', '$utils', function ($rootScope, $localStorage, $interval, $timeout, $server, $utils) {
	var self = this;
	
	function broadcast() {
		self.latestLoginArgs = { loggedIn: self.loggedIn };
		
		$rootScope.$broadcast("login-updated", self.latestLoginArgs);
	}
	
	function setLoggedIn() {
		var value = $localStorage.user && typeof $localStorage.user.id !== 'undefined';
		
		self.loggedIn = value;
		
		broadcast();
		
		return value;
	}
	
	this.loggedIn = setLoggedIn();
	
	this.login = function (username, password, callback) {
		$server.put("LoginUser", { username: username, password: password }, {
			success: function (data) {
				self.setData(data);
				
				callback(self.loggedIn);
			},
			failure: function (data) {
				callback();
			}
		});
	};
	
	this.logout = function () {
		self.setData({});
        
		self.loggedIn = setLoggedIn();
		
		//if (!self.loggedIn) {
			logoutFunctions.forEach(function (func) {
				func();
			});
		//}
		
		$server.delete("LogoutUser", {}, {
			callback: function (response) {
				if (!response) {
					$timeout(function () {
						self.logout();
					}, 1000);
				}
			}
		});
	};
	
	this.setData = function (data) {
		$localStorage.$reset();
		
		for (var key in data) {
			$localStorage[key] = data[key];
		}
		
		setLoggedIn();
	};
	
	var logoutFunctions = [];
	
	this.onLogout = function(callback) {
		logoutFunctions.push(callback);
	};
	
	/*$interval((function () {
		$server.get("GetLoginData", {}, function (response) {
			self.setData(response);
			
			self.loggedIn = setLoggedIn();
			
			if (self.loggedIn) {
				
			}
			else {
				logoutFunctions.forEach(function (func) {
					func();
				});
			}
		}, function (response) {
			self.logout();
		})
		
		return this;
	})(), 100000);*/
	
	$rootScope.$on("$routeChangeSuccess", function(e, a, b) {
		broadcast();
	});
}]);

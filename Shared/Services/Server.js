app.service("$server", ['$http', '$utils', '$timeout', '$localStorage', function ($http, $utils, $timeout, $localStorage) {
	var self = this;
	
	this.handleResponse = function (args) {
		return function (response) {
			var successful = typeof response === 'string' && response.length > 0;

			if (successful) {
				if (typeof args.success === 'function') {
					args.success(JSON.parse(response));
				}
			} else {
				if (typeof failure === 'function') {
					failure(response);
				} else {
					console.error("Failed: " + response);
				}
			}

			if (typeof callback === 'function') {
				callback(successful);
			}
		};
	};

	this.specificRequest = function (url, data, args) {
		if ($utils.isAndroid) {
			var returned = androidContext.specificRequest(url, JSON.stringify(data));
			
			var successful = typeof returned === 'string' && returned.length > 0; 

			if (successful) {
				if (typeof args.success === 'function') {
					args.success(JSON.parse(returned));
				}
			} else {
				if (typeof args.failure === 'function') {
					args.failure(returned);
				} else {
					console.error("Failed: " + returned);
				}
			}
			
			if (typeof args.callback === 'function') {
				args.callback(successful);
			}
		} else if ($utils.isIPhone) {
			iphoneContext.specificRequest(url, data, args);
		} else {
			self.specificServerRequest(url, data, args);
		}
	};
	
	this.sendData = function (type, data, args) {
		args = typeof args !== 'undefined' ? args : {};
		
		if ($utils.isAndroid) {
			data.dataRequestType = type;
			
			var returned = androidContext.sendData(JSON.stringify(data));
			
			var successful = typeof returned === 'string' && returned.length > 0;
			
			if (successful) {
				if (typeof args.success === 'function') {
					args.success(JSON.parse(returned));
				}
			} else {
				if (typeof args.failure === 'function') {
					args.failure(returned);
				} else {
					console.error("Failed: " + returned);
				}
			}
			
			if (typeof args.callback === 'function') {
				args.callback(successful);
			}
		} else if ($utils.isIPhone) {
			
		} else {
			self.sendDataToServer(type, data, args);
		}
	};
	
	this.dataRequest = function ($mql, args) {
		var data;
		
		if (getClassName($mql) === '[object Array]') {
			data = { queries: $mql.map(function (q) { return q.query; }), parameters: $mql.map(function (q) { return q.parameters; }) };
		} else {
			data = { query: $mql.query, parameters: $mql.parameters };
		}
		
		if ($utils.isAndroid) {
			var returned = androidContext.dataRequest(JSON.stringify(data));
			
			var successful = typeof returned === 'string' && returned.length > 0 && returned[0] != "<";
			
			if (successful) {
				if (typeof args.success === 'function') {
					args.success(JSON.parse(returned));
				}
			} else {
				if (typeof args.failure === 'function') {
					args.failure(returned);
				} else {
					console.error("Failed: " + returned);
				}
			}
			
			if (typeof args.callback === 'function') {
				args.callback(successful);
			}
		} else if ($utils.isIPhone) {
			iphoneContext.specificRequest("query", data, args);
		} else {
			self.specificServerRequest("query", data, args);
		}
	};
	
	this.serverDataRequest = function ($mql, args) {
		self.specificServerRequest("query", { query: $mql.query, parameters: $mql.parameters }, args);
	};
	
	this.sendDataToServer = function (type, data, args) {
		data.dataRequestType = type;
		
		self.specificServerRequest("dataReceiver", data, args);
	};
	
	this.get = function (url, data, args) {
		args.method = "GET";
		
		self.specificServerRequest(url, data, args);
	};
	
	this.post = function (url, data, args) {
		args.method = "POST";
		
		self.specificServerRequest(url, data, args);
	};
	
	this.put = function (url, data, args) {
		args.method = "PUT";
		
		self.specificServerRequest(url, data, args);
	};
	
	this.delete = function (url, data, args) {
		args.method = "DELETE";
		
		self.specificServerRequest(url, data, args);
	};
	
	this.uploadFile = function (url, file, args) {
		args.headers = args.headers ? args.headers : {};
		
		var fd = new FormData();
		fd.append('file', file);
		
		if (typeof $localStorage.authentication === 'object') {
			args.headers['authentication-key'] = $localStorage.authentication.key;
		}
		if (typeof args.data === 'object') {
			for (var key in args.data) {
				var data = args.data[key];
				
				if (typeof data === 'object') {
					data = JSON.stringify(data);
				}
				
				fd.append(key, data);
			}
		}
		
		// args.server = typeof args.server !== 'undefined' ? args.server : "https://rest.wolfpaq.co";
		args.server = typeof args.server !== 'undefined' ? args.server : "http://10.0.0.102:8080";
		
		if (args.server.length == 0 || args.server[args.server.length - 1] != '/') {
			args.server += "/";
		}
		
		args.headers['Content-Type'] = undefined;
		
		$http.post(args.server + url, fd, {
			transformRequest: angular.identity,
			headers: args.headers
		})
		.success(function(data) {
			if (data.success) {
				if (typeof args.success === 'function') {
					args.success(data);
				}
			} else {
				if (typeof args.failure === 'function') {
					args.failure(data);
				}
			}
			
			if (typeof args.callback === 'function') {
				args.callback(data.success, data);
			}
		})
		.error(function (data) {
			if (typeof args.failure === 'function') {
				args.failure(data);
			}
			if (typeof args.callback === 'function') {
				args.callback(false, data);
			}
		});
	}
	
	this.specificServerRequest = function (url, data, args) {
		// args.server = typeof args.server !== 'undefined' ? args.server : "http://rest.wolfpaq.co:8080";
		args.server = typeof args.server !== 'undefined' ? args.server : "http://10.0.0.102:8080";
		//args.server = typeof args.server === 'string' ? args.server : "/";
		args.retryOnFail = typeof args.retryOnFail !== 'undefined' ? args.retryOnFail : false;
		args.retryDelay = typeof args.retryDelay !== 'undefined' ? args.retryDelay : 200;
		args.method = typeof args.method !== 'undefined' ? args.method : "GET";
		args.headers = args.headers ? args.headers : {};
		
		if (args.server.length == 0 || args.server[args.server.length - 1] != '/') {
			args.server += "/";
		}
		
		if (typeof $localStorage.authentication === 'object') {
			args.headers["authentication-key"] = $localStorage.authentication.key;
		}
		
		if (["POST", "PUT"].indexOf(args.method) >= 0) {
			args.headers['Accept'] = 'application/json';
			args.headers['Content-Type'] = 'application/json';
		} else {
			url += generateQueryString(data);
			
			data = undefined;
		}
		
		if ($utils.isAndroid) {
			var returned = androidContext.specificRequest(args.method, url, JSON.stringify(data));
			
			var successful = typeof returned === 'string' && (returned.length == 0 || returned[0] != "<");
			
			var parsed;
			
			if (successful) {
				parsed = returned.length > 0 ? JSON.parse(returned) : "";
				
				if (typeof args.success === 'function') {
					args.success(parsed);
				}
			} else {
				if (typeof args.failure === 'function') {
					args.failure(returned);
				} else {
					console.error("Failed: " + returned);
				}
			}
			
			if (typeof args.callback === 'function') {
				args.callback(successful, parsed);
			}
		} else {
			var req = {
				method: args.method,
				url: args.server + url,
				data: data,
				headers: args.headers
			};
			
			$http(req)
				.then(function (response) {
					if (typeof args.success === 'function') {
						args.success(response.data);
					}
					if (typeof args.callback === 'function') {
						args.callback(true);
					}
				}, function (response) {
					if (typeof args.failure === 'function') {
						args.failure(response.data);
					}
					if (typeof args.callback === 'function') {
						args.callback(false);
					}
					
					if (args.retryOnFail) {
						if (typeof args.retryDelay !== 'number' || args.retryDelay <= 0) {
							self.specificServerRequest(url, data, args);
						} else {
							$timeout(function () {
								self.specificServerRequest(url, data, args);
							}, args.retryDelay);
						}
					}
				});
			}
	};
}]);
var onBackPressed;
var onSwipeRight;
var onSwipeLeft;

var iphoneCallbacks = {};
var iphoneContext = {};
var iphoneCallbackID = 0;

app.controller('App', [ '$timeout', '$window', '$interpolate', '$filter', '$http', '$rootScope', '$scope', '$state', '$stateParams', '$templateCache', '$localStorage', '$loginUtils', '$analytics', '$server', '$utils', '$mql', '$location', '$anchorScroll', function($timeout, $window, $interpolate, $filter, $http, $rootScope, $scope, $state, $stateParams, $templateCache, $localStorage, $loginUtils, $analytics, $server, $utils, $mql, $location, $anchorScroll) {
	//$scope.testing = "Happenings/Happenings.html";
	//$scope.testing = "ViewHappening/ViewHappening.html";//"ViewWolfpaq/ViewWolfpaq.html";
	//$scope.testingParameters = { id: 1 };
	
	$rootScope.contextParams = $utils.contextParams;
	
	iphoneContext.specificRequest = function (url, data, success, failure, callback) {
		var messageData = {
			url: url,
			data: JSON.stringify(data),
			callbackID: "callback" + iphoneCallbackID++
		};
		
		iphoneCallbacks[messageData.callbackID] = $server.handleResponse(success, failure, callback);
		
		window.webkit.messageHandlers.specificRequest.postMessage(messageData);
	};
	
	$scope.session = $localStorage;
	
	$scope.mobileStyle = $utils.isMobile;
	
	$scope.sitemap = getSitemap();
	
	if ($utils.isAndroid) {
		$scope.platform = "android";
	} else if ($utils.isIPhone) {
		$scope.platform = "ios";
	} else {
		$scope.platform = "web";
	}
	
	$analytics.updateViewingPlatform($scope.platform);
	
	window.onresize = function () {
		$scope.$apply(checkSize);
	};
	
	function checkSize() {
		var w = window,
	    d = document,
	    e = d.documentElement,
	    g = d.getElementsByTagName('body')[0],
	    width = w.innerWidth || e.clientWidth || g.clientWidth,
	    height = w.innerHeight|| e.clientHeight|| g.clientHeight;
		
		$scope.mobileStyle = $utils.isMobile || width < 900;
	}
	
	checkSize();
	
	function loadTemplates() {
		function putTemplateCache(location, key) {
			$http.get(location).then(function (result) {
				$templateCache.put(key, result.data.replace(/[\n\r]\t*/g, "").trim());
			});
		}
		
		putTemplateCache("Shared/Templates/Popup.html", "Popup.html");
	}
	
	loadTemplates();
	
	$scope.optionsData = {
		visible: false
	};
	
	$scope.header = {
		text: "",
		elements: {
			"_not_loaded": {}
		},
		defaultElements: {
			
		},
		updated: false
	};
	
	function updateHeaderPolarization() {
		var value = $scope.header.elements;
		
		if (value["header-text"]) {
			value["header-text-original"] = value["header-text-original"] || cloneObject(value["header-text"], true);
			
			value["header-text"].text = $interpolate(value["header-text-original"].text)($scope);
		}
	}
	
	$scope.$watch("header.elements", function (value) {
		updateHeaderPolarization();
		
		$scope.header.visible = Object.keys(value).length > 0;
		
		$scope.header.updated = true;
	}, true);
	
	$scope.menu = {
		elements: {
			"_not_loaded": {}
		},
		defaultElements: {
		
		},
		clicked: function () {
			
		},
		buttons: {
			navigation: [],
			action: []
		},
		updated: false,
		using: false,
		active: true,
		open: false
	};
	
	var buttons; // See the login-updated broadcast
	
	$scope.$watch("menu.elements", function (value) {
		$scope.menu.using = Object.keys(value).length > 0;
		$scope.menu.iconsUpdated = false;
		$scope.menu.updated = true;
	}, true);
	
	$scope.deviceName = $utils.isMobile ? "Phone" : "Computer";
	
	$scope.getType = function (input) {
		return typeof input;
	};
	
	$scope.global = {
		history: []
	};
	
	$scope.errorOccurred = function (type, message) {
		var data = {
			errorType: type,
			errorMessage: message
		};
		
		$scope.openUrl("Error/Error.html", data);
	};
	
	$scope.firstOr = function(values, input) {
		if (!values) {
			return;
		}
		
		if (values.length > 1) {
			return input;
		}
		
		return values[0];
	};
	
	$scope.openUrl = function (url, args) {
		$scope.global.history.push(arguments);
		
		$scope.optionsData.visible = false;
		$scope.header.text = "";
		
		document.location.href = '#/' + url + generateQueryString(args);
	};
	
	$scope.removePhoto = function (parameters) {
		
	};
	
	$scope.takePhoto = function (parameters) {
		$scope.home();
	};
	
	$scope.uploadPhoto = function (parameters) {
		
	};
	
	$scope.importPhotoFromUrl = function (parameters) {
		
	};
	
	$scope.options = function () {
		$scope.optionsData.visible = !$scope.optionsData.visible;
	};
	
	$scope.back = function () {
		$scope.global.history.pop();
		
		var history = $scope.global.history.pop();
		
		history = typeof history !== 'undefined' ? history : ["Events"];
		
		$scope.openUrl.apply($scope.openUrl, history);
	};
	
	$scope.openSection = function (section) {
		var currentIndex = $scope.sections.indexOf($scope.currentSection);
		var newIndex = $scope.sections.indexOf(section);
		
		$scope.currentSection.active = false;
		section.active = true;
		
		$scope.currentSection = section;
		
		d3.select("#view-table")
			.style("left", (-newIndex * 100) + "%");
		
		$timeout(function () {
			d3.select("#view-table").classed("loading", false);
		});
		
		$rootScope.$broadcast("section-change", section);
	};
	
	$scope.$on("section-change", function () {
		$scope.menu.visible = true;
	});
	
	$scope.events = {
		onSwipeLeft: function () {
			for (var i = 0; i < $scope.sections.length; i++) {
				var section = $scope.sections[i];
				
				if (section.active && i < $scope.sections.length - 1) {
					$scope.openSection($scope.sections[i + 1]);
					
					break;
				}
			};
		},
		onSwipeRight: function () {
			for (var i = 0; i < $scope.sections.length; i++) {
				var section = $scope.sections[i];
				
				if (section.active && i > 0) {
					$scope.openSection($scope.sections[i - 1]);
					
					break;
				}
			};
		}
	};
	
	onBackPressed = $scope.back;
	onSwipeLeft = $scope.events.onSwipeLeft;
	onSwipeRight = $scope.events.onSwipeRight;
	
	/*$scope.openUrl = function (url, params) {
		if ($scope.contentUrl == url) $scope.contentUrl = null;
		
		$scope.global.history.push(arguments);
		
		$scope.params = params;
		$scope.contentUrl = url;
		
		$scope.optionsData.visible = false;
		$scope.header.text = "";
	};*/
	
	$scope.setScreenOrientation = function (orientation) {
		if ($utils.isAndroid) {
			androidContext.setScreenOrientation(orientation);
		} else if ($utils.isIPhone) {
			
		}
	};
	
	$scope.resetScreenOrientation = function () {
		if ($utils.isAndroid) {
			androidContext.resetScreenOrientation();
		} else if ($utils.isIPhone) {
			
        }
	}
	
	$scope.getPhoneNumber = function () {
		if ($utils.isAndroid) {
			return androidContext.getPhoneNumber();
		} else if ($utils.isIPhone) {
			
		}
	};
	
	$scope.getContacts = function () {
		if ($utils.isAndroid) {
			return JSON.parse(androidContext.getContacts());
		} else if ($utils.isIPhone) {
			
		}
	};
	
	$scope.phoneNumber = $scope.getPhoneNumber();
	$scope.contacts = $scope.getContacts();
	
    $scope.logout = $loginUtils.logout;
	
	//androidContext.sendSMS($scope.phoneNumber, "Hey " + "Braden" + ", I'm inviting you to connect with me in the Wolfpaq Alpha! Get the wolfpaq app on the play store at: https://play.google.com/store/apps/details?id=com.google.android.youtube");
	
	$scope.pageLoaded = function () {
		launchPageLoadedEvents();
	};
	
	function onLogout() {
		$scope.openUrl("SplashScreen");
	}
	
	$loginUtils.onLogout(onLogout);
	
	function loginUpdated() {
		if ($loginUtils.latestLoginArgs.loggedIn) {
			buttons = {
				search: {
					action: function () {
						$scope.openUrl("Search");
					},
					page: $scope.sitemap.pages["Search"],
					src: "Shared/Images/search.svg",
					size: "36px"
				},
				socialize: {
					action: function () {
						$scope.openUrl("Socialize");
					},
					page: $scope.sitemap.pages["Socialize"],
					src: "Shared/Images/socialize.svg",
					size: "42px"
				},
				profile: {
					action: function () {
						$scope.openUrl("ViewProfile", { id: $localStorage.user.id });
					},
					page: $scope.sitemap.pages["ViewProfile"],
					src: $filter('userImage')($localStorage.user.id),
					size: "75%",
					style: {
						"border-radius": "100%"
					},
					centeredVertically: true
				},
				home: {
					action: function () {
						$scope.openUrl("Events");
					},
					page: $scope.sitemap.pages["Events"],
					src: "Shared/Images/home.svg",
					style: {
						"top": "47%"
					},
					size: "34px"
				},
				settings: {
					action: function () {
						$scope.openUrl("Settings");
					},
					src: "Shared/Images/settings-gear.svg",
					style: {
						"top": "47%"
					},
					size: "34px"
				},
				newEvent: {
					action: function () {
						$scope.openUrl("NewEvent");
					},
					page: $scope.sitemap.pages["NewEvent"],
					//src: "Shared/Images/home.svg",
					style: {
						"top": "47%"
					},
					size: "34px"
				}
			};
			
			for (var key in buttons) {
				var button = buttons[key];
				
				(function (button) {
					var oldAction = button.action;
					
					button.action = function () {
						if ($scope.currentPage != button.page) {
							$scope.menu.open = !$scope.menu.open;
							
							oldAction();
						}
					};
				})(button);
				
				button.classes = button.classes || {};
				button.classes["centered-vertically-relative"] = button.centeredVertically !== false;
				button.style = button.style || {};
				button.style.width = button.size;
				button.style.height = button.size;
			}
			
			buttons.newEvent.src = buttons.profile.src;
			
			$scope.menu.buttons = [];
			$scope.menu.buttons.push(buttons.home);
			$scope.menu.buttons.push(buttons.socialize);
			$scope.menu.buttons.push(buttons.newEvent);
			$scope.menu.buttons.push(buttons.search);
			$scope.menu.buttons.push(buttons.profile);
		} else {
			$scope.menu.using = false;
		}
		
		if ($scope.currentPage && !arrayContains(["SplashScreen", "Login", "SignUp"], $scope.currentPage.pageName) && !$loginUtils.loggedIn) {
			onLogout();
		}
	}
	
	if (typeof $loginUtils.latestLoginArgs !== 'undefined') {
		loginUpdated();
	}
	
	$scope.$on("login-updated", function (e, args) {
		loginUpdated();
	});
	
	$scope.random = function (max) {
		return Math.floor(Math.random() * max);
	};
	
	$scope.$on('$stateChangeStart', function(next, current, params) {
		d3.selectAll(".loading-image").remove();
		
		$scope.contentHeight = "calc(100%)";
		
		if (current.redirectTo) {
			next.preventDefault();
			
			$state.go(current.redirectTo, params)
		}
		
		$scope.header.updated = false;
		$scope.menu.updated = false;
		
		$scope.menu.clicked = function () {};
		
		if (current.url) {
			var url = current.url;
			
			url = url.indexOf('/') == 0 ? url.substring(1) : url;
			
			var index = url.indexOf("?");
			
			url = index >= 0 ? url.substring(0, index) : url;
			
			$scope.currentPage = $scope.sitemap.pages[url];
		}
		
		d3.select("#view-table").classed("loading", true);
		
		$scope.currentSection = undefined;
		
		if ($scope.currentPage) {
			$scope.sections = $scope.currentPage.isSection ? $scope.currentPage.parent.sections : $scope.currentPage.sections;
			
			$scope.sections.forEach(function (section, i) {
				section.active = section.defaultActive;
				
				if (section.active) {
					$scope.currentSection = section;
					section.updates = false;
					
					$scope.currentSection = section;
				}
			});
			
			if ($scope.currentSection) {
				$scope.openSection($scope.currentSection);
			} else {
				d3.select("#view-table").style("left", "0%");
				
				$timeout(function () {
					d3.select("#view-table").classed("loading", false);
				});
			}
			
			$scope.contentHeight = "calc(100% - " + ($scope.sections.length > 1 ? 44 : 0) + "px)";
			
			$scope.views = $scope.sections.length > 0 ? $scope.sections : [{ pageName: "" }];
		}
		
		if ($utils.isAndroid) {
			androidContext.urlChanged(url);
		}
	});
	
	$scope.$on("$stateContentLoaded", function () {
	});
	
	$scope.scroll = {
		top: 0,
		bottom: 0
	};
	
	$scope.slides = {};
	
	$scope.$on("$viewContentLoaded", function (event) {
		updateHeaderPolarization();
		
		var slides = d3.selectAll(".slide")[0];
		
		var view = d3.select("div.view");
		
		function refreshSlides(apply) {
			var scroll = view.node().scrollTop;
			var scrollBottom = scroll + $(window).height();
			
			$scope.scroll.top = scroll;
			$scope.scroll.bottom = scrollBottom;
			
			for (var i = 0; i < slides.length; i++) {
				var y = slides[i].offsetTop;
				var height = slides[i].offsetHeight;
				var distance = Math.abs(scroll - y);
				
				d3.select(slides[i]).classed("active", distance < 100);
				d3.select(slides[i]).classed("visible", y < scrollBottom && y + height > scroll);
				
				$scope.slides[slides[i].id] = $scope.slides[slides[i].id] || {};
				
				var slide = $scope.slides[slides[i].id];
				slide.screenY = y - scroll;
			}
			
			if (apply !== false) {
				$scope.$apply();
			}
		}
		
		view.on("scroll", refreshSlides);
		
		refreshSlides(false);
		
		/*var searchIndex = window.location.hash.indexOf("?");
		
		if (searchIndex > 0) {
			var hash = window.location.hash.substring(searchIndex + 1);
			
			var params = hash.split("&").map(function (d) {
				return d.split("=");
			});
			console.log(params)
			if (params.length > 0) {
				var first = params[0];
				
				if (first.length == 1) {
					//$location.hash(first[0])
					console.log(first[0])
					//$anchorScroll();
				}
			}
			console.log(params);
		}*/
	});
	
	$scope.$on('$stateChangeSuccess', function(next, current) {
		if (!$scope.header.updated || typeof $scope.header.elements["_not_loaded"] === 'object') {
			$scope.header.elements = cloneObject($scope.header.defaultElements, true);
		}
		if (!$scope.menu.updated || typeof $scope.menu.elements["_not_loaded"] === 'object') {
			$scope.menu.elements = cloneObject($scope.menu.defaultElements, true);
		}
		
		$scope.menu.visible = true;
	});
	
	$scope.formatDate = function (input, format) {
		return formatDate(input, format);
	};
	
	$scope.max = Math.max;
}]);
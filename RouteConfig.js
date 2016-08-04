app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
	var sitemap = getSitemap();
	
	$urlRouterProvider.otherwise("/Home");
	
	$stateProvider.state("App", {
		}).state("/", {
			redirectTo: "/Home"
		});
	
	function loadChildren(page, path) {
		page.children.forEach(function (child) {
			var views = {};
			
			views[child.pageName] = {
				templateUrl: child.templateLocation + ".html",
				controller: child.controller || child.pageName
			};
			
			$stateProvider.state(path + "." + child.key, {
				views: views
			});
		});
	}
	
	for (var pageID in sitemap.pages) {
		var page = sitemap.pages[pageID];
		
		if (page.child) {
			continue;
		}
		
		page.urlParams = page.params.join("&");
		
		var params = page.urlParams.length > 0 ? "?" + page.urlParams : page.urlParams;
		var views = {};
		
		page.sections.forEach(function (section) {
			views[section.pageName] = {
				templateUrl: section.templateLocation + ".html",
				controller: section.controller || section.pageName
			};
		});
		
		if (page.sections.length == 0) {
			views[''] = {
				templateUrl: page.templateLocation + ".html",
				controller: page.controller || page.pageName
			};
		}
		
		$stateProvider.state(page.key, {
			url: page.url + params,
			views: views
		});
		
		loadChildren(page, page.key);
		
		page.sections.forEach(function (section) {
			loadChildren(section, page.key);
		});
	};
	
	/*if (globalViews.length > 0) {
		var views = {};
		var urlParams = [];
		
		globalViews.forEach(function (page) {
			page.urlParams = page.params.join("&");
			
			page.params.forEach(function (element) {
				if (urlParams.indexOf(element) < 0) {
					urlParams.push(element);
				}
			});
			
			views[page.pageName] = {
				templateUrl: page.templateLocation + ".html",
				controller: page.controller || page.pageName
			};
		});
		
		urlParams = urlParams.join("&");
		
		var params = urlParams.length > 0 ? "?" + urlParams : urlParams;
		
		$stateProvider.state('root', {
			url: '' + params,
			abstract: true,
			views: views
		});
	}*/
}]);
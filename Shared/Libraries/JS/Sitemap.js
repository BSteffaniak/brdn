var getSitemap;

(function () {
	var sitemap;
	
	getSitemap = function () {
		if (typeof sitemap !== 'undefined') {
			return sitemap;
		}
		
		function generateSitemap(xmlData) {
			sitemap = document.createElement("div");
			
			sitemap.innerHTML = xmlData;
			
			sitemap = sitemap.children[0];
			
			var data = {
				element: sitemap,
				pages: {}
			};
			
			function addRoute(pageName, parentPath) {
				return {
					pageName: pageName,
					url: "/" + parentPath + pageName,
					templateLocation: parentPath + pageName + "/" + pageName
				};
			}
			
			function addPage(page, parentPath, parent, addToPages) {
				addToPages = typeof addToPages !== 'undefined' ? addToPages : true;
				
				var name = page.getAttribute("name");
				var pageName = name.replace(/ /g, '');
				
				var params = page.getAttribute("params");
				
				var path = page.hasAttribute("path") ? page.getAttribute("path") : undefined;
				
				var d = addRoute(pageName, typeof path !== 'undefined' ? path : parentPath.replace(/ /g, ''));
				
				d.key = d.url.substring(1);
				d.pageName = pageName;
				d.path = path;
				d.name = name;
				d.controller = page.hasAttribute("controller") ? page.getAttribute("controller") : undefined;
				d.sections = [];
				d.children = [];
				d.parent = parent;
				d.params = params ? params.split(/\s*,\s*/g) : [];
				d.header = page.hasAttribute("header") ? basicInterpolate(page.getAttribute("header"))(d) : name;
				
				if (addToPages) {
					data.pages[d.key] = d;
				}
				
				for (var i = 0; i < page.children.length; i++) {
					var child = page.children[i];
					var childType = child.tagName.toLowerCase();
					
					if (childType == "page") {
						addPage(child, parentPath + name + "/", d);
					} else if (childType == "child") {
						var pageData = addPage(child, parentPath + name + "/", d);
						
						pageData.key = pageData.pageName;
						pageData.child = true;
						
						d.children.push(pageData);
					} else if (childType == "section") {
						var pageData = addPage(child, parentPath + name + "/", d, false);

						if (typeof d.redirectTo === 'undefined' || child.hasAttribute("active")) {
							d.redirectTo = pageData.key;
						}
						
						pageData.isSection = true;
						
						d.sections.push({
							key: pageData.key,
							page: pageData,
							name: pageData.name,
							pageName: pageData.pageName,
							children: pageData.children,
							controller: child.hasAttribute("controller") ? child.getAttribute("controller") : undefined,
							header: child.hasAttribute("header") ? basicInterpolate(child.getAttribute("header"))(pageData) : pageData.name,
							params: pageData.params,
							defaultActive: child.hasAttribute("active"),
							templateLocation: pageData.templateLocation
						});
					}
				}
				
				function isActive(element) {
					return element.defaultActive;
				}
				
				// If no section set as active, set the first one as active by default.
				if (d.sections.length > 0 && !d.sections.find(isActive)) {
					d.sections[0].defaultActive = true;
				}
				
				return d;
			}
			
			for (var i = 0; i < sitemap.children.length; i++) {
				addPage(sitemap.children[i], "");
			}
			
			return data;
		}
		
		//sitemap = generateSitemap('<app><page name="Happenings"><section name="Happenings"></section><section name="Memories"></section></page><page name="New Happening"></page><page name="Sign Up"><page name="Email"></page><page name="Name"></page><page name="Phone Number"></page><page name="Username"></page><page name="Password"></page><page name="Profile Picture"></page></page><page name="View Happening"><section name="Details" params="id"></section><section name="Live" params="id"></section><section name="Friends" params="id"></section><section name="Updates" params="id"></section></page><page name="Splash Screen"></page><page name="Login"></page><page name="View Profile"></page><page name="View Wolfpaq"></page><page name="Chat"></page><page name="View Notifications"></page><page name="Photo Cropper"></page><page name="Error"></page><page name="Invites"></page></app>');
		
		var xmlhttp;

		if (window.XMLHttpRequest) {
		    xmlhttp = new XMLHttpRequest();
		} else {
		    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}

		xmlhttp.onreadystatechange = function () {
		    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				sitemap = generateSitemap(xmlhttp.responseText);
		    }
		};

		xmlhttp.open("GET", "Sitemap.html", false);
		xmlhttp.send();
		
		xmlhttp.onreadystatechange = function () {
		    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				window.eval(xmlhttp.responseText);
		    }
		};
		
		sitemap.loadControllers = function () {
			for (var key in sitemap.pages) {
				var page = sitemap.pages[key];
				
				function loadScript(location) {
					xmlhttp.open("GET", location, false);
					xmlhttp.send();
				}
				
				if (page.sections.length == 0) {
					loadScript(page.templateLocation + ".js");
				} else {
					page.sections.forEach(function (section) {
						loadScript(section.templateLocation + ".js");
					});
				}
			}
			
			sitemap.loadControllers = function () {};
		};
		
		return sitemap;
	};
})();
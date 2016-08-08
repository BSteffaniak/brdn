var app = angular.module("trApp", ['ngAnimate', 'ngStorage', 'ui.mask', 'ui.router', 'angular-bind-html-compile', 'ngFitText']);

app.config(['fitTextConfigProvider', function(fitTextConfigProvider) {
	fitTextConfigProvider.config = {
    	loadDelay: "!isLoading"
	};
}]);

app.directive('lazy', function() {
	return {
	    restrict: 'A',
		scope: false,
		link: function(scope, elem, attr) {
			if (isdef(attr.lazy)) {
				var code = elem.text();
				var f = new Function(code);
				f();
			}
		}
	};
}).directive('focused', function() {
	return {
	    restrict: 'A',
		scope: false,
		link: function(scope, elements, attr) {
			elements[0].focus();
		}
	};
}).directive('shadow', function() {
	return {
	    restrict: 'A',
		scope: false,
		link: function(scope, elements, attr) {
			elements[0].innerHTML += "<span class='shadow-text'>" + elements[0].innerHTML + "</span>";
		}
	};
}).directive('onEnter', function() {
	return {
	    restrict: 'A',
		scope: false,
		link: function(scope, elements, attrs) {
			elements[0].onkeyup = function (e) {
				if (((typeof e.which === "number") ? e.which : e.keyCode) == 13) {
					scope.$apply(function () {
						scope.$eval(attrs.onEnter);
					});
				}
			}
		}
	};
}).directive('wpHoverClass', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {
            element.on('mouseenter', function () {
                element.addClass(attributes.wpHoverClass);
            });
            element.on('mouseleave', function () {
                element.removeClass(attributes.wpHoverClass);
            });
        }
    };
}]).directive('animatedNumber', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
		scope: {
			number: "=",
			when: "=?"
		},
        link: function (scope, elements, attributes) {
            var element = elements[0];
			var current = 0;
			
			if (typeof scope.when === 'undefined') {
				whenOnCurrentSection(element, scope);
			}
			
			function updateNumber(value) {
				var delta = Math.max(1, Math.floor((value - current) / 100));
				
				delta = delta % 10 == 0 ? delta + 1 : delta;
				
				function loop() {
					if (current !== value) {
						current += delta;
						
						if ((delta > 0 && current < value) || (delta < 0 && current > value)) {
							$timeout(loop, 10);
						} else {
							current = value;
						}
					}
					
					element.innerHTML = numberWithCommas(current);
				}
				
				loop();
			}
			
			scope.$watch("when", function (value) {
				if (value) {
					updateNumber(scope.number);
				}
			});
			
			scope.$watch("number", function (value) {
				if (scope.when) {
					updateNumber(value);
				}
			});
			
			element.innerHTML = numberWithCommas(current);
        }
    };
}]).directive('ngDoubleClick', [function () {
    return {
        restrict: 'A',
        link: function (scope, elements, attrs) {
            onDoubleClick(elements[0], function () {
				scope.$eval(attrs.ngDoubleClick);
			});
        }
    };
}]).directive('largeText', [function () {
    return {
        restrict: 'AE',
		scope: {
			largeText: "="
		},
        link: function (scope, elements, attrs) {
            var element = elements[0];
			
			element.style.fontSize = scope.largeText + "px";
			element.style.lineHeight = scope.largeText * 0.9 + "px";
        }
    };
}]).directive('progressBar', ['$interval', function ($interval) {
    return {
        restrict: 'E',
		scope: {
			progress: "=?",
			progressMax: "=?",
			ratio: "@?",
			delay: "=?",
			when: "=?"
		},
        link: function (scope, elements, attrs) {
            var element = elements[0];
			
			scope.delay = isdef(scope.delay) ? scope.delay : 70;
			
			if (typeof scope.when === 'undefined') {
				whenOnCurrentSection(element, scope);
			}
			
			var lastCount = 0;
			
			function updateProgress(progress, max) {
				progress = isdef(progress) ? progress : 0;
				max = isdef(max) ? max : 100;
				
				if (isdef(attrs.ratio) && scope.ratio !== false && typeof attrs.max === 'undefined') {
					max /= 100;
				}
				
				var count = Math.floor(Math.min(10, progress / max * 10));
				
				if (count > lastCount) {
					$interval(function () {
						var progress = document.createElement("div");
						
						progress.addClass("progress");
						
						element.appendChild(progress);
					}, scope.delay, count - lastCount);
				} else if (count < lastCount) {
					$interval(function () {
						element.children[element.children.length - 1].remove();
					}, scope.delay, lastCount - count);
				}
				
				lastCount = count;
			}
			
			function watcher() {
				if (scope.when) {
					updateProgress(scope.progress, scope.progressMax);
				}
			}
			
			scope.$watch('progress', watcher);
			scope.$watch('progressMax', watcher);
			scope.$watch("when", watcher);
        }
    };
}]).directive('trLink', ['$stateParams', function ($stateParams) {
    return {
        restrict: 'EA',
        link: function (scope, elements, attrs) {
			if (d3.select(elements[0].parentNode).parentSelect("body") == null || elements[0].hasFacade) {
				return;
			}
			
        	var performAction;
        	var urlScope = getScopeWhereAttribute(scope, "openUrl", "function");
			
        	var data = {};
        	var url;
			
			var updateHref = function () {};
			
        	function setFacadeURL() {
				if (isdef(url)) {
            		var path = window.location.pathname;
            		var page = path.split("/").pop();
					
            		var node = elements[0];
            		var sel = d3.select(node);
					
            		var newNode = d3.select(document.createElement("a"))
	    				.attr("onclick", "return false")
	    				.style("position", "absolute")
	    				.style("top", "0")
	    				.style("width", "10px")
	    				.style("height", "10px")
	    				.style("z-index", "99")
	    				.style("border-radius", "100%")
	    				.style("outline", "none")
	    				.attr("tabindex", "-1")
						.classed("facade-url", true)
						.style("display", "none")
		    				//.style("background-color", "white");
							
					node.hasFacade = true;
					
		    		function clicked() {
            			if (typeof attrs.trLinkDisabled === 'undefined' || !scope.$eval(attrs.trLinkDisabled)) {
            				performAction();
            			}
            		}
					
		    		updateHref = function () {
		    			var status = page + "#/" + url + generateQueryString(getArgs());
						
	    				newNode.attr("href", status);
		    		};
					
					updateHref();
					
					/*if (isdef(attrs.doubleClick)) {
                		onDoubleClick(newNode.node(), clicked);
                	} else {
                		newNode.node().addEventListener("click", clicked);
                	}*/
					
                	elements[0].addEventListener("keyup", function (event) {
						if (event.which == 13 || event.keyCode == 13) {
							clicked();
							
							return false;
						}
						
						return true;
					});
					
            		newNode.node().addEventListener("click", function () {
            			node.click();
            		});
					
					if (isdef(attrs.doubleClick)) {
						onDoubleClick(node, clicked);
					} else {
	            		node.addEventListener("click", function () {
	            			clicked();
	            		});
					}
					
            		node.addEventListener("mousemove", function (e) {
						if (newNode.style("pointer-events") != "none") {
	            			newNode.style("left", e.clientX - 5 + "px")
	            				.style("top", e.clientY - 5 + "px");
							
							e.stopPropagation();
							
							return false;
						}
            		});
					
					document.body.appendChild(newNode.node());
            	}
        	}
			
        	function watch(name) {
        		var value = scope.$eval(attrs[name]);
				
        		if (value) {
        			data[name] = value;
					
        			setFacadeURL();
        		} else {
	        		scope.$watch(function () {
	        			return scope.$eval(attrs[name]);
	        		}, function (newValue, oldValue) {
	        			data[name] = newValue;
	
	        			if (isdef(newValue)) {
	        				setFacadeURL();
	        			}
	        		});
        		}
        	}
			
        	var args = {};
			
			function updateParams() {
	        	if (typeof attrs.params === 'string') {
					watchParams(scope, $stateParams, attrs.params, args, updateHref);
	        	}
			}
			
			if (typeof attrs.paramsModel === 'undefined') {
				updateParams();
			}
			
        	var getArgs = function () {
        		return args;
        	};
			
			function updateUrl(required) {
				if (isdef(attrs.chat)) {
	        		url = "Chat";
					
	        		getArgs = function () {
	        			if (data.profile) {
	        				args.id = data.profile.id;
	        				args.type = "user";
	        			} else if (data.happening) {
	        				args.id = data.happening.id;
	        				args.type = "happening";
	        			} else if (data.wolfpaq) {
	        				args.id = data.wolfpaq.id;
	        				args.type = "wolfpaq";
	        			} else if (data.howl) {
							args.id = data.howl.id;
							args.type = "howl";
						}
						
	        			return args;
	        		};
					
	        		performAction = function () {
	        			urlScope.openUrl(url, getArgs());
	        		};
					
	        		watch(isdef(attrs.profile) ? "profile" : (isdef(attrs.happening) ? "happening" : (isdef(attrs.wolfpaq) ? "wolfpaq" : "howl")));
	        	} else if (attrs.wolfpaq) {
	        		url = "ViewWolfpaq";
					
	        		getArgs = function () {
	        			args.id = data.wolfpaq.id;
						
	        			return args;
	        		};
					
	        		performAction = function () {
	        			urlScope.openUrl(url, getArgs());
	        		};
					
	        		watch("wolfpaq");
	        	} else if (attrs.happening) {
	        		url = "ViewHappening";
					
	        		getArgs = function () {
	        			args.id = data.happening.id;
						
	        			return args;
	        		};
					
	        		performAction = function () {
	        			urlScope.openUrl(url, getArgs());
	        		};
					
	        		watch("happening");
	        	} else if (attrs.profile) {
	        		url = "ViewProfile";
					
	        		getArgs = function () {
	        			args.id = data.profile.id;
						
	        			return args;
	        		};
					
	        		performAction = function () {
	        			urlScope.openUrl(url, getArgs());
	        		};
					
	        		watch("profile");
	        	} else if (isdef(attrs.notifications)) {
	        		url = "ViewNotifications";
					
	        		performAction = function () {
	        			urlScope.openUrl("ViewNotifications", args);
	        		};
					
	        		setFacadeURL();
	        	} else if (isdef(attrs.trLink)) {
	        		url = attrs.trLink;
					
	        		if (attrs.trLink == "Invites") {
	        			args.type = attrs.type;
	        		}
					
	        		performAction = function () {
	        			urlScope.openUrl(attrs.trLink, args);
	        		};
					
	        		setFacadeURL();
	        	} else if (required) {
	        		console.log("No action to perform for ", elements[0].outerHTML);
					
	        		return;
	        	}
			}
			
			if (typeof attrs.linkModel === 'undefined') {
				updateUrl(true);
			}
			
			if (isdef(attrs.linkModel)) {
				scope.$watch(function () {
					return scope.$eval(attrs.linkModel);
				}, function (value) {
					attrs.trLink = value;
					
					updateUrl();
					updateHref();
				});
			}
			
			if (isdef(attrs.paramsModel)) {
				scope.$watch(function () {
					return scope.$eval(attrs.paramsModel);
				}, function (value) {
					attrs.params = value;
					
					updateParams();
				});
			}
        }
    };
}]).directive('wpBlurClass', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {
            element.on('mouseleave', function () {
                element.addClass(attributes.wpBlurClass);
            });
            element.on('mouseenter', function () {
                element.removeClass(attributes.wpBlurClass);
            });
        }
    };
}]).directive('loading', ['$compile', '$templateCache', function ($compile, $templateCache) {
    return {
        restrict: 'A',
        link: function (scope, elements, attributes) {
        	scope.loaded = false;
			
    		/*var currentElements = $compile("<img ng-if='!loaded' class='loading-image' src='Shared/Images/loading.gif'></img>")(scope);
			
    		for (var i = 0; i < currentElements.length; i++) {
    			d3.select("#page-container").node().appendChild(currentElements[i]);
    		}*/
			
			scope.$watch(function () {
            	return scope.$eval(attributes.loading);
            }, function (newValue, oldValue) {
            	scope.loaded = isdef(newValue) && newValue !== false;
            });
        }
    };
}]).directive('wpPulse', ['$interval', function ($interval) {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {
        	var classes = attributes.wpPulse.split(" ");
        	var index = classes.length - 1;
        	var time = parseInt(classes[0]);
			
        	$interval(function () {
            	element.removeClass(classes[index++])
				
            	if (index >= classes.length) index = 1;
				
            	element.addClass(classes[index])
            }, time);
        }
    };
}]).directive('wolfpaqHeader', [function () {
    return {
        restrict: 'E',
        scope: {
        	headerElements: "=elements"
        },
        link: function (scope, elements, attrs) {
        	var element = elements[0];
			
        	for (var key in scope.headerElements) {
        		delete scope.headerElements[key];
        	}
			
        	for (var i = 0; i < element.children.length; i++) {
        		var child = element.children[i];
        		var type = child.tagName.toLowerCase();
        		var data = {};
				
        		scope.headerElements[type] = data;
				
        		if (type == "back-button") {
					
        		} else if (type == "header-text") {
        			data.text = child.innerHTML;
        		} else if (type == "next-button") {
					data.link = child.getAttribute("tr-link");
					data.params = child.getAttribute("params");
        		} else if (type == "input") {
        			data.type = child.getAttribute("type").toLowerCase();
					
        			if (child.hasAttribute("icon")) {
        				data.iconSrc = child.getAttribute("icon");
        			}
					
        			if (data.type == "text") {
	        			if (child.hasAttribute("placeholder")) {
	        				data.placeholder = child.getAttribute("placeholder");
	        			}
        			}
        		}
        	}
			
        	element.remove();
        }
    };
}]).directive('wolfpaqMenu', [function () {
    return {
        restrict: 'E',
        scope: {
        	ngModel: "="
        },
        link: function (scope, elements, attrs) {
        	var element = elements[0];
			
        	for (var key in scope.ngModel) {
        		delete scope.ngModel[key];
        	}
			
        	for (var i = 0; i < element.children.length; i++) {
        		var child = element.children[i];
        		var type = child.tagName.toLowerCase();
        		var data = {};
				
        		scope.ngModel[type] = data;
				
        		if (type == "search") {
					
        		} else if (type == "social") {
					
        		} else if (type == "profile") {
					
        		} else if (type == "home") {
					
        		} else if (type == "double-tap-text") {
        			data.text = child.innerHTML;
        		} else if (type == "hold-text") {
        			data.text = child.innerHTML;
        		}
        	}
			
        	element.remove();
        }
    };
}]).directive('listenDelay', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        scope: {
        	listenDelay: "=",
			listener: "&"
        },
        link: function (scope, elements, attrs) {
        	var element = elements[0];
			
			var current = Date.now();
			var last = current;
			var lastText = element.value;
			
			function update(text) {
				current = Date.now();
				
				if (current >= last + scope.listenDelay && lastText != text) {
					scope.listener();
					
					last = current;
					lastText = text;
					
					return true;
				}
				
				return false;
			}
			
        	element.addEventListener("keyup", function (event) {
				if (!update(event.target.value)) {
					$timeout(function () {
						update(event.target.value);
					}, scope.listenDelay - (current - last) + 5);
				}
			});
        }
    };
}]).directive('wolfpaqMenuButtonMessage', [function () {
    return {
        restrict: 'E',
        scope: {
        	ngModel: "="
        },
        link: function (scope, elements, attrs) {
        	var element = elements[0];
			
        	for (var key in scope.ngModel) {
        		delete scope.ngModel[key];
        	}
			
        	for (var i = 0; i < element.children.length; i++) {
        		var child = element.children[i];
        		var type = child.tagName.toLowerCase();
        		var data = {};
				
        		scope.ngModel[type] = data;
				
        		if (type == "double-tap-text") {
        			data.text = child.innerHTML;
        		} else if (type == "hold-text") {
        			data.text = child.innerHTML;
        		}
        	}
	
        	element.remove();
        }
    };
}]).directive('wolfpaqMenuButtonMessageContent', [function () {
    return {
        restrict: 'E',
        scope: {
        	ngModel: "="
        },
        link: function (scope, elements, attrs) {
        	var element = elements[0];
			
        	scope.ngModel = element.innerHTML;
			
        	element.remove();
        }
    };
}]).directive('menuButton', ['$utils', function ($utils) {
    return {
        restrict: 'E',
		scope: {
			onLeft: "&",
			onMiddle: "&",
			onTop: "&",
			dragModel: "="
		},
        link: function (scope, elements, attrs) {
        	var element = elements[0];
			
			var offset = { dx: 0, dy: 0 };
			var lastPos = { x: 0, y: 0 };
			
			scope.dragModel = false;
			
			var mouseDown = false;
			
			var timeoutId;
			
			var downEvent = "onmousedown";
			var upEvent = "onmouseup";
			var moveEvent = "onmousemove";
			
			var xProp = "clientX";
			var yProp = "clientY";
			
			if ($utils.isAndroid) {
				downEvent = "ontouchstart";
				upEvent = "ontouchend";
				moveEvent = "ontouchmove";
				
				xProp = "pageX";
				yProp = "pageY";
			}
			
			element[downEvent] = function (e) {
				if ($utils.isAndroid) {
					e = e.touches[0];
				}
				
				lastPos.x = e[xProp];
				lastPos.y = e[yProp];
				
				mouseDown = true;
				
				timeoutId = setTimeout(function () {
					if (!scope.dragModel) {
						scope.dragModel = true;
						
						scope.$apply();
					}
				}, 150);
			};
			
			document[upEvent] = function () {
				if (mouseDown) {
					var magnitude = Math.sqrt(offset.dx * offset.dx + offset.dy * offset.dy);
					
					if (magnitude > 80) {
						var xRatio = offset.dx / magnitude;
						var yRatio = offset.dy / magnitude;
						
						if (xRatio < -0.9) {
							scope.onLeft();
						} else if (yRatio < -0.9) {
							scope.onTop();
						} else if (xRatio < 0 && yRatio < 0) {
							scope.onMiddle();
						}
					}
					
					scope.dragModel = false;
					mouseDown = false;
					
					if (isdef(timeoutId)) {
						clearTimeout(timeoutId);
					}
					
					scope.$apply();
				}
				
				offset.dx = 0;
				offset.dy = 0;
			};
			
			document[moveEvent] = function (e) {
				if ($utils.isAndroid) {
					e = e.touches[0];
				}
				
				offset.dx = e[xProp] - lastPos.x;
				offset.dy = e[yProp] - lastPos.y;
				
				if (mouseDown) {
					if (!scope.dragModel) {
						scope.dragModel = true;
						
						scope.$apply();
					}
				} else {
					lastPos.x = e[xProp];
					lastPos.y = e[yProp];
				}
			};
        }
    };
}]).directive('wpScale', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {
        	var scale = scope.$eval(attributes.wpScale);
        	var included = isdef(attributes.wpScaleIncluded) ? scope.$eval(attributes.wpScaleIncluded) : true;
        	var transform = isdef(attributes.wpTransform) ? scope.$eval(attributes.wpTransform) : false;
			
        	scaleElement(element[0], scale, { included: included, transform: transform });
        }
    };
}])
/*
 * The whenReady directive allows you to execute the content of a when-ready
 * attribute after the element is ready (i.e. when it's done loading all sub directives and DOM
 * content). See: http://stackoverflow.com/questions/14968690/sending-event-when-angular-js-finished-loading
 *
 * Execute multiple expressions in the when-ready attribute by delimiting them
 * with a semi-colon. when-ready="doThis(); doThat()"
 *
 * Optional: If the value of a wait-for-interpolation attribute on the
 * element evaluates to true, then the expressions in when-ready will be
 * evaluated after all text nodes in the element have been interpolated (i.e.
 * {{placeholders}} have been replaced with actual values).
 *
 * Optional: Use a ready-check attribute to write an expression that
 * specifies what condition is true at any given moment in time when the
 * element is ready. The expression will be evaluated repeatedly until the
 * condition is finally true. The expression is executed with
 * requestAnimationFrame so that it fires at a moment when it is least likely
 * to block rendering of the page.
 *
 * If wait-for-interpolation and ready-check are both supplied, then the
 * when-ready expressions will fire after interpolation is done *and* after
 * the ready-check condition evaluates to true.
 *
 * Caveats: if other directives exists on the same element as this directive
 * and destroy the element thus preventing other directives from loading, using
 * this directive won't work. The optimal way to use this is to put this
 * directive on an outer element.
 */
.directive('whenReady', ['$interpolate', function($interpolate) {
  return {
    restrict: 'A',
    priority: Number.MIN_SAFE_INTEGER, // execute last, after all other directives if any.
    link: function($scope, $element, $attributes) {
      var expressions = $attributes.whenReady.split(';');
      var waitForInterpolation = false;
      var hasReadyCheckExpression = false;
	  
      function evalExpressions(expressions) {
        expressions.forEach(function(expression) {
          $scope.$eval(expression);
        });
      }
	  
      if ($attributes.whenReady.trim().length === 0) {
    	  return;
      }
	  
    if ($attributes.waitForInterpolation && $scope.$eval($attributes.waitForInterpolation)) {
        waitForInterpolation = true;
    }
	
      if ($attributes.readyCheck) {
        hasReadyCheckExpression = true;
      }
	  
      if (waitForInterpolation || hasReadyCheckExpression) {
        requestAnimationFrame(function checkIfReady() {
          var isInterpolated = false;
          var isReadyCheckTrue = false;
		  
          isInterpolated = !waitForInterpolation || $element.text().indexOf($interpolate.startSymbol()) < 0; // if the text still has {{placeholders}}
		  
          isReadyCheckTrue = !hasReadyCheckExpression || $scope.$eval($attributes.readyCheck); // if the ready check expression returns false
		  
          if (isInterpolated && isReadyCheckTrue) {
        	  evalExpressions(expressions);
          }
          else {
        	  requestAnimationFrame(checkIfReady);
          }
        });
      }
      else {
        evalExpressions(expressions);
      }
    }
  };
}]).directive("editInline", function($window) {
    return {
        scope: {
            initialWidth: '@initialWidth'
        },
        link: function(scope, element, attr) {
            // a method to update the width of an input
            // based on it's value.
            var updateWidth = function () {
                // create a dummy span, we'll use this to measure text.
                var tester = angular.element('<span>');
				
				// get the computed style of the input
                var elemStyle = $window.document.defaultView.getComputedStyle(element[0], '');
				
				// apply any styling that affects the font to the tester span.
                tester.css({
                    'font-family': elemStyle.fontFamily,
                    'line-height': elemStyle.lineHeight,
                    'font-size': elemStyle.fontSize,
                    'font-weight': elemStyle.fontWeight,
                    'white-space': 'pre'
                });
				
				var text = element.val();
				
				if (text.length == 0) {
                    text = element.attr("placeholder");
                    text = isdef(text) ? text : "";
                }
				
				// update the text of the tester span
                tester.text(text);
				
				// put the tester next to the input temporarily.
                element.parent().append(tester);
				
				// measure!
                var r = tester[0].getBoundingClientRect();
                var w = r.width;
				
				// apply the new width!
                element.css('width', w + 'px');
				
				// remove the tester.
                tester.remove();
            };
			
			if (typeof scope.initialWidth === 'string') {
                element.css("width", scope.initialWidth);
            } else {
                updateWidth();
            }
			
			// do it on keydown so it updates "real time"
            element.bind("keydown", function() {
                // set an immediate timeout, so the value in
                // the input has updated by the time this executes.
                $window.setTimeout(updateWidth, 0);
            });
        }
    };
}).directive("wpCharacterCounter", function($window) {
	return {
		scope: {
			wpCharacterCounter: '=',
			wpCharacterCounterMax: '=',
			wpCharacterCounterWarning: '='
		},
		link: function(scope, element, attr) {
			scope.$watch('wpCharacterCounter', function (newValue, oldValue) {
				var charactersLeft = scope.wpCharacterCounterMax;
				
				if (isdef(newValue)) {
					charactersLeft = scope.wpCharacterCounterMax - newValue.length
				}
				
				element.toggleClass("character-counter-full", charactersLeft <= 0);
				
				if (charactersLeft > 0 && typeof scope.wpCharacterCounterWarning === 'number') {
					element.toggleClass("character-counter-warning", charactersLeft <= scope.wpCharacterCounterWarning);
				} else {
					element.toggleClass("character-counter-warning", false);
				}
				
				element.text(charactersLeft);
			});
		}
	};
}).directive("wpBracketContainer", function($window) {
	return {
		restrict: 'E',
		transclude: true,
		scope: true,
		templateUrl: 'Shared/Templates/BracketContainer.html',
		link: function (scope, element, attr, c, transclooge) {
			transclooge(scope.$parent, function (nodes) {
				angular.element(element[0].querySelector(".bracket-container-content")).append(nodes);
			});
		}
	};
}).animation('.reveal-animation', function() {
	return {
		addClass : function(element, className, done) {
			if (className == "transition") {
				element = $(element);
				
				var time = parseFloat(element.attr("transition-time"));
				
				element.fadeOut(time, done);
				
				return function() {
					element.stop();
				}
			}
		},
		removeClass : function(element, className, done) {
			if (className == "transition") {
				element = $(element);
				
				var time = parseFloat(element.attr("transition-time"));
				
				element.fadeIn(time, done);
				
				return function() {
					element.stop();
				}
			}
		}
	}
}).directive('postRepeat', function($timeout) {
	return function(scope, element, attrs) {
		if (scope.$last) {
			$timeout(function () { scope.$eval(attrs.postRepeat) }, 0);
		}
	};
}).directive('preRepeat', function($timeout) {
	return function(scope, element, attrs) {
		if (scope.$first) {
			$timeout(function () { scope.$eval(attrs.preRepeat) }, 0);
		}
	};
}).directive('ngScroll', function($timeout) {
	return {
		restrict: 'EA',
		scope: {
			ngScroll: '&?',
			container: "@?",
			ngScrollDown: "&?",
			ngScrollUp: "&?",
			ngModel: "="
		},
		link: function($scope, $element, attrs) {
			var scroller = $element[0];
			var loading = false;
			var content = d3.select($scope.container || scroller).node();
			
			var lastPos = content.scrollTop;
			
			d3.select(content).on("scroll", function () {
				$scope.$apply(function () {
					$scope.ngModel = { y: content.scrollTop, dy: content.scrollTop - lastPos };
					
					lastPos = content.scrollTop;
					
					if (attrs.ngScroll) {
						$scope.ngScroll();
					}
					
					if (attrs.ngScrollDown && $scope.ngModel.dy > 0) {
						$scope.ngScrollDown();
					}
					
					if (attrs.ngScrollUp && $scope.ngModel.dy < 0) {
						$scope.ngScrollUp();
					}
				});
			});
		}
	};
}).directive('loadMoreAtTop', function($timeout) {
	return {
		restrict: 'EA',
		scope: {
			onScroll: '=',
			container: "@"
		},
		link: function($scope, $element, attrs) {
			var scroller = $element[0];
			var lastHeight, loading = false;
			var content = d3.select($scope.container).node();
			
			d3.select(content).on("scroll", function () {
				var top = content.scrollTop;
				
				if (top == 0) {
					$scope.growBounds();
				}
			});
			
			$scope.growBounds = function growBounds() {
				loading = true;
				lastHeight = content.scrollHeight;
				
				$scope.onScroll(resetScrollPosition);
			}
			
			function resetScrollPosition() {
				var height = content.scrollHeight;
				var difference = height - lastHeight;
				
				// reset the scroll based on previous height
				content.scrollTop = difference;
			}
		}
	};
});
app.run(function($rootScope) {
  $rootScope.$on("$stateChangeError", console.log.bind(console));
});
var wolfpaqGreen = "#79c843";

var getHash;
var submitFunction;

function isdef(obj) {
	return typeof obj !== 'undefined';
}

function classify(input) {
	if (typeof input === 'undefined') {
		return "";
	}
	
	return input.toLowerCase().replace(' ', '-').replace(/[^a-z0-9_\-]/g, '');
}

function getMoment(time) {
	var startOfToday = new Date();
	
	startOfToday = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), startOfToday.getDate());
	
	// tomorrow at 2 am
	var tomorrow = moment(startOfToday).add(1, "day").add(2, "hour");
	
	if (time == "today") {
		return tomorrow;
	} else if (time == "tonight") {
		return tomorrow;
	} else if (time == "tomorrow") {
		return tomorrow.add(1, "day");
	} else if (time == "this week" || time == "this weekend") {
		return tomorrow.add(1, "week");
	} else if (time == "this month") {
		return tomorrow.add(1, "month");
	} else if (time == "next week" || time == "next weekend") {
		return tomorrow.add(2, "week");
	} else if (time == "next month") {
		return tomorrow.add(2, "month");
	}
}

function whenOnCurrentSection(element, scope) {
	var parentView = d3.select(element).parentSelect("div.view");
	var parentSection = parentView.attr("id");
	
	var masterScope = getScopeWhereAttribute(scope, "currentSection", "object");
	
	if (masterScope == null) {
		scope.when = true;
	} else {
		var currentSection = masterScope.currentSection;
		
		if (parentSection === null) {
			parentSection = classify(currentSection.name);
		}
		
		function updateWhen(section) {
			scope.when = classify(section.name) == parentSection;
		};
		
		scope.$on("section-change", function (event, section) {
			updateWhen(section);
		});
		
		updateWhen(currentSection);
	}
}

HTMLElement.prototype.isChildOf = function (parent, inclusive) {
	var current = inclusive ? this : this.parentNode;
	
	while (current !== document && current !== null) {
		if (current === parent) {
			return true;
		}
		
		current = current.parentNode;
	}
	
	return false;
};

d3.selection.prototype.parentSelect = function (selector) {
	var current = this.node().parentNode;
	var previous = this.node();
	
	while (current !== document) {
		if (current === null) {
			return null;
		}
		
		var nodes = d3.select(current).selectAll(selector);
		
		var found = false;
		
		nodes.each(function (d, i) {
			if (this === previous) {
				found = true;
			}
		});
		
		if (found) {
			return d3.select(previous);
		}
		
		previous = current;
		current = current.parentNode;
	}
	
	if (current !== document) {
		return d3.select(current);
	}
};

function watchParams(scope, $stateParams, params, model, onUpdate) {
	params = params.substring(1, params.length - 1).split(/\s*,\s*/g);
	onUpdate = typeof onUpdate === 'function' ? onUpdate : function () {};
	
	var paramValues = params.map(function (param, i) {
		var index = param.indexOf("->");
		
		if (index > 0) {
			params[i] = param.substring(index + 2).trim();
			
			param = param.substring(0, index).trim();
		}
		
		index = param.indexOf("=");
		
		if (index > 0) {
			params[i] = param.substring(0, index).trim();
			
			param = param.substring(index + 1).trim();
			
			return function () {
				return scope.$eval(param);
			};
		}
		
		return function () {
			return $stateParams[param];
		};
	});
	
	scope.stateParams = $stateParams;
	
	scope.$watch("stateParams", function (stateParams) {
		params.forEach(function (param, i) {
			model[param] = paramValues[i]();
		});
		
		onUpdate();
	}, true);
}

Array.prototype.equals = function(array) {
	return this.length == array.length && this.every(function(this_i, i) {
		return this_i == array[i]
	});  
};

(function () {
	var nextID = 0;
	
	getHash = function (element) {
		element.hashID = element.hashID || ('hashID_' + (nextID++));
		
		return element.hashID;
	};
})();

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function wolfpaqInertia(element) {
	var callbacks = {};
	// dragstart, dragend, drag, mouseup
	
	var downEvent = "mousedown";
	var upEvent = "mouseup";
	var moveEvent = "mousemove";
	
	var xProp = "clientX";
	var yProp = "clientY";
	
	if (isMobile) {
		downEvent = "touchstart";
		upEvent = "touchend";
		moveEvent = "touchmove";
		
		xProp = "pageX";
		yProp = "pageY";
	}
	
	var data = d3.select(element).datum();
	var lastPos = {};
	var offset = {};
	var momentum = {};
	var momentumCount = 0;
	var mouseDown = false;
	var tolerance = 0.01;
	
	var downEventListener = function (e) {
		if (isMobile) {
			e = e.touches[0];
		}
		
		mouseDown = true;
		
		document.body.addClass("no-select");
		
		callbacks.dragstart.forEach(function (callback, i) {
			callback.call(element, data, i);
		});
		
		lastPos.x = e[xProp];
		lastPos.y = e[yProp];
		
		offset.dx = 0;
		offset.dy = 0;
		
		momentum.dx = 0;
		momentum.dy = 0;
		
		momentumCount = 0;
	};
	
	var moveEventListener = function (e) {
		if (mouseDown) {
			if (isMobile) {
				e = e.touches[0];
			}
			
			var dx = e[xProp] - lastPos.x;
			var dy = e[yProp] - lastPos.y;
			
			lastPos.x = e[xProp];
			lastPos.y = e[yProp];
			
			offset.dx = dx;
			offset.dy = dy;
			
			momentum.dx += dx;
			momentum.dy += dy;
			
			momentumCount++;
			
			callbacks.drag.forEach(function (callback, i) {
				callback.call(element, data, i, offset);
			});
		}
	};
	
	var upEventListener = function (e) {
		if (mouseDown) {
			mouseDown = false;
			
			document.body.removeClass("no-select");
			
			callbacks.mouseup.forEach(function (callback, i) {
				callback.call(element, data, i);
			});
			
			offset.dx *= 5;
			offset.dy *= 5;
			
			function loseMomentum() {
				if (mouseDown) {
					return;
				}
				
				if (Math.abs(offset.dx) < tolerance && Math.abs(offset.dy) < tolerance) {
					callbacks.dragend.forEach(function (callback, i) {
						callback.call(element, data, i);
					});
				} else {
					offset.dx *= 0.93;
					offset.dy *= 0.93;
					
					callbacks.drag.forEach(function (callback, i) {
						callback.call(element, data, i, offset);
					});
					
					setTimeout(loseMomentum, 16);
				}
			}
			
			loseMomentum();
		}
	};
	
	var noScrollListener = function (e) {
		if (mouseDown) {
			e.preventDefault();
		}
	};
	
	element.addEventListener(downEvent, downEventListener);
	document.addEventListener(moveEvent, moveEventListener);
	document.addEventListener(upEvent, upEventListener);
	
	if (isMobile) {
		window.addEventListener(moveEvent, noScrollListener);
	}
	
	var returnData = {
		on: function (type, callback) {
			callbacks[type] = callbacks[type] || [];
			
			callbacks[type].push(callback);
			
			return returnData;
		}
	}
	
	return returnData;
}

function draggable(elements, args) {
	args = typeof args !== 'undefined' ? args : {};
	args.gravityPull = typeof args.gravityPull !== 'undefined' ? args.gravityPull : 0.5;
	
	if (typeof args.tickSize === 'undefined') {
		console.error("Missing required 'tickSize' argument");
	}
	
	elements = isArray(elements[0][0]) ? elements : [elements];
	
	var dragElements = {};
	
	if (typeof args.dragElements === 'undefined') {
		args.dragElements = typeof args.dragElement !== 'undefined' ? [args.dragElement] : elements;
	}
	if (typeof args.minValue === 'undefined') {
		args.minValue = typeof args.minIndex !== 'undefined' ? -args.minIndex * args.tickSize : args.minValue;
	}
	
	for (var i = 0; i < elements.length; i++) {
		dragElements[getHash(args.dragElements[i].node())] = elements[i];
	}
	
	var tickSize = args.tickSize;
	
	var positionVariable = args.direction == 'vertical' ? 'y' : 'x';
	var styleVariable = args.direction == 'vertical' ? 'top' : 'left';
	
	args.dragElements.forEach(function (element) {
		var stagnant = false;
		var allowGravity = false;
		var gravityPull = args.gravityPull;
		
		function pullGravity(d) {
			var offset = d[positionVariable] % tickSize;
			
			if (offset < 0) {
				if (offset < -tickSize / 2) {
					d[positionVariable] -= gravityPull;
				} else {
					d[positionVariable] += gravityPull;
				}
			} else {
				if (offset > tickSize / 2) {
					d[positionVariable] += gravityPull;
				} else {
					d[positionVariable] -= gravityPull;
				}
			}
			
			gravityPull = Math.min(gravityPull * 1.1, 3);
			
			var absOffset = Math.abs(offset);
			
			if (absOffset < 1 || absOffset > args.tickSize - 2) {
				var base = Math.floor(d[positionVariable] / tickSize);
				
				if (Math.abs(d[positionVariable] - base * tickSize) < 4) {
					d[positionVariable] = base * tickSize;
				} else {
					d[positionVariable] = base * tickSize + tickSize;
				}
				
				if (typeof args.onFinished === 'function') {
					args.onFinished();
				}
				
				allowGravity = false;
				gravityPull = args.gravityPull;
				stagnant = true;
			}
		}
		
		function scroll(element, delta, d) {
			if (allowGravity && Math.abs(delta) < 1.5) {
				pullGravity(d);
			} else if (!stagnant) {
				d[positionVariable] += delta;
			}
			
			if (args.wrap) {
				var max = element.node().children.length * tickSize - tickSize;
				
				d[positionVariable] = d[positionVariable] < -max ? 0 : d[positionVariable];
				d[positionVariable] = d[positionVariable] > 0 ? -max : d[positionVariable];
			}
			
			if (typeof args.minValue !== 'undefined' && -d[positionVariable] < args.minValue) {
				d[positionVariable] = args.minValue;
			}
			
			element.style(styleVariable, d[positionVariable] + "px");
			
			if (typeof args.onMove === 'function') {
				args.onMove(-d[positionVariable], -Math.floor(d[positionVariable] / args.tickSize));
			}
		}
		
		if (args.wrap) {
			// Add first one to the bottom so it gives the illusion of wrapping.
			element.append("div").text(element.node().children[0].innerHTML);
		}
    	
    	var mouseScroll = function (e) {
    		var e = window.event || e; // old IE support
    		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    		
    		stagnant = false;
    		scroll(dragElements[element.node().hashID], delta * 4, element.data());
    	};
    	
    	if (element.node().addEventListener) {
    		element.node().addEventListener("mousewheel", mouseScroll, false);
    		element.node().addEventListener("DOMMouseScroll", mouseScroll, false);
    	} else {
    		element.node().attachEvent("onmousewheel", mouseScroll);
    	}
    	
    	var movingElement = dragElements[element.node().hashID];
    	
    	var position = element.style(styleVariable);
    	
    	var data = {};
    	
    	data[positionVariable] = parseFloat(position) || 0;
    	
    	element.data([data]);
    	
		wolfpaqInertia(element.node())
			.on("dragstart", function (d, i) {
				allowGravity = false;
				stagnant = false;
				
	    		dragElements[d3.select(this).node().hashID].classed("active", true);
	    		
	    		if (typeof args.onDragStart === 'function') {
	    			args.onDragStart();
	    		}
			})
			.on("dragend", function (d, i) {
				stagnant = false;
				
	    		var offset = Math.abs(d[positionVariable] % tickSize);
				
	    		if (offset >= 1 && offset <= args.tickSize - 2) {
	    			var element = dragElements[d3.select(this).node().hashID];
	    			
	    			function loop() {
	    				pullGravity(d);
	    				
	    				element.style(styleVariable, d[positionVariable] + "px");
	    				
	    				if (allowGravity) {
	    					setTimeout(loop, 13);
	    				}
	    			}
	    			
	    			loop();
				}
			})
			.on("mouseup", function (d, i) {
				allowGravity = true;
	
				dragElements[d3.select(this).node().hashID].classed("active", false);
			})
			.on("drag", function(d, i, offset) {
				scroll(dragElements[d3.select(this).node().hashID], offset['d' + positionVariable], d);
			});
	});
}

String.prototype.format = function() {
	var args = arguments;
	
	return this.replace(/{(\d+(\?)?)}/g, function(match, number) { 
		if (number.indexOf("?") > 0) {
			number = parseFloat(number.substring(0, number.length - 1));
			
			if (args[number]) {
				return args[number];
			}
			
			return "";
		}
		
		return typeof args[number] !== 'undefined' ? args[number] : match;
	});
};

function camelCase(input) {
	return input[0].toLowerCase() +
		input.substring(1).replace(/\s\w/g, function (match) {
			return match.toUpperCase();
		}).replace(/[^a-zA-Z0-9_]/g, '');
}

function formatDate(input, format) {
	format = format.replace(/<([^>]+)>/g, function(match) { 
		var f = match.substring(1, match.length - 1);
		var query = f;
		
		f = f.replace(/\[([^\]]+)\]/g, function (q) {
			query = q.substring(1, q.length - 1);
			
			return "";
		});
		
		if (moment().format(query) != moment(input, "x").format(query)) {
			return f;
		}
		
		return "";
	});
	
	return moment(input, /*"M/DD/YYYY h:mm:ss A"*/"x", "en").format(format);
}

function filterKeys(obj, keys) {
	var newObj = {};
	
	for (var i = 0; i < keys.length; i++) {
		newObj[keys[i]] = obj[keys[i]];
	}
	
	return newObj;
}

function basicInterpolate(str) {
	return function (scope) {
		return str.replace(/{{\s*(\S+)\s*}}/g, function(match, value) {
			var values = value.split(/\./g);
			
			var current = scope;
			
			for (var i = 0; i < values.length; i++) {
				current = current[values[i]];
			}
			
			return current;
		});
	}
}

function cloneObject(obj, deep) {
	return deep ? jQuery.extend(true, {}, obj) : jQuery.extend({}, obj);
}

function getQueryVariables(queryString) {
	if (typeof queryString === 'undefined' && window.location.search.length > 0) {
		queryString = window.location.search.substr(1);
	}
	
	if (typeof queryString !== 'string' || queryString.length == 0) {
		return {};
	}
	
	var variables = queryString.split("&");
	var data = {};
	
	for (var i = 0; i < variables.length; i++) {
		var pair = variables[i].split("=");
		
		data[pair[0]] = pair[1].length == 0 ? undefined : decodeURIComponent(pair[1]); //.replace(/\+/g, " ")???
	}
	
	return data;
}

function arrayContains(array, value) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] == value) {
			return true;
		}
	}
	
	return false;
}

var onPageLoaded;
var launchPageLoadedEvents;

(function () {
	var functions = [];
	
	onPageLoaded = function (func) {
		functions.push(func);
	};
	
	launchPageLoadedEvents = function () {
		for (var i = 0; i < functions.length; i++) {
			functions[i]();
		}
	};
})();

function generateQueryString(args, prefix, objPrefix) {
	prefix = typeof prefix !== 'undefined' ? prefix : "?";
	objPrefix = typeof objPrefix !== 'undefined' ? objPrefix : "";
	
	var queryString = "";
	
	if (typeof args !== 'undefined') {
		for (var key in args) {
			if (typeof args[key] !== 'undefined') {
				if (typeof args[key] === 'object') {
					queryString += generateQueryString(args[key], "&", objPrefix + key + ".");
				} else {
					queryString += queryString.length > 0 ? "&" : "";
					queryString += encodeURIComponent(objPrefix + key) + "=" + encodeURIComponent(args[key]);
				}
			}
		}
		
		queryString = queryString.length > 0 ? prefix + queryString : queryString;
	}
	
	return queryString;
}

function previousElement(node) {
	var elements = node.parentNode.children;
	
	for (var i = 0; i < elements.length; i++) {
		if (elements[i] == node && i > 0) {
			return elements[i - 1];
		}
	}
}

function getScopeWhereAttribute(scope, attribute, type) {
	type = typeof type !== 'undefined' ? type : 'undefined'
	
	var s = scope;
	
	while (s && typeof s[attribute] !== type) {
		s = s.$parent;
	}
	
	return s;
}

function onDoubleClick(element, func, doubleClickInterval) {
	var time = Date.now();
	doubleClickInterval = typeof doubleClickInterval !== 'undefined' ? doubleClickInterval : 300;
	
	var listener = function (e) {
		var cur = Date.now();
		
		if (cur - time < doubleClickInterval) {
			func(cur - time);

			e.stopPropagation();
			return false;
		}
		
		time = cur;
	};
	
	element.addEventListener("click", listener);
}

function isElementInViewport (el) {
    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

var urlParameters = getQueryVariables();

var abbreviateDay;
var abbreviateMonth;
var abbreviateDate;
var daysArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

(function () {
	abbreviateDay = function (dayName) {
		if (typeof dayName !== 'string') {
			dayName = daysArray[dayName];
		}
		
		var lower = dayName.toLowerCase();
		
		if (lower == "monday") {
			return dayName.substring(0, 3);
		} else if (lower == "tuesday") {
			return dayName.substring(0, 4);
		} else if (lower == "wednesday") {
			return dayName.substring(0, 3);
		} else if (lower == "thursday") {
			return dayName.substring(0, 4);
		} else if (lower == "friday") {
			return dayName.substring(0, 3);
		} else if (lower == "saturday") {
			return dayName.substring(0, 3);
		} else if (lower == "sunday") {
			return dayName.substring(0, 3);
		}
	}
	
	abbreviateMonth = function (monthName) {
		if (typeof monthName !== 'string') {
			monthName = monthsArray[monthName];
		}
		
		var lower = monthName.toLowerCase();
		
		if (lower == "january") {
			return monthName.substring(0, 3);
		} else if (lower == "february") {
			return monthName.substring(0, 3);
		} else if (lower == "march") {
			return monthName.substring(0, 3);
		} else if (lower == "april") {
			return monthName.substring(0, 3);
		} else if (lower == "may") {
			return monthName.substring(0, 3);
		} else if (lower == "june") {
			return monthName.substring(0, 3);
		} else if (lower == "july") {
			return monthName.substring(0, 3);
		} else if (lower == "august") {
			return monthName.substring(0, 3);
		} else if (lower == "september") {
			return monthName.substring(0, 4);
		} else if (lower == "october") {
			return monthName.substring(0, 3);
		} else if (lower == "november") {
			return monthName.substring(0, 3);
		} else if (lower == "december") {
			return monthName.substring(0, 3);
		}
	}
	
	abbreviateDate = function (monthName, date, checkToday) {
		if (typeof monthName !== 'string') {
			monthName = monthsArray[monthName];
		}
		
		var d = new Date();
		
		if (checkToday === true && d.getDate() == date && monthName.toLowerCase() == monthsArray[d.getMonth()].toLowerCase()) {
			return "Today";
		} else {
			return abbreviateMonth(monthName) + " " + date;
		}
	}
})();

function lastWord(str) {
	for (var i = str.length; i >= 0; i--) {
		if (str[i] == ' ') {
			return str.substring(i + 1, str.length);
		}
	}
	
	return str;
}

function firstWord(str, start) {
	start = typeof start !== 'undefined' ? start : 0;
	
	for (var i = start; i < str.length; i++) {
		if (str[i] == ' ') {
			return str.substring(start, i);
		}
	}
	
	return str.substring(start, str.length);
}

function isPast(happening) {
	return moment(happening.end_time, "x", "en") - moment() < 0;
}

String.prototype.startsWith = function (str) {
	return this.indexOf(str) == 0;
};

if (typeof Array.prototype.indexOf === 'undefined') {
	Array.prototype.indexOf = function(obj) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] == obj) {
				return i;
			}
		}
		
		return -1;
	}
}

function deleteObject(obj) {
	for (var key in obj) {
		delete obj[key];
	}
}

Array.prototype.first = function () {
	if (this.length == 0) {
		return;
	}
	
	return this[0];
};

Array.prototype.last = function () {
	if (this.length == 0) {
		return;
	}
	
	return this[this.length - 1];
};

HTMLCollection.prototype.forEach = function (func) {
	for (var i = 0; i < this.length; i++) {
		func(this[i], i, this);
	}
};

HTMLCollection.prototype.addClass = function (className) {
	if (typeof this.forEach === 'undefined') return;
	
	this.forEach(function (element) {
		element.addClass(className);
	});
};

HTMLCollection.prototype.removeClass = function (className) {
	if (typeof this.forEach === 'undefined') return;
	
	this.forEach(function (element) {
		element.removeClass(className);
	});
};

HTMLCollection.prototype.toggleClass = function (className, has) {
	if (typeof this.forEach === 'undefined') return;
	
	this.forEach(function (element) {
		element.toggleClass(className, has);
	});
};

Array.prototype.last = function () {
	return this.length > 0 ? this[this.length - 1] : undefined;
};

HTMLCollection.prototype.last = Array.prototype.last;

function isArray(obj) {
	return getClassName(obj) === '[object Array]';
}

function getClassName(obj) {
	return Object.prototype.toString.call(obj);
}

HTMLElement.prototype.containsClass = function (className) {
	return this.className.contains(className);
};

HTMLElement.prototype.addClass = function (className) {
	if (this.className.length > 0) {
		if (!this.containsClass(className)) {
			this.className += " " + className;
		}
		
		return false;
	} else {
		this.className = className;
	}
	
	return true;
};

HTMLElement.prototype.removeClass = function (className) {
	var index = this.className.indexOf(className);
	
	if (index >= 0) {
		index = index > 0 ? index : 0;
		var length = index == 0 ? className.length + 1 : className.length;
		length = length > this.className.length ? this.className.length : length;
		
		this.className = this.className.substring(0, index) + this.className.substring(index + length, this.className.length);
		
		return true;
	}
};

HTMLElement.prototype.toggleClass = function (className, has) {
	return has ? this.addClass(className) : this.removeClass(className);
};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.contains = function(str) {
    return this.indexOf(str) !== -1;
};

function getStyleRuleValue(selector, style) {
	selector = typeof selector !== 'string' ? $(selector).attr("id") : selector;
	
    for (var i = 0; i < document.styleSheets.length; i++) {
        var mysheet = document.styleSheets[i];
        var myrules = mysheet.cssRules ? mysheet.cssRules : mysheet.rules;
        if(myrules === undefined || myrules === null || myrules.length <= 0 ) {
        	continue;
        }
        for (var j = 0; j < myrules.length; j++) {
	        var rule = myrules[j];
	        var text = rule.selectorText;
        	if (text && text.contains(selector)) {
		        if (text.length == selector.length || text.indexOf(selector) > 0) {
		        	return rule.style[style];
		        }
            }
        }
    }
}

function getCssStyleAttributeValue(attribute, args) {
	var value;
	
	if (typeof args.element !== 'undefined') {
		/*value = getAttr(args.element, attribute);
		
		if (typeof value === 'undefined') {
			value = $(args.element).css(attribute);
		}*/
		
		value = $(args.element).css(attribute);
	} else if (typeof args.className !== 'undefined') {
		var temp = $("<p class='" + args.className + "'></p>").hide().appendTo("body");
	    value = temp.css(attribute);
	    temp.remove();
	}
    
    return value;
}

function isInt(n) {
	return Number(n) === n && n % 1===0;
}

function isFloat(n) {
	return Number(n) === n && n % 1 !== 0;
}

function isNumber(n) {
	return !isNaN(n) && isFinite(n);
}

function pxAsNumber(n) {
	if (typeof n !== 'string' || n.length == 0) return;
	
	var value = parseFloat(n.substring(0, n.length - 2));
	
	if (!isNumber(value)) {
		return n;
	}
	
	return value;
}

function percentAsNumber(n) {
	return parseFloat(n.substring(0, n.length - 1));
}

function scaleFont(element, scale) {
	element.style.fontSize = pxAsNumber($(element).css("fontSize")) * scale + "px";
}

function getAttr(element, attr) {
	var id = element.getAttribute("id");
	
	id = typeof id !== 'undefined' ? id : element.attr("id");
	
	if (typeof id !== 'undefined') {
		var sheet = getStyleSheet("landing.css");
		var rules = sheet.rules || sheet.cssRules;
	    for (var i = 0; i < rules.length; i++) {
	        var rule = rules[i];
	        var text = rule.selectorText;
	        
	        if (text != undefined) {
		        var str = "#" + id;
		        
		        if (text.contains(str)) {
			        if (text.length == str.length || text.indexOf(str) > 0) {
			        	var val = rule.style.getPropertyValue(attr);
			        	
			        	if (typeof val === 'string' && val.length > 0) {
			        		return val;
			        	}
			        }
		        }
	        }
	    }
	}
}

function getWidth(element) {
	/*if (isNumber(element.offsetWidth) && element.offsetWidth > 0) {
		return element.offsetWidth;
	}
	
	return pxAsNumber(element.style.width);*/
	
	var attr = getCssStyleAttributeValue("width", { element: element });
	
	if (typeof attr !== 'undefined' && attr.endsWith("%")) {
    	return attr;
    }
	
	return $(element).width();
}

function getHeight(element) {
	/*if (isNumber(element.offsetHeight) && element.offsetHeight > 0) {
		return element.offsetHeight;
	}
	
	return pxAsNumber(element.style.height);*/
	
	var attr = getCssStyleAttributeValue("height", { element: element });
	
	if (typeof attr !== 'undefined' && attr.endsWith("%")) {
    	return attr;
    }
	
	return $(element).height();
}

function getPadding(element) {
	var left = pxAsNumber(getCssStyleAttributeValue("padding-left", { element: element }));
	var right = pxAsNumber(getCssStyleAttributeValue("padding-right", { element: element }));
	var top = pxAsNumber(getCssStyleAttributeValue("padding-top", { element: element }));
	var bottom = pxAsNumber(getCssStyleAttributeValue("padding-bottom", { element: element }));
	
	return { left: left, right: right, top: top, bottom: bottom };
	
	//return { width: $(element).innerWidth() - $(element).width(), height: $(element).innerHeight() - $(element).height() };
}

function getMargins(element) {
	var left = pxAsNumber(getCssStyleAttributeValue("margin-left", { element: element }));
	var right = pxAsNumber(getCssStyleAttributeValue("margin-right", { element: element }));
	var top = pxAsNumber(getCssStyleAttributeValue("margin-top", { element: element }));
	var bottom = pxAsNumber(getCssStyleAttributeValue("margin-bottom", { element: element }));
	
	return { left: left, right: right, top: top, bottom: bottom };
	
	//return { width: $(element).outerWidth(true) - $(element).outerWidth(), height: $(element).outerHeight(true) - $(element).outerHeight() };
}

function scaleWidth(element, scale, percents) {
	var width = getWidth(element);
	var padding = getPadding(element);
	var margins = getMargins(element);
	
	if (typeof width == 'string' && width.endsWith("%")) {
		if (percents) {
			width = percentAsNumber(width) * scale + "%";
		}
	} else {
		width = Math.floor(width * scale) + "px";
	}
	
	//width += padding.width * scale;
	//width += margins.width * scale;
	
	element.style.paddingLeft = padding.left * scale + "px";
	element.style.paddingRight = padding.right * scale + "px";
	element.style.marginLeft = margins.left * scale + "px";
	element.style.marginRight = margins.right * scale + "px";
	
	element.style.width = width;
}

function scaleHeight(element, scale, percents) {
	var height = getHeight(element);
	var padding = getPadding(element);
	var margins = getMargins(element);
	
	if (typeof height == 'string' && height.endsWith("%")) {
		if (percents) {
			height = percentAsNumber(height) * scale + "%";
		}
	} else {
		height = Math.floor(height * scale) + "px";
	}
	
	//height += padding.height * scale;
	//height += margins.height * scale;
	
	element.style.paddingTop = padding.top * scale + "px";
	element.style.paddingBottom = padding.bottom * scale + "px";
	element.style.marginTop = margins.top * scale + "px";
	element.style.marginBottom = margins.bottom * scale + "px";

	element.style.height = height;
}

function getStyleSheet(name) {
	for (var i = 0; i < document.styleSheets.length; i++) {
		var sheet = document.styleSheets[i];
		
		if (typeof sheet.href === 'string' && sheet.href.endsWith(name)) {
			return sheet;
		}
	}
}

function scaleElement(element, elementScale, args) {
	args = typeof args !== 'undefined' ? args : {};
	
	args.included = typeof args.included !== 'undefined' ? args.included : true;
	args.transform = typeof args.transform !== 'undefined' ? args.transform : false;
	
	if (args.transform) {
		if (args.included) {
			element.setAttribute("scale", elementScale / 100);
			
			$(element).css("transform", "scale(" + elementScale / 100 + ")");
		} else {
			var children = element.children;
			
			for (var i = 0; i < children.length; i++) {
				scaleElement(children[i], elementScale);
			}
		}
	} else {
		var str = elementScale;
		var percentage = undefined;
		
		function scale(element, percents) {
			if (element.getAttribute("wp-no-scale") != null) return;
			
			var tag = element.tagName.toLowerCase();
	
			if (tag == "br") {
				
			} else if (tag == "p") {
				scaleFont(element, percentage);
			} else {
				scaleWidth(element, percentage, percents);
				scaleHeight(element, percentage, percents);
			}
			
			if (tag == "input") {
				scaleFont(element, percentage);
			}
			
			var children = element.children;
			
			for (var i = 0; i < children.length; i++) {
				scale(children[i], percents);
			}
		}
		
		if (typeof str !== 'number') {
	    	var index = str.indexOf("%");
	    	
	    	if (index > 0) {
	    		str = str.substring(0, index);
	    	}
	    	
	    	if (str.length > 0) {
	        	percentage = parseFloat(str);
	    	}
	    	
	    	if (!isNumber(percentage)) {
	         	console.error("Invalid scale '" + orig + "' given as argument to wpScale");
	         	return;
	    	}
		} else {
			percentage = str;
		}
		
		percentage /= 100;
		
		var originalPercent = percentage;
		
		if (element.getAttribute("scale") !== null) {
			percentage = originalPercent / parseFloat(element.getAttribute("scale"));
		}
		
		element.setAttribute("scale", originalPercent);
		
		if (args.included) {
			scale(element, false);
		} else {
			var children = element.children;
			
			for (var i = 0; i < children.length; i++) {
				scale(children[i], false);
			}
		}
	}
}

/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function getIEVersion()
{
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    
    if (msie > 0)
    {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    
    if (trident > 0)
    {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    
    if (edge > 0)
    {
       // IE 12 => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return 0;
}

function usingIE()
{
	return getIEVersion() > 0;
}

function usingChrome()
{
	var isChromium = window.chrome, vendorName = window.navigator.vendor;
	
	if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc.")
	{
		return true;
	}
	
	return false;
}

function usingMobile()
{
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

var IEVersion   = getIEVersion();
var usingIE     = usingIE();
var usingChrome = usingChrome();
var usingMobile = usingMobile();

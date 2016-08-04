app.directive('draggable', ['$filter', function($filter) {
	return {
		restrict : 'A',
		scope: {
			ngModel: "=?"
		},
		link : function(scope, elements, attrs) {
			var element = elements[0];
			
			var coordX, coordY, offsetX, offsetY;
			
			var drag = false;
			var property, capitalized;
			
			function startDrag(e) {
				// determine event object
				if (!e) {
					var e = window.event;
				}
				
				element.toggleClass("dragging", true);
				
				// calculate event X, Y coordinates
				offsetX = e.clientX;
				offsetY = e.clientY;

				// assign default values for top and left properties
				if (!element.style.left) {
					element.style.left = '0px'
				}
				
				if (!element.style.top) {
					element.style.top = '0px'
				}

				// calculate integer values for top and left
				// properties
				coordX = parseInt(element.style.left);
				coordY = parseInt(element.style.top);
				drag = true;
				
				// move div element
				document.onmousemove = dragDiv;
				
				e.stopPropagation();
				
				return false;
			}
			
			function dragDiv(e) {
				e.stopPropagation();
				
				if (!drag) {
					return false;
				}
				
				if (!e) {
					var e = window.event
				}
				
				moveElement(e.clientX - offsetX, e.clientY - offsetY);
				
				offsetX = e.clientX;
				offsetY = e.clientY;
				
				return false;
			}
			
			function stopDrag() {
				element.toggleClass("dragging", false);
				
				drag = false;
			}
			
			function moveElement(dx, dy) {
				var maxX = element.parentNode.offsetWidth - element.offsetWidth;
				var maxY = element.parentNode.offsetHeight - element.offsetHeight;
				
				// move div element
				element.style.left = Math.min(0, Math.max(maxX, dx + parseFloat(element.style.left))) + 'px';
				element.style.top = Math.min(0, Math.max(maxY, dy + parseFloat(element.style.top))) + 'px';
				
				updateModel();
			}
			
			var zoomScale = 5;
			var maxSize = 3000;
			
			function onwheel(e) {
				var deltaY = 0;

				e.preventDefault();

				if (e.deltaY) { // FireFox 17+ (IE9+, Chrome 31+?)
					deltaY = e.deltaY;
				} else if (e.wheelDelta) {
					deltaY = -e.wheelDelta;
				}
				
				deltaY /= 3;
				
				var oldWidth = element.offsetWidth;
				var oldHeight = element.offsetHeight;
				var parentWidth = element.parentNode.offsetWidth;
				var parentHeight = element.parentNode.offsetHeight
				
				element.style[property] = Math.min(maxSize, Math.max(element.parentNode["offset" + capitalized], element["offset" + capitalized] + (zoomScale * -deltaY))) + "px";
				
				var scaleX = (element.offsetWidth - oldWidth) / 2.0;
				var scaleY = (element.offsetHeight - oldHeight) / 2.0;
				
				var offsetX = -scaleX;
				var offsetY = -scaleY;
				
				moveElement(offsetX, offsetY);
				
				updateModel();
			}
			
			element.onwheel = onwheel;
			element.onmousedown = startDrag;
			document.onmouseup = stopDrag;
			
			function updateModel() {
				if (typeof attrs.ngModel !== 'undefined') {
					var left = parseFloat(element.style.left);
					var top = parseFloat(element.style.top);
					
					scope.ngModel = {
						x: left == 0 ? 0 : -left,
						y: top == 0 ? 0 : -top,
						width: element.offsetWidth,
						height: element.offsetHeight,
						frameWidth: element.parentNode.offsetWidth,
						frameHeight: element.parentNode.offsetHeight
					};
					
					scope.$apply();
				}
			}
			
			element.addEventListener("load", function () {
				if (element.width > element.height) {
					element.style.minHeight = "100%";
					
					property = "height";
				} else {
					element.style.minWidth = "100%";
					
					property = "width";
				}
				
				capitalized = $filter("capitalize")(property);
				
				minimumWidth = element.width;
				
				updateModel();
			});
		}
	}
}]);
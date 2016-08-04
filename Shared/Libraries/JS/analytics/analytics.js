var $analytics = function () {
	function callServlet(type, async) {
		async = typeof async !== 'undefined' ? async : true;
		
		$.ajax({
    		type: "POST",
    		url: "/analytics",
    		data: { type: type },
	        async: async,
    		success: function(data) {
    			//console.log("Success " + type + ": " + data.responseText);
    		}
    	}).fail(function(data) {
    		//console.log("Fail " + type + ": " + data.responseText);
    	});
	}
	
	function load() {
		callServlet("load");
	}
	
	function beforeExit() {
		callServlet("end", false);
	}
	
	this.subscribe = function () {
		callServlet("subscribe");
	};
	
	this.play = function () {
		callServlet("videoPlay");
	};
	
	this.pause = function () {
		callServlet("videoPause");
	};
	
	load();
	$(window).unload(beforeExit);
};

var analytics = new $analytics();

$(document).ready(function () {
	analytics.play();
});
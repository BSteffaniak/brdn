var isLocalhost, isAndroid, isIPhone, isMobile;

app.service("$utils", [function () {
	isLocalhost = document.domain == "localhost";
	isAndroid = typeof androidContext !== 'undefined' && typeof androidContext.isAndroid === 'function' && androidContext.isAndroid() ? true : false;
	isIPhone = typeof isIPhone === "function" && isIPhone() ? true : false;
	isMobile = (typeof usingMobile !== 'undefined' && usingMobile) || this.isAndroid || this.isIPhone;
	
	this.isLocalhost = isLocalhost;
	this.isAndroid = isAndroid;
	this.isIPhone = isIPhone;
	this.isMobile = isMobile;
	
	this.contextParams = {
		USER_IMAGE_HOME: "http://wolfpaq.co:8888/images/users/",
		USER_IMAGE_HOME_LOCAL: "/images/users/",
		WOLFPAQ_IMAGE_HOME: "http://wolfpaq.co:8888/images/wolfpaqs/",
		WOLFPAQ_IMAGE_HOME_LOCAL: "/images/wolfpaqs/",
		HAPPENING_IMAGE_HOME: "http://wolfpaq.co:8888/images/happenings/",
		HAPPENING_IMAGE_HOME_LOCAL: "/images/happenings/",
		HOWL_IMAGE_HOME: "http://wolfpaq.co:8888/images/howls/",
		HOWL_IMAGE_HOME_LOCAL: "/images/howls/",
		TEMP_HAPPENING_IMAGE_HOME: "http://wolfpaq.co:8888/images/temphappenings/",
		TEMP_HAPPENING_IMAGE_HOME_LOCAL: "/images/temphappenings/",
		DEFAULT_IMAGE_HOME: "http://wolfpaq.co:8888/images/default/",
		DEFAULT_IMAGE_HOME_LOCAL: "/images/default/"
	};
}]);

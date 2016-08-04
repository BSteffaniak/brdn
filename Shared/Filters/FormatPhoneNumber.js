app.filter('formatPhoneNumber', function($sce){
    return function(text) {
    	if (text.length == 7) {
    		return text.substring(0, 4) + '-' + text.substring(4, 7);
    	} else if (text.length == 10) {
    		return text.substring(0, 3) + '-' + text.substring(3, 6) + '-' + text.substring(6, 10);
    	} else if (text.length == 11) {
			return text.substring(0, 1) + '-' + text.substring(1, 4) + '-' + text.substring(4, 7) + '-' + text.substring(7, 11);
		}
    	
    	return text;
    };
});
app.filter('capitalize', function() {
	return function(input, scope) {
		if (typeof input !== 'string' || input.length === 0) {
			return input;
		}
		
		return input.substring(0, 1).toUpperCase() + input.substring(1);
	};
});
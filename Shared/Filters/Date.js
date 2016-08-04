app.filter('dateToWords', function() {
	return function(input, scope) {
		var str = moment().to(moment(input, /*"M/DD/YYYY h:mm:ss A"*/"x", "en"));
		var num;
		var future = str.length > 3 && str.substring(0, 3) == "in ";
		var past = !future && (num = parseFloat(str)) > 0;
		
		if (future && firstWord(str, 3 + firstWord(str, 3).length + 1) == "days") {
			num = parseFloat(firstWord(str, 3));
			
			if (num % 7 == 0 || num >= 12) {
				var weeks = Math.round(num / 7);
				
				return "in " + weeks + " week" + (weeks > 1 ? "s" : "");
			}
		} else if (past && firstWord(str, firstWord(str).length + 1).startsWith("days") && (num % 7 == 0 || num >= 12)) {
			var weeks = Math.round(num / 7);
			
			return weeks + " week" + (weeks > 1 ? "s" : "") + " " + lastWord(str);
		}
		
		return str;
	};
}).filter('shortenDate', function() {
	return function(input, scope) {
		var format = "h:mmA";
		var date = moment(input, /*"M/DD/YYYY h:mm:ss A"*/"x", "en");
		
		if (moment().year() != date.year()) {
			format += " M/DD/YYYY";
		} else if (moment().dayOfYear() != date.dayOfYear()) {
			format += " M/DD";
		}
		
		return formatDate(input, "h:mm A <M/DD[M/DD/YYYY]></YYYY>");
	};
});
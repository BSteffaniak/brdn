app.filter('wolfpaqName', function() {
	return function(input) {
		return '#' + input;
	};
}).filter('classify', function() {
	return function(input) {
		return classify(input);
	};
}).filter('camelCase', function() {
	return function(input) {
		return camelCase(input);
	};
}).filter('goingStatus', function() {
	return function(status) {
		return status == true ? "GOING" : (status == false ? "NOT GOING" : "");
	};
}).filter('debug', function() {
	return function (input) {
		return input !== '' ? input || '' + input : "[empty string]";
	};
}).filter('type', function() {
	return function (input) {
		return typeof input;
	};
}).filter('wolfpaqRestriction', function() {
	return function(input) {
		if (!input) {
			return 'Public';
		} else if (input == 'Invite') {
			return 'Invite only';
		}
		
		return 'Unknown';
	};
}).filter('wolfpaqRestrictionImageSrc', function() {
	return function(input) {
		var source = "Shared/Images/";
		
		if (!input) {
			source += 'lock.svg';
		} else if (input == 'Invite') {
			source += 'lock.svg';
		}
		
		return source;
	};
}).filter('greenImage', function() {
	return function(input) {
		return input.substring(0, input.indexOf(".svg")) + "Green.svg";
	};
}).filter('wolfpaqImage', ['$rootScope', function($rootScope) {
	return function(input) {
		return input ? $rootScope.contextParams['WOLFPAQ_IMAGE_HOME'] + input + "/current.png" : "";
	};
}]).filter('happeningImage', ['$rootScope', function($rootScope) {
	return function(input) {
		return input ? $rootScope.contextParams['HAPPENING_IMAGE_HOME'] + input + "/current.png" : "";
	};
}]).filter('defaultHappeningImage', ['$rootScope', function($rootScope) {
	return function(input) {
		return input ? $rootScope.contextParams['DEFAULT_IMAGE_HOME'] + "forest/forest-" + (input % 24 + 1) + ".png" : "";
	};
}]).filter('defaultHowlImage', ['$rootScope', function($rootScope) {
	return function(input) {
		return input ? $rootScope.contextParams['DEFAULT_IMAGE_HOME'] + "wolves/wolf-" + (input % 1 + 1) + ".png" : "";
	};
}]).filter('howlImage', ['$rootScope', function($rootScope) {
	return function(input) {
		return input ? $rootScope.contextParams['HOWL_IMAGE_HOME'] + input + "/current.png" : "";
	};
}]).filter('userImage', ['$rootScope', function($rootScope) {
	return function(input) {
		return input ? $rootScope.contextParams['USER_IMAGE_HOME_LOCAL'] + input + "/current.jpg" : "";
	};
}]).filter('tempHappeningImage', ['$rootScope', function($rootScope) {
	return function(input) {
		return input ? $rootScope.contextParams['TEMP_HAPPENING_IMAGE_HOME' + (isLocalhost ? "_LOCAL" : "")] + input + "/current.png?cache=" + Date.now() : "";
	};
}]).filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }
		
		tel = "" + tel;
		
		while (tel.length < 10) {
			tel += "_";
		}
		
		return "({0}) {1}-{2}".format(tel.substring(0, 3), tel.substring(3, 6), tel.substring(6));

        /*var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + " (" + city + ") " + number).trim();*/
    };
});
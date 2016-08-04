app.directive('peopleList', ['$localStorage', '$server', function($localStorage, $server) {
	return {
        restrict: 'EA',
        scope: {
        	list: "=",
        	wolfpaq: "=?",
        	defaultMessage: "=?",
        	action: "@?",
			orderBy: "@?",
			limit: "=?"
        },
        link: function (scope, elements, attrs) {
			if (typeof scope.orderBy !== 'undefined') {
				var array = scope.orderBy.split(/ /g);
				
				var attribute = array[0];
				var order = array[1];
				
				scope.order = attribute;
				scope.reverse = order.toLowerCase() == "desc";
			}
			
        	if (typeof scope.action !== 'undefined') {
        		scope.performAction = function (person) {
        			scope.$parent[scope.action](person);
        		};
        		
        		scope.usingAction = true;
        	}
			
			scope.session = $localStorage;
			
			if (scope.session.user) {
				scope.$watch("list", function (list) {
					if (list) {
						list.forEach(function (person) {
							person.isFriend = typeof person.isFriend !== 'undefined' ? person.isFriend : scope.session.user.friends.indexOf(person.id) >= 0;
							person.requestSent = typeof person.requestSent !== 'undefined' ? person.requestSent : scope.session.user.friendRequests.indexOf(person.id) >= 0;
						});
					}
				});
			}
			
			scope.sendFriendRequest = function (person) {
				person.requestSent = true;
				
				$server.put("FriendRequest", {
					userId: person.id,
					value: true
				}, {
					callback: function (success, data) {
						if (success && data && data.value) {
							scope.session.user.friendRequests.push(person.id);
						} else {
							person.requestSent = false;
						}
					}
				});
			};
        },
		templateUrl: 'Shared/Templates/PeopleList.html'
    };
}]);
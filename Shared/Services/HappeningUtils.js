app.service("$happeningUtils", ['$localStorage', '$server', '$mql', function ($localStorage, $server, $mql) {
	var self = this;
	
	var session = $localStorage;
	
	function checkCurrentUser(person) {
		return person.username == session.user.username;
	}
	
	this.setUserGoing = function (happening, going) {
		if (happening.going === going) {
			return;
		}
		
		happening.going = going;
		
		if (happening.invites) {
			happening.invites.filter(checkCurrentUser).forEach(function (person) {
				person.going = going;
			});
		}
		
		$server.sendData("happening invite", {
			id: happening.id,
			status: going
		});
	};
	
	this.buildQuery = function () {
		return $mql.queryBuilder()
			.select(["id", "wolfpaq_id", "name", "restriction", "creator_id", "location_id", "start_time", "end_time", "description"])
			.select("happening_invites.status", "going")
			.select("(happening_invites.user_id isnt null)", "invited")
			.select("creator").enter()
				.select(["id", "username"])
				.from("users.users")
				.where("id=@creator_id")
				.limit(1)
			.exit()
			.select("wolfpaq").enter()
				.select(["id", "name"])
				.from("wolfpaqs.wolfpaqs")
				.where("id=@wolfpaq_id")
				.limit(1)
			.exit()
			.select("invites").enter()
				.select(["id", "status", "username"])
				.from("events.happening_invites")
				.join("inner", "users.users", "users.users.id=user_id")
				.where("happening_id=@id")
				.orderBy("status [true, NULL, false]")
			.exit()
			.from("events.happenings")
			.join("left", "events.happening_invites", "happening_invites.happening_id=happenings.id and happening_invites.user_id=$userID");
	};
}]);

app.service("$wolfpaqUtils", ['$localStorage', '$server', '$mql', function ($localStorage, $server, $mql) {
	var self = this;
	
	this.buildQuery = function () {
		return $mql.queryBuilder()
			.select(["id", "name", "tag", "restriction", "description", "owner_id"])
			.select("members").enter()
				.select(["id", "full_name", "username"])
				.from("wolfpaqs.wolfpaq_invites")
				.join("inner", "users.users", "users.id=wolfpaq_invites.user_id")
				.where("wolfpaq_id=@id and time_accepted isnt null")
			.exit()
			.select("leader").enter()
				.select(["id", "full_name", "username"])
				.from("users.users")
				.where("id=@owner_id")
				.limit(1)
			.exit()
			.from("wolfpaqs.wolfpaqs")
			.join("inner", "wolfpaqs.wolfpaq_invites", "time_accepted isnt null and wolfpaq_id=wolfpaqs.id and user_id=$userID");
	};
}]);

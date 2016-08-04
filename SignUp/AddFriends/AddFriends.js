app.controller('AddFriends', [ '$scope', '$registerUtils', function($scope, $registerUtils) {
	$scope.session.signup = $scope.session.signup || {};
	
	$scope.contacts = [{"name":"Twitter","number":"40404","email":""},{"name":"Dillian","number":"6605375897","email":""},{"name":"David Baker","number":"6189778950","email":""},{"name":"Graham","number":"6185319497","email":"grahaman27@gmail.com"},{"name":"Mom","number":"6184772436","email":""},{"name":"Matt Hamilton","number":"4172990951","email":""},{"name":"Nick Fischer","number":"6187998806","email":""},{"name":"Rich Goldman","number":"6185310965","email":""},{"name":"Ethan Davis","number":"4172701495","email":""},{"name":"Curt Brewer","number":"6188308351","email":""},{"name":"Patrick Shelton","number":"3144021739","email":""},{"name":"Dad","number":"6184772433","email":""},{"name":"Jonny Sones","number":"6184203285","email":""},{"name":"Ryan Kaminsky","number":"6184069676","email":""},{"name":"Whitney Petty","number":"3146064957","email":""},{"name":"Cole","number":"4173995902","email":""},{"name":"Connor Wright","number":"6186046962","email":""},{"name":"Chris Wells","number":"6185818625","email":""},{"name":"Chris Kimberling","number":"8165821842","email":""},{"name":"Tristan","number":"6184340067","email":""},{"name":"Jeremy","number":"4172347391","email":""},{"name":"Jordan Steffaniak","number":"6186703653","email":""},{"name":"Matt Randolph","number":"4173224928","email":""},{"name":"Datyana Ware","number":"6185600721","email":""},{"name":"Mike Babcock","number":"6189722550","email":""},{"name":"Arthur Harmon","number":"5738544020","email":""},{"name":"Chris Mc Laughlin","number":"6183637234","email":""},{"name":"Ian","number":"3149723294","email":""},{"name":"Caleb McDaniel","number":"4173990204","email":""},{"name":"Matt Goldman","number":"6187410126","email":""},{"name":"Shannon McWhorter","number":"6185814722","email":""},{"name":"German Rivera","number":"6184027330","email":""},{"name":"Krista Duncan","number":"5733176313","email":""},{"name":"John Marriott","number":"2176210932","email":"marriott@gmail.com"},{"name":"Andrew Stanfill","number":"6188302388","email":""},{"name":"David Gille","number":"3148080461","email":""},{"name":"Spencer Greathouse","number":"7856393777","email":""},{"name":"Justin Schwertmann","number":"6184110061","email":""},{"name":"Chad","number":"6184447128","email":""},{"name":"Nathan Church","number":"4026728778","email":""},{"name":"Natasha Bailey","number":"15734803428","email":""},{"name":"Gordan Gillbertson","number":"4179553278","email":""},{"name":"Mike Sonderegger","number":"6183342732","email":""},{"name":"Reece Without A Spoon","number":"4178184792","email":""},{"name":"Nathan Lutes","number":"6185819976","email":""},{"name":"Dont Answer","number":"6185092655","email":""},{"name":"Adam Gregory","number":"6184204040","email":""},{"name":"Nicki Turano","number":"16363286003","email":""},{"name":"Boeing Contractor","number":"6233747762","email":""},{"name":"William Cornelison","number":"8082864274","email":""},{"name":"Chase Bussey","number":"16602871705","email":""},{"name":"Grandparents","number":"8653979274","email":""},{"name":"Jordan Brown","number":"4172984264","email":""},{"name":"Kendra","number":"4172342183","email":""},{"name":"Ben Haworth","number":"4175217763","email":"s631512@sbuniv.edu"},{"name":"John Taylor","number":"4795860848","email":""},{"name":"Zack Anderson","number":"6183346162","email":""},{"name":"Janna Stewart","number":"6187810500","email":""},{"name":"Caleb Thorpe","number":"6187925079","email":""},{"name":"Ben Lopez","number":"3234735021","email":""},{"name":"Ted Correll","number":"3097388994","email":""},{"name":"Steve Akeman","number":"16186161074","email":""},{"name":"Courtnay","number":"13094536037","email":""},{"name":"Ephraim Burrell","number":"6189208961","email":""},{"name":"Tyler Wright","number":"19196731060","email":""},{"name":"Cameron Ahlvers","number":"16189780475","email":""}];
	
	$scope.validate = function () {
		$scope.register();
	};
	
	submitFunction = $scope.validate;
	
	$scope.success = false;
	
	$scope.register = function () {
		$scope.success = null;
		
		$registerUtils.register(function (success) {
			$scope.success = success;
			
			if (success) {
				$scope.home();
			}
		});
	};
}]);
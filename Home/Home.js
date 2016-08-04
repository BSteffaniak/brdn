app.controller('Home', [ '$scope', function($scope) {
	d3.select("#journey").on("click", function () {
		console.log("asdf", $(window).height())
		$('div.view').animate({
          scrollTop: $(window).height()
        }, 1000);
	});
}]);
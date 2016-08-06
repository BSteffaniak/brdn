app.controller('Home', [ '$scope', function($scope) {
	d3.select("#next").on("click", function () {
		$('div.view').animate({
          scrollTop: $(window).height()
        }, 1000);
	});
}]);
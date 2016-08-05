app.controller('Home', [ '$scope', function($scope) {
	d3.select("#next").on("click", function () {
		$('div.view').animate({
          scrollTop: $(window).height()
        }, 1000);
	});
	
	var slides = d3.selectAll(".slide")[0];
	
	var view = d3.select("div.view");
	
	function refreshSlides() {
		for (var i = 0; i < slides.length; i++) {
			var distance = Math.abs(view.node().scrollTop - slides[i].offsetTop);
			
			d3.select(slides[i]).classed("active", distance < 100);
		}
	}
	
	view.on("scroll", refreshSlides);
	
	refreshSlides();
}]);
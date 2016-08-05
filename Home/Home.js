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
			var y = slides[i].offsetTop;
			var height = slides[i].offsetHeight;
			var scroll = view.node().scrollTop;
			var scrollBottom = scroll + $(window).height();
			var distance = Math.abs(scroll - y);
			
			d3.select(slides[i]).classed("active", distance < 100);
			d3.select(slides[i]).classed("visible", y < scrollBottom && y + height > scroll);
		}
	}
	
	view.on("scroll", refreshSlides);
	
	refreshSlides();
}]);
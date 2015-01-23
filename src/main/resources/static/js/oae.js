$(document).ready(function() {
	$("#launch-app").on('click', function(e) {
		var w = $("#app-holder").parent().width();
		$("#main-launcher").slideUp("fast", function() {
			$("#app-holder")
				.attr("src", $(this).attr("href"))
				.attr("width", w)
				.attr("height", w * 0.7);
			$("#app-holder-wrapper").slideDown();
			
		});
		e.stopPropagation();
		return false;
	});
});
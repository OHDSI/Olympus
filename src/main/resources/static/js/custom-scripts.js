$(document).ready(function() {
	$(".launch-app").click(function(e) {
		var w = $("#navbar").width();
		var href = $(this).attr("href");
		if (href === "#") {
			return false;
		}
		$("#main-launcher").slideUp("slow", function() {
			$("#app-holder")
				.attr("src", href)
				.attr("width", w)
				.attr("height", "1000");
			$("#app-holder-wrapper").slideDown("slow");
			
		});
		e.stopPropagation();
		return false;
	});

});
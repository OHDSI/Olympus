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
				.attr("height", "2500");
			$("#app-holder-wrapper").slideDown("slow");
			
		});
		e.stopPropagation();
		return false;
	});
	
	$('#frmLaunchWebApi').submit(function() {
	    // handle form processing here
	  	$('button').prop('disabled', true);
	  	//form submit
	  	return true;
	});
	
	$('#apps, .launch-apps-link').click('show', function(e) {
		//alert('hello'+e.target);
	    paneID = $(e.target).attr('href');
	    src = $(paneID).attr('data-src');
	    // if the iframe hasn't already been loaded once
	    if($(paneID+" iframe").attr("src")=="")
	    {
	    	$("#apps-label").html($(e.target).text() + ' <span class="caret"></span>');
	        $(paneID+" iframe").attr("src",src);
	    }
	    
	    $("body").css("background", "white");
	});
	
	$(".launch-link-row").click(function() {
		var type = $(this).attr("type");
		$("#" + type + "-link").trigger("click");
	});

});
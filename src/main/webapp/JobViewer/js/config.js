var ohdsi_service;
var ohdsi_services;
(function($) {
	$.ajax({
		type : "GET",
		url : "http://localhost:20000/webapi",
		async : false,// synch requests trigger 'Synchronous XMLHttpRequest on
						// the main thread is deprecated'. A better way?
		success : function(data) {
			console.log(data);
			ohdsi_services = data;
			ohdsi_service = ohdsi_services[0].url
		}
	});
})(jQuery);
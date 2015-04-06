
require.config({
	baseUrl: "js",
	paths: {
		"appConfig" : "config",
		"text": "requirejs/plugins/text",
		"css": "requirejs/plugins/css",
		"json": "requirejs/plugins/json",
		"jquery": "jquery-1.11.1.min",
		"jquery-ui": "jqueryui/jquery-ui.min",
		"knockout": "knockout-3.3.0",
		"webapi" : "modules/WebAPIProvider",
		"datatables": "jqueryui/jquery.dataTables.min",
		"jobService": "modules/WebAPIProvider/JobService",
		"ColVis": "jqueryui/dataTables.colVis.min"
	},
	deps: ['jquery',
				 'jquery-ui',
				 'jqueryui/jquery.ui.autocomplete.scroll',
				 'css!jqueryui/jquery.dataTables.css',
				 'css!jqueryui/dataTables.colVis.css'
				]
});

require(['jquery','datatables','jobService'], function ($,dt,js) {
	
	var json = {
			  "demo": [
			           [
			             "Tiger Nixon",
			             "System Architect",
			             "Edinburgh",
			             "5421",
			             "2011/04/25",
			             "$320,800"
			           ],
			           [
			             "Garrett Winters",
			             "Accountant",
			             "Tokyo",
			             "8422",
			             "2011/07/25",
			             "$170,750"
			           ],
			           [
			             "Ashton Cox",
			             "Junior Technical Author",
			             "San Francisco",
			             "1562",
			             "2009/01/12",
			             "$86,000"
			           ],
			           [
			             "Cedric Kelly",
			             "Senior Javascript Developer",
			             "Edinburgh",
			             "6224",
			             "2012/03/29",
			             "$433,060"
			           ],
			           [
			             "Airi Satou",
			             "Accountant",
			             "Tokyo",
			             "5407",
			             "2008/11/28",
			             "$162,700"
			           ],
			           [
			             "Brielle Williamson",
			             "Integration Specialist",
			             "New York",
			             "4804",
			             "2012/12/02",
			             "$372,000"
			           ],
			           [
			             "Herrod Chandler",
			             "Sales Assistant",
			             "San Francisco",
			             "9608",
			             "2012/08/06",
			             "$137,500"
			           ],
			           [
			             "Rhona Davidson",
			             "Integration Specialist",
			             "Tokyo",
			             "6200",
			             "2010/10/14",
			             "$327,900"
			           ],
			           [
			             "Colleen Hurst",
			             "Javascript Developer",
			             "San Francisco",
			             "2360",
			             "2009/09/15",
			             "$205,500"
			           ],
			           [
			             "Sonya Frost",
			             "Software Engineer",
			             "Edinburgh",
			             "1667",
			             "2008/12/13",
			             "$103,600"
			           ],
			           [
			             "Jena Gaines",
			             "Office Manager",
			             "London",
			             "3814",
			             "2008/12/19",
			             "$90,560"
			           ],
			           [
			             "Quinn Flynn",
			             "Support Lead",
			             "Edinburgh",
			             "9497",
			             "2013/03/03",
			             "$342,000"
			           ],
			           [
			             "Charde Marshall",
			             "Regional Director",
			             "San Francisco",
			             "6741",
			             "2008/10/16",
			             "$470,600"
			           ]
			         ]
			       }
	
	$(document).ready(function() {
	    $('#example').dataTable( {
	    	"data": json,
	        columns: [
			            { "demo": "0" }
			        ]
//	        "ajax": {
////	            "data": json,
//	            "dataSrc": "demo"
//	        }
	    } );
	} );
	
});
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
	
	$(document).ready(function() {
/*		$.when(js.getJobNames(),js.getJobExecutions()).done(function(jobNames, jobExecutions) {
			  // Handle both XHR objects
			alert(jobNames);
			alert(jobExecutions);
		    var tblJobNames = $('#jobNames').dataTable( {
		        data: jobNames,
//		        columns: [
//		            { "": "" }
//		        ]
		    } );
		    
		    var tblJobExecutions = $('#jobExecutions').dataTable( {
		        data: jobExecutions,
		        ajax:{dataSrc:"content"},
		        columns: [
		            { data: "executionId" }
		        ]
		    } );
			});
		*/
		$.when(js.getJobNames(), js.getJobExecutions()).done(function( jobNames, jobExecutions) {
			console.log(jobNames[0]);
			console.log(jobExecutions[0]);
			alert(jobNames[0]);
		    var tblJobNames = $('#jobNames').dataTable( {
		        data: jobNames[0],
//		        columns: [
//		            { "": "" }
//		        ]
		    } );
		    
		    var tblJobExecutions = $('#jobExecutions').dataTable( {
		        ajax: jobExecutions[0],
		        //ajax:{dataSrc:""},
		        columns: [
		            { data: "totalPages"},
		            { data: "content.0" }
		        ]
		    } );
			});
		
/*		$.when(js.getJobExecutions()).done(function(jobExecutions) {
		    var tblJobExecutions = $('#jobExecutions').dataTable( {
		        data: jobExecutions,
		        ajax:{dataSrc:"content"},
		        columns: [
		            { data: "executionId" }
		        ]
		    } );
			});*/
		
		//var data = [{"id":14,"name":"Homeless Female Patients","description":"Cohort derived from NLP of Homeless Female patients","expressionType":"SIMPLE_EXPRESSION","createdBy":"OHDSI","createdDate":"2015-03-06, 14:39","modifiedBy":null,"modifiedDate":null}];
/*		var data = cd.getCohortDefinitionList();
		alert(data);
	    var table = $('#example').dataTable( {
	        data: data,
//	        ajax:{dataSrc:""},
	        columns: [
	            { data: "id" },
	            { data: "name" }
	        ]
	    } );*/
	    
//		setInterval( function () {
//		    table.ajax.reload( null, false ); // user paging is not reset on reload
//		}, 30000 );
	} );
	
	
	
	
/*// console.log($('#example'));
	var table = $('#example').dataTable( {
//		 "processing": true,
//	        "serverSide": true,
		ajax: cd.getCohortDefinitionList(),
//        ajax: { dataSrc: "", ajax : cd.getCohortDefinitionList() },
//        ajax: { dataSrc: "", ajax : "http:localhost:20000/WebAPI/cohortdefinition" },
//		"ajax": "test.json",
        columns: [
            { "id": "id" },
            { "name": "name" }
        ]
    } );
	
	setInterval( function () {
	    table.ajax.reload( null, false ); // user paging is not reset on reload
	}, 30000 );*/
	
});
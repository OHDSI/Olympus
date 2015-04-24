require.config({
	baseUrl: "js",
	paths: {
		"appConfig" : "config",
		"text": "requirejs/plugins/text",
		"css": "requirejs/plugins/css",
		"json": "requirejs/plugins/json",
		"bootstrap": "bootstrap/bootstrap.min",
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
				]/*
					 * , urlArgs: { 'bust': Date.now() }//clear cache
					 */ 
});

require(['jquery','bootstrap','datatables','jobService'], function ($,bs,dt,js) {

//var tblJobExecutions;

$(document).ready(function() {
	
	$("#btnReload").click(function(){load();});

	
    setTimeout(function() {
        $(".webapi-dropdown").empty();
	$.each(ohdsi_services, function(i, service) {
		console.log('url:' + service.url);
		$.ajax({
			url : service.url + 'vocabulary/info',
			async : false,
			method : 'GET',
			contentType : 'application/json',
			success : function(info) {
				service.version = info.version;
				service.dialect = info.dialect;
				//console.log(info.version + ":" + info.dialect);
			},
			error : function(err) {
				console.log("ERROR"+err);
				service.version = 'unknown';
				service.dialect = 'unknown';
				//$('#configuration-cog').addClass('warning');
			}
		});
        var li = $('<li/>');
        var div = $('<div/>');
        var divInfo = $('<div/>');
        var spanText = $('<span>');
        var spanUrl = $('<span>');

        spanText.html(this.name)
        	.css('font-weight', this.url === ohdsi_service ? 'bold' : 'normal')
            .appendTo(div);
        spanUrl/*.html(this.url)*/
           .addClass(this.version === 'unknown' ? "glyphicon glyphicon-ok-sign warning" : "glyphicon glyphicon-ok-sign")
           .appendTo(div);
        div
        	.addClass("service-name")
        	.appendTo(li);
        divInfo.addClass("service-info")
        	.html('Vocabulary ' + service.version + ' (' + service.dialect + ')')
        	.appendTo(li);
        li
            .attr('webApiIdx', i)
            .click(function() {
        		updateService(ohdsi_services[+$(this).attr('webApiIdx')]);
            })
            .appendTo($(".webapi-dropdown"));
	});
}, 150);

function updateService (service) {
		console.log("Changing to : " + service.name);
		$('#configuration-cog').removeClass('warning');
			ohdsi_service = service.url;
			if (service.version == 'unknown') {
				clear();
				$('#configuration-cog').addClass('warning');
			}else{
				load();
			}
}

load();

function clear(){
	var table = $('#jobExecutions').DataTable();
	 console.log(table);
	table
		.destroy()
	    .clear()
	    .draw();	
}

// var str =
// {"totalPages":28,"totalElements":274,"size":10,"number":0,"content":[{"status":"COMPLETED","startDate":1428082844800,"endDate":1428083960957,"exitStatus":"COMPLETED","executionId":273,"jobInstance":{"instanceId":273,"name":"cohortAnalysisJob"}},{"status":"COMPLETED","startDate":1428069660174,"endDate":1428074406780,"exitStatus":"COMPLETED","executionId":272,"jobInstance":{"instanceId":272,"name":"cohortAnalysisJob"}},{"status":"COMPLETED","startDate":1428068011131,"endDate":1428068394335,"exitStatus":"COMPLETED","executionId":271,"jobInstance":{"instanceId":271,"name":"cohortAnalysisJob"}},{"status":"COMPLETED","startDate":1428067349879,"endDate":1428068513543,"exitStatus":"COMPLETED","executionId":270,"jobInstance":{"instanceId":270,"name":"cohortAnalysisJob"}},{"status":"COMPLETED","startDate":1428067250577,"endDate":1428067263955,"exitStatus":"COMPLETED","executionId":269,"jobInstance":{"instanceId":269,"name":"cohortAnalysisJob"}},{"status":"STARTED","startDate":1428013952929,"endDate":null,"exitStatus":"UNKNOWN","executionId":268,"jobInstance":{"instanceId":268,"name":"cohortAnalysisJob"}},{"status":"COMPLETED","startDate":1428011587752,"endDate":1428011591898,"exitStatus":"COMPLETED","executionId":267,"jobInstance":{"instanceId":267,"name":"cohortAnalysisJob"}},{"status":"COMPLETED","startDate":1428000821732,"endDate":1428000835177,"exitStatus":"COMPLETED","executionId":266,"jobInstance":{"instanceId":266,"name":"cohortAnalysisJob"}},{"status":"COMPLETED","startDate":1427979766116,"endDate":1427979777240,"exitStatus":"COMPLETED","executionId":265,"jobInstance":{"instanceId":265,"name":"cohortAnalysisJob"}},{"status":"COMPLETED","startDate":1427917129125,"endDate":1427917148393,"exitStatus":"COMPLETED","executionId":264,"jobInstance":{"instanceId":264,"name":"cohortAnalysisJob"}}],"sort":null,"first":true,"last":false,"numberOfElements":10}
function load(){
	
	clear();
//	tblJobExecutions.clear();
//	$('#tblJobExecutions').empty();
		$.when(/* js.getJobNames(), */js.getJobExecutions()).done(function(/* jobNames, */ jobExecutions) {
			// when 1 param, just jobExecutions object = use
			// jobExecutions.content
			// when 2 param, [3] object, status, object = use
			// jobExecutions[0].content

/*
 * var tblJobNames = $('#jobNames').dataTable( { data: jobNames[0], columns: [ {
 * "data": "" } ] } );
 */
		    console.log(jobExecutions);
		    var tblJobExecutions = $('#jobExecutions').dataTable( {
				data: jobExecutions/* [0] */.content,
		        columns: [
 					{"data": "jobInstance.instanceId"},
		            { "data": "jobInstance.name"},
		            { "data": "executionId"},
		            { "data": "status" },
		            { "data": "startDate"},
		            { "data": "endDate"},
		            { "data": "jobParameters"},
		        ],
		        "columnDefs": [
		                       {
		                           // The `data` parameter refers to the data
									// for the cell (defined by the
		                           // `data` option, which defaults to the
									// column being worked with, in
		                           // this case `data: 0`.
		                           "render": function ( data, type, row ) {
		                        	   var d = '';
		                        	   if(data != null){
		                        		   d = new Date(data);
		                        	   }
		                               return d;
		                           },
		                           "targets": [4,5]
		                       },
		                       {
		                           "render": function ( data, type, row ) {
		                        	   var keys = Object.keys( data );
		                        	   var displayVal = '';
		                        	   for (var i in keys) {
		                        		   var dataValue = data[keys[i]];
		                        		   if("time" == keys[i]){
		                        			   // dataValue = new
												// Date(dataValue);
		                        			   // ignore for now
		                        		   }else{
		                        			   displayVal+='<div>'+keys[i]+':'+dataValue+'</div>';
		                        		   }
		                        	   }
		                               return displayVal;
		                           },
		                           "targets": [6]
		                       },
		                       {
		                           "render": function ( data, type, row ) {
		                        	   return data + ' (' + row.jobInstance.instanceId + ')';
		                           },
		                           "targets": [1]
		                       },
		                       { "visible": false,  "targets": [ 0 ] }
		                   ],
		          order: [ 4, "desc" ],
		    } );
		    console.log(tblJobExecutions);
			});
	    
		
}
// setInterval( function () {
// table.ajax.reload( null, false ); // user paging is not reset on reload
// }, 30000 );
	} );
});
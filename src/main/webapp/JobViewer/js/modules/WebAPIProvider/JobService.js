define(function (require, exports) {

	var $ = require('jquery');
	var config = require('appConfig');
	
	function pruneJSON(key, value) {
		if (value === 0 || value) {
			return value;
		} else {
			return
		}
	}
	
	function getJobNames() {
		var promise = $.ajax({
			url: config.webAPIRoot + 'job'
		});
		return promise;
	}
	
	function getJobExecutions() {
		var promise = $.ajax({
			url: config.webAPIRoot + 'job/execution?comprehensivePage=true'
		});
		return promise;
	}
	
	var api = {
			getJobNames: getJobNames,
			getJobExecutions: getJobExecutions
	}

	return api;
});
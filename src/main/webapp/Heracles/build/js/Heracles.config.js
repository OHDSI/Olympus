// modify these variables for your installation
// set this to true if you're running Olympus; otherwise set the default services you wish to use
var olympus_enabled = false;
var default_services = [

    {
        name: 'Public',
        url: 'http://api.ohdsi.org:80/WebAPI/'
    },
    {
        name: 'Local',
        url: 'http://localhost:8080/WebAPI/'
    }
];



// shouldn't need to modify below here
var current_ohdsi_service;
var ohdsi_services = [];
var current_sources = [];

if (olympus_enabled) {
    (function($) {
        $.ajax({
            type: "GET",
            url: "http://localhost:20000/webapi",
            async: false,//synch requests trigger 'Synchronous XMLHttpRequest on the main thread is deprecated'. A better way?
            success: function (data) {
                console.log(data);
                ohdsi_services = data;
                getSources();
            },
            error: function () {
                console.log('unable to load services from Olympus; using defaults');
                ohdsi_services = default_services;
                getSources();
            }
        });
    })(jQuery);
} else {
    ohdsi_services = default_services;
    getSources();
}



// functions to get common parameters

function getWebApiUrl(source) {
    if (!current_ohdsi_service) {
        current_ohdsi_service = ohdsi_services[0];
    }
    if (source && source) {
        return current_ohdsi_service.url + source.sourceKey + "/";
    } else {
        return current_ohdsi_service.url;
    }

}

function getSources(refresh, callback) {
    if (refresh || !current_sources || current_sources.length === 0) {
        $.ajax({
            type: "GET",
            url: getWebApiUrl() + 'source/sources',
            success: function (data) {
                console.log('successfully reloaded sources');
                current_sources = data;
                if (callback) {
                    callback(current_sources);
                }
            },
            error: function () {
                console.log('unable to load sources');
                current_sources = [];
            }
        });
    }
    return current_sources;
}

function getWebApiName() {
    if (!current_ohdsi_service) {
        current_ohdsi_service = ohdsi_services[0];
    }
    return current_ohdsi_service.name;
}

/**
 * This is from the DOM, if you have access to Angular scope,
 * you may prefer to get it from there as it may have not yet been written to the DOM
 * @returns {*|jQuery}
 */
function getSourceKey() {
	return $('#selectedSourceKey').val();
}

function getSourceSpecificWebApiUrl() {
	return getWebApiUrl() + getSourceKey() + "/";
}

/**
 * Sets the selected web api
 * 
 * @param idx The index of the ohdsi_services array
 */
function setSelectedWebApiUrl(idx) {
    if (!ohdsi_services[idx]) {
        current_ohdsi_service = ohdsi_services[0];
    } else {
        current_ohdsi_service = ohdsi_services[idx];
    }
    console.log('webapi reset to ' + current_ohdsi_service.name);
    getSources(true);
}

function getAllOhdsiServices() {
    return ohdsi_services;
}

function urlParam(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
        return null;
    }
    else{
        return results[1] || 0;
    }
}

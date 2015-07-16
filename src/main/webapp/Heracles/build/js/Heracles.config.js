// modify these variables for your installation
// set this to true if you're running Olympus; otherwise set the default services you wish to use
var olympus_enabled = false;
var default_services = [
    {
        name: 'Local',
        url: 'http://localhost:8080/WebAPI/'
    },
    {
        name: 'Public',
        url: 'http://api.ohdsi.org:80/WebAPI/'
    }
];



// shouldn't need to modify below here
var current_ohdsi_service;
var ohdsi_services;

if (olympus_enabled) {
    (function($) {
        $.ajax({
            type: "GET",
            url: "http://localhost:20000/webapi",
            async: false,//synch requests trigger 'Synchronous XMLHttpRequest on the main thread is deprecated'. A better way?
            success: function (data) {
                console.log(data);
                ohdsi_services = data;
            },
            error: function () {
                console.log('unable to load services from Olympus; using defaults');
                ohdsi_services = default_services;
            }
        });
    })(jQuery);
} else {
    ohdsi_services = default_services;
}

// functions to get common parameters

function getWebApiUrl() {
    if (!current_ohdsi_service) {
        current_ohdsi_service = ohdsi_services[0];
    }
    return current_ohdsi_service.url;
}

function getWebApiName() {
    if (!current_ohdsi_service) {
        current_ohdsi_service = ohdsi_services[0];
    }
    return current_ohdsi_service.name;
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
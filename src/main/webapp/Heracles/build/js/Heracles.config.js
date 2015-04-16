var current_ohdsi_service;
var ohdsi_services = [
    {
        name: 'Local',    
        url: 'http://localhost:20000/WebAPI'
    },
    //{
    //    name: 'Public',
    //    url: 'http://api.ohdsi.org:2241/WebAPI'
    //},
    {
        name: 'Public',
        url: 'http://api.ohdsi.org:80/WebAPI'
    }
];

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
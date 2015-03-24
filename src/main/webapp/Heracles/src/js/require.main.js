/**
 * Created by cahilton on 2/4/15.
 */
require.config({
    baseUrl: "src/js",
    shim : {
        'angular' : {'exports' : 'angular'},
        "bootstrap" : { "deps" :['jquery'] },
        "handlebars" : { "deps" :['jquery'] },
        "typeahead" : { "deps" :['jquery'] },
        "heracles-d3" : { "deps" : ['jquery', 'd3']},
        "jasny" : {"deps" : ['jquery', 'bootstrap']},
        "ohdsi_common" : {"deps" : ['d3', 'lodash']},
        "heracles-common" : {"deps" : ['jquery']}

    },
    paths: {
        jquery: '../../lib/jquery/jquery',
        angular: '../../lib/angular/angular',
        bootstrap: '../../lib/bootstrap/bootstrap',
        jasny : '../../lib/jasny-bootstrap/js/jasny-bootstrap.min',
        d3: '../../lib/d3/d3',
        handlebars: '../../lib/handlebars/handlebars',
        'jquery-ui': '../../lib/jquery-ui/jquery-ui',
        requirejs: '../../lib/requirejs/require',
        typeahead: '../../lib/typeahead.js/typeahead.bundle',
        'domReady':'../../lib/requirejs/plugins/domReady',
        'lodash' : '../../lib/lodash/lodash',
        'monster' : '../../lib/cookie-monster/cookie-monster',
        'd3_tip': '../../lib/d3/d3.tip',
        'heracles-d3' : 'heracles-d3',
        'd3.chart' : '../../lib/d3/d3.chart',
        'jnj_chart' : '../../lib/ohdsi/jnj.chart',
        'ohdsi_common' : '../../lib/ohdsi/common',
        'heracles_common' : 'heracles-common',
        "datatables": "../../lib/datatables/jquery.datatables",
        "datatables-colvis": "../../lib/datatables/jquery.datatables.colvis.min",
        "colorbrewer" : "../../lib/colorbrewer/colorbrewer"
    },
    priority: [
        "angular"
    ]
});



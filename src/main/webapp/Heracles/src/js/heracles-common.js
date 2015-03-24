

require(['domReady!', 'jquery', 'bootstrap'], function (domReady, $, b) {

    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null){
            return null;
        }
        else{
            return results[1] || 0;
        }
    };

    $(domReady).ready(function () {

        // initialize bootstrap data toggle
        $("body").tooltip({selector: '[data-toggle=tooltip]'});

    });
});

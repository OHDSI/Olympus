

require(['domReady!', 'jquery', 'bootstrap'], function (domReady, $, b) {



    $(domReady).ready(function () {

        // initialize bootstrap data toggle
        $("body").tooltip({selector: '[data-toggle=tooltip]'});

    });
});

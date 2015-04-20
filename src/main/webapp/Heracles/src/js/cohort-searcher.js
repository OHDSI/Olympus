
require(['domReady!', 'jquery', 'typeahead', 'handlebars', 'angular', 'monster', 'lodash'], function (domReady, $, t, Handlebars, angular, monster, _) {

    function getUrlParameter(sParam)
    {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++)
        {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam)
            {
                return sParameterName[1];
            }
        }
    }

    $(domReady).ready(function () {

        function getBloodhound() {

            var cohortDefUrl = getWebApiUrl() + 'cohortdefinition';
            //var cohortDefUrl = 'src/data/sample-cohorts.json';

            // initialize the cohort type ahead, constructs the suggestion engine
            var bloodhoundCohorts = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                // if we get to have a lot of cohorts, prefetch may not work, and we'll have to use remote
                prefetch: cohortDefUrl
            });

            return bloodhoundCohorts;
        }

        function initTypeahead(bloodhoundCohorts, destroy) {
            if (destroy) {
                $('.heracles-typeahead .typeahead').typeahead('destroy');
            }
            $('.heracles-typeahead .typeahead').typeahead({
                hint: true,
                highlight: true,
                minLength: 1
            }, {
                name: 'cohorts',
                displayKey: 'value',
                source: bloodhoundCohorts.ttAdapter(),
                templates: {
                    empty: [
                        '<div class="empty-message">',
                        'Unable to find any cohorts that match the current query',
                        '</div>'
                    ].join('\n'),
                    suggestion: Handlebars.compile('<p><strong>{{name}}</strong> – {{description}}</p>')
                }
            });
        }

        var refresh = true;

        // use last autocompleter val
        var lastWebApi = monster.get('last-webapi');
        if (lastWebApi) {
            setSelectedWebApiUrl(+lastWebApi);
            refresh = true;
        }

        // refresh cache if needs it
        var lastRefreshed = monster.get('last-refreshed');
        if (lastRefreshed) {
            var now = _.now();
            // don't refresh more than once every 30s
            if (+lastRefreshed + 30000 >= now) {
                refresh = false;
            }
        }

        var bloodhoundCohorts = getBloodhound();

        if (refresh) {
            bloodhoundCohorts.clearPrefetchCache();
            bloodhoundCohorts.initialize(true);
            monster.set('last-refreshed', _.now());
        } else {
            bloodhoundCohorts.initialize();
        }


        // typeahead cohort listener
        initTypeahead(bloodhoundCohorts, false);

        // on select a cohort
        $("#cohorts-typeahead").bind('typeahead:selected', function (obj, datum, name) {
            $("#cohorts").val(datum.name);

            $(".page-one").slideUp("fast", function () {
                // set page data
                angular.element($('#cohort-explorer-main')).scope().showCohort(datum);


                // show div
                $("#cohort-explorer-main").slideDown("slow");
            });

        });

        // setup webapi selector
        setTimeout(function() {
            $(".webpai-dropdown").empty();
            var currentWebApi = getWebApiUrl();
            $.each(getAllOhdsiServices(), function(i) {
                var li = $('<li/>');
                var a = $('<label style="cursor: pointer" />');

                a.html(this.name + '<br/> <small>' + this.url + '</small>')
                    .addClass('webApiLinks')
                    .css('font-weight', this.url === currentWebApi ? 'bold' : 'normal')
                    .attr('webApiIdx', i)
                    .appendTo(li);
                li
                    .addClass('webApiLi')
                    .attr('webApiIdx', i)
                    .click(function() {
                        $(".webApiLinks").css('font-weight', 'normal');
                        setSelectedWebApiUrl(+$(this).attr('webApiIdx'));
                        $(this).find('.webApiLinks').css('font-weight', 'bold');

                        // reset autocompleter
                        bloodhoundCohorts = getBloodhound();
                        bloodhoundCohorts.initialize();
                        initTypeahead(bloodhoundCohorts, true);
                        monster.set('last-webapi', +$(this).attr('webApiIdx'));
                        monster.set('last-refreshed', _.now());
                        $("#cohorts").focus();
                    })
                    .appendTo($(".webpai-dropdown"));

            });
        }, 150);
    });
});
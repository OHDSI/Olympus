
require(['domReady!', 'jquery', 'typeahead', 'handlebars', 'angular', 'monster', 'lodash', 'bootstrap-select'],
    function (domReady, $, t, Handlebars, angular, monster, _, SelectPicker) {


    $(domReady).ready(function () {

        function customTokenizer(datum) {
            var nameTokens = Bloodhound.tokenizers.nonword(datum.name);
            var descTokens = Bloodhound.tokenizers.nonword(datum.description);

            return nameTokens.concat(descTokens);
        }

        function getBloodhound() {

            var cohortDefUrl = getWebApiUrl() + 'cohortdefinition';
            //var cohortDefUrl = 'src/data/sample-cohorts.json';

            // initialize the cohort type ahead, constructs the suggestion engine
            var bloodhoundCohorts = new Bloodhound({
                datumTokenizer: customTokenizer, //Bloodhound.tokenizers.obj.nonword('name'),
                queryTokenizer: Bloodhound.tokenizers.nonword,
                // if we get to have a lot of cohorts, prefetch may not work, and we'll have to use remote
                prefetch: cohortDefUrl,
                pending: "Loading results from " + getWebApiName(),
                limit: 50
            });

            return bloodhoundCohorts;
        }

        function initTypeahead(bloodhoundCohorts, destroy) {
            if (destroy) {
                $('.heracles-typeahead .typeahead').typeahead('destroy');
            }
            $('.heracles-typeahead .typeahead').typeahead({
                hint: false,
                highlight: true,
                minLength: 0
            }, {
                name: 'cohorts',
                displayKey: 'name',
                source: bloodhoundCohorts.ttAdapter(),
                pending: "Loading results from " + getWebApiName(),
                templates: {
                    //empty: [
                    //    '<div class="empty-message">',
                    //    'Unable to find any cohorts that match the current query',
                    //    '</div>'
                    //].join('\n'),
                    suggestion: Handlebars.compile('<p><span style="font-weight: bold">{{name}}</span> – {{description}}</p>')
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
                getSources(true, function(sources) {
                    angular.element($('#cohort-explorer-main')).scope().showCohort(datum, sources);
                });



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
                        //setTimeout(function() {
                        //    // give time for prefetch to load
                        //    $("#cohorts").focus();
                        //}, 500);

                    })
                    .appendTo($(".webpai-dropdown"));

            });
        }, 150);
    });
});
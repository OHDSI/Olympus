// configure angular
require(['angular', 'jquery', 'bootstrap', 'heracles-d3', 'jasny', 'heracles_common', 'monster',
        '../js/charts/dashboard', '../js/charts/person', '../js/charts/conditions', '../js/charts/drugExposures',
        '../js/charts/conditionEras', '../js/charts/drugEras', '../js/charts/cohortSpecific',
        '../js/charts/observations', '../js/charts/observationPeriod', '../js/charts/dataDensity',
        '../js/charts/death', '../js/charts/procedures', '../js/charts/visits', '../js/charts/measurements',
        '../js/charts/heraclesHeel'],
    function (angular, $, b, HeraclesD3, j, heraclesCommon, monster,
              DashboardRenderer, PersonRenderer, ConditionRenderer, DrugExposureRenderer,
              ConditionErasRenderer, DrugErasRenderer, CohortSpecificRenderer,
              ObservationsRenderer, ObservationPeriodRenderer, DataDensityRenderer,
              DeathDataRenderer, ProceduresRenderer, VisitsRenderer, MeasurementsRenderer,
              HeraclesHeelRenderer) {
        var renderers = {
            'dashboard' : DashboardRenderer,
            'person' : PersonRenderer,
            'condition' : ConditionRenderer,
            'drugExposures' : DrugExposureRenderer,
            'conditionEras' : ConditionErasRenderer,
            'drugEras' : DrugErasRenderer,
            'cohortSpecific' : CohortSpecificRenderer,
            'observations' : ObservationsRenderer,
            'observationPeriods' : ObservationPeriodRenderer,
            'dataDensity' : DataDensityRenderer,
            'death' : DeathDataRenderer,
            'procedures' : ProceduresRenderer,
            'visits' : VisitsRenderer,
            'measurements' : MeasurementsRenderer,
            'heraclesHeel' : HeraclesHeelRenderer
        };
        angular.element().ready(function() {
            // setup angular controller on angular ready
            var app = angular.module('HeraclesResults', []);
            app.service('CohortService', function() {
                this.cohort = {};

                this.setCohort = function(c) {
                    this.cohort = c;
                };
                this.getCohort = function() {
                    return this.cohort;
                };
            });

            app.controller('CohortViewerCtrl', function($scope, $http, CohortService) {

                $scope.defaultSummary = {
                    sourceName : "",
                    numPersons : 0
                };

                $scope.summary = $scope.defaultSummary;

                $scope.refreshCommonData = function(){
                    if ($scope.active === "dashboard" || $scope.active === "person") {
                        $.getJSON(getWebApiUrl() + "cohortresults/" + $scope.cohort.id + "/raw/person/population", function (data) {
                            var summary = {};
                            $.each(data, function () {
                                if (this.ATTRIBUTE_NAME.toLowerCase() === "source name") {
                                    summary.sourceName = this.ATTRIBUTE_VALUE;
                                } else if (this.ATTRIBUTE_NAME.toLowerCase() === "number of persons") {
                                    summary.numPersons = (this.ATTRIBUTE_VALUE).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                }
                            });
                            $scope.summary = summary;
                            $scope.$apply();
                        });
                    } else {
                        $scope.summary = $scope.defaultSummary;
                        $scope.$apply();
                    }
                };

                $scope.refreshCohortVisualization = function(evt) {
                    // TODO
                };
                
                $scope.goBack = function (evt) {
                    $("#viewer-container").slideUp("fast", function () {
                        $("#searcher-container").slideDown('fast', function () {
                            $("#cohorts")
                                .val("")
                                .focus();
                        });
                    });
                };

                $scope.setupAndDisplayCohort = function(datum, animate) {
                    function doIt() {
                        // show default div

                        $("#dashboard").trigger("click");
                    }

                    $("#cohorts").val(datum.name);
                    $scope.cohort = datum;
                    //console.log(datum);
                    CohortService.setCohort(datum);

                    if (animate) {
                        $("#searcher-container").slideUp("fast", function () {
                            doIt();
                            $("#viewer-container").slideDown("slow");
                        });
                    } else {
                        $("#searcher-container").hide();
                        doIt();
                        $("#viewer-container").show();

                    }

                };

                $scope.renderVisualizationSection = function(id) {
                    $("#chart-container").hide();
                    $scope.active = id;
                    $scope.template = 'src/templates/' + id + '.html';
                    $scope.refreshCommonData();

                    var renderer = renderers[id];
                    if (renderer) {
                        renderer.render(CohortService.getCohort());
                    }
                    $("#chart-container").show();
                };

                // include other scripts
                require(['cohort-searcher']);

                $(".chartTypes").click(function () {
                    var self = $(this);
                    $(".active").removeClass("active");
                    self.parent("li").addClass("active");

                    var id = $(this).attr("id");
                    $scope.renderVisualizationSection(id);

                });

                $("#cohorts-viewer-typeahead").bind('typeahead:selected', function (obj, datum, name) {
                   $scope.setupAndDisplayCohort(datum, true);
                });

                $(document).ready(function() {

                    function doDefault() {
                        setTimeout(function () {
                            $("#cohorts").focus();
                        }, 300);
                    }

                    var param = $.urlParam('cohortId');
                    if (param && param !== '') {
                        var lastWebApi = monster.get('last-webapi');
                        if (lastWebApi) {
                            setSelectedWebApiUrl(+lastWebApi);
                        }
                        $http.get(getWebApiUrl() + 'cohortdefinition/' + param).
                            success(function(data, status, headers, config) {
                                if (data) {
                                    $scope.setupAndDisplayCohort(data, false);
                                }
                            }).
                            error(function(data, status, headers, config) {
                                console.log("unable to retrieve cohort");
                                doDefault();
                            });
                    } else {
                        doDefault();
                    }

                });
            });

            // manually boostrap angular since using amd
            angular.bootstrap(document, ['HeraclesResults']);

        });


    }
);

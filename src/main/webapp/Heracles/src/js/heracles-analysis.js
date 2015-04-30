// configure angular
require(['angular', 'jquery', 'bootstrap', 'heracles-d3', 'jasny', 'heracles_common', 'lodash', 'monster'], function (angular, $, b, HeraclesD3, j, heraclesCommon, _, monster) {
        angular.element().ready(function() {
            // setup angular controller on angular ready
            angular.module('HeraclesAnalysis', []).controller('CohortExplorerCtrl', function($scope, $http) {

                $scope.selectedJob = {};
                $scope.vizPack = {};
                $scope.job = {};
                $scope.message = {};
                $scope.selectJobMessage = "";
                $scope.visualizationPacks = {
                    "Care Site" : [1200, 1201],
                    "Location" : [1100, 1101],
                    "Default" : [1, 2 ,101, 108, 110],
                    "Drug Exposure" : [700, 701, 706, 715, 705, 704, 116, 702, 117, 717, 716, 1],
                    "Condition" : [116, 117, 400, 401, 402, 404, 405, 406, 1],
                    "Drug Era" : [900, 901, 907, 906, 904, 902, 116, 117, 1],
                    "Condition Era" : [1001, 1000, 1007, 1006, 1004, 1002, 116, 117, 1],
                    "Person" : [0, 1, 2, 3, 4, 5],
                    "Death" : [501, 506, 505, 504, 502, 116, 117],
                    "Data Density" : [117, 220, 420, 502, 620, 720, 820, 920, 1020, 111, 403, 603, 703, 803, 903, 1003],
                    "Observation Periods" : [101, 104, 106, 107, 108, 109, 110, 113, 1],
                    "Observation" : [800, 801, 806, 805, 815, 804, 802, 807, 816, 817, 818, 117, 116, 102, 112, 1],
                    "Procedure" : [606, 604, 116, 602, 117, 605, 600,  601, 1],
                    "Visit" : [202, 203, 206, 204, 116, 117, 211, 200, 201, 1],
                    "Cohort Specific" : [1700, 1800,1801,1802,1803,1804,1805,1806,1807,1808,1809,1810,1811,1812,1813,1814,1815,1816,1817,1818,1819,1820,1821,1830,1831,1840,1841,1850,1851,1860,1861,1870,1871, 116, 117, 1],
                    "Measurement" : [1300, 1301, 1303, 1306, 1305, 1315, 1304, 1316, 1302, 1307, 1317, 1318, 1320, 117, 116, 1],
                    "Heracles Heel" : [
                        7,
                        8,
                        9,
                        114,
                        115,
                        207,
                        208,
                        209,
                        210,
                        302,
                        409,
                        410,
                        411,
                        412,
                        413,
                        509,
                        510,
                        609,
                        610,
                        612,
                        613,
                        709,
                        710,
                        711,
                        712,
                        713,
                        809,
                        810,
                        812,
                        813,
                        814,
                        908,
                        909,
                        910,
                        1008,
                        1009,
                        1010,
                        1415,
                        1500,
                        1501,
                        1600,
                        1601,
                        1701,
                        103,
                        105,
                        206,
                        406,
                        506,
                        606,
                        706,
                        715,
                        716,
                        717,
                        806,
                        906,
                        907,
                        1006,
                        1007,
                        1502,
                        1503,
                        1504,
                        1505,
                        1506,
                        1507,
                        1508,
                        1509,
                        1510,
                        1511,
                        1602,
                        1603,
                        1604,
                        1605,
                        1606,
                        1607,
                        1608,
                        511,
                        512,
                        513,
                        514,
                        515,
                        2,
                        4,
                        5,
                        200,
                        301,
                        400,
                        500,
                        505,
                        600,
                        700,
                        800,
                        900,
                        1000,
                        1609,
                        1610,
                        405,
                        605,
                        705,
                        805,
                        202,
                        3,
                        101,
                        420,
                        620,
                        720,
                        820,
                        920,
                        1020,
                        402,
                        602,
                        702,
                        802,
                        902,
                        1002,
                        1310,
                        1309,
                        1312,
                        1313,
                        1314
                    ]
                };
                $scope.analysisCount = 0;

                $scope.showCohort = function(datum) {
                    $('#spinner-modal').modal('show');
                    $("#run-analysis-container").hide();
                    $scope.analysisCount = 0;
                    $scope.selected = datum;
                    //$http.get('src/data/sample-cohort-explorer.json')
                    var lastWebApi = monster.get('last-webapi');
                    if (lastWebApi) {
                        setSelectedWebApiUrl(+lastWebApi);
                    }
                    $http.get(getWebApiUrl() + "cohortanalysis/" + datum.id + "/summary")
                        .success(function(data, status, headers, config) {
                            $scope.cohort = data;

                            if (data.analyses) {
                                var map = {};
                                $.each(data.analyses, function() {

                                    var prettifyAnalysisType = _.startCase(this.analysisType.toLowerCase());
                                    if (!$scope.cohort.firstAnalysis) {
                                        $scope.cohort.firstAnalysis = prettifyAnalysisType;
                                    }
                                    if (!map[prettifyAnalysisType]) {
                                        map[prettifyAnalysisType] = [];
                                    }
                                    this.class = +this.analysisComplete ? "analysis-complete" : "analysis-open";
                                    map[prettifyAnalysisType].push(this);
                                });
                                $scope.cohort.analysesMap = map;

                            }
                            if ($scope.cohort.meanAge !== null) {
                                $scope.cohort.meanAge = Math.round(+$scope.cohort.meanAge);
                            }
                            /*
                            if ($scope.cohort.ageDistribution !== null && $scope.cohort.ageDistribution.length > 0) {
                                HeraclesD3.showAgeDistribution($scope.cohort.ageDistribution);
                            }
                            if ($scope.cohort.genderDistribution !== null && $scope.cohort.genderDistribution.length > 0) {
                                HeraclesD3.showGenderDistribution($scope.cohort.genderDistribution);
                            }
                            */
                            $("#run-analysis-container").show();
                            HeraclesD3.renderOHDSIDefaults($scope.cohort);

                            $('#spinner-modal').modal('hide');
                        }).error(function(data, status, headers, config) {
                            console.log("failed to load analyses");
                            $("#run-analysis-container").show();
                            $('#spinner-modal').modal('hide');
                        });
                };

                $scope.scrollAnalysesClick = function($event, k) {

                    $('#auto-filter-div').animate({
                         scrollTop: ($('#auto-filter-div').scrollTop() + $(".toggle-parent-label[key='" + k + "']").position().top - $('#auto-filter-div').height()/2 + $(".toggle-parent-label[key='" + k + "']").height()/2)
                        }, 1000);

                };

                $scope.refreshCohort = function($event) {
                    var link = $(event.target);
                    if (link.prop('disabled')) {
                        return;
                    }
                    if ($scope.selected) {
                        link.text("Refreshing...");
                        link.prop('disabled', true);
                        $scope.refreshUI();
                        $scope.showCohort($scope.selected);
                        setTimeout(function() {
                            link.text("Refresh");
                            link.prop('disabled', false);
                        }, 1500);
                    }
                };

                $scope.refreshUI = function() {
                    $("input:checkbox").prop("checked", false);
                    $(".toggle-filter-input").val("");
                    $("#auto-filter-input").val("");
                    $("#auto-filter-div").find("label").show();
                    $scope.analysisCount = 0;
                }

                $scope.selectVizPack = function($event, vizType) {
                    var checked = $(".viz-pack-checkbox[viz-type='" + vizType + "'").is(":checked");

                    var vals = $scope.visualizationPacks[vizType];
                    if (vals) {
                        checkVizPack(vizType, checked, vals);
                    }
                };

                $scope.selectVizPackFancy = function($event, vizType) {
                    var checked = $(".viz-pack-checkbox[viz-type='" + vizType + "'").is(":checked");

                    var vals = $scope.visualizationPacks[vizType];
                    if (vals) {

                        var ran = [];
                        var newJobs = [];
                        if (checked) {

                            $.each(vals, function() {
                                var lastRan = $(".toggle-checkbox-item[analysis-id=" + this + "]").attr('ran');
                                if (lastRan && lastRan !== null && lastRan !== "") {
                                    ran.push(this);
                                } else {
                                    newJobs.push(this);
                                }
                            });

                            if (ran.length === 0) {
                                checkVizPack(vizType, checked, vals);
                            } else {
                                $scope.selectJobMessage = (ran.length  + "  of your requested jobs have been previously run. They should be repeated only if you have reason to believe they were run using a custom configuration. Otherwise, we recommend removing these jobs to reduce your analysis' running time.");

                                $scope.vizPack = {};
                                $scope.vizPack.alreadyRan = ran;
                                $scope.vizPack.newJobs = newJobs;
                                $scope.vizPack.vizType = vizType;
                                $scope.vizPack.checked = checked;
                                $scope.vizPack.vals = vals;
                                $("#alreadyRanJobsModal").modal("show");
                            }

                        } else {
                            checkVizPack(vizType, checked, vals);
                        }
                    }
                };



                function checkVizPack(vizType, checked, vals) {
                    if (vals.length === 0) {
                        // uncheck the label on the left, since nothing is being ran
                        if (checked) {
                            $(".viz-pack-checkbox[viz-type='" + vizType + "'").prop("checked", false);
                        }
                        return;
                    }
                    var first;
                    $.each(vals, function() {
                        if (!first) {
                            first = $(".toggle-checkbox-item[analysis-id=" + this + "]");
                        }
                        $(".toggle-checkbox-item[analysis-id=" + this + "]").prop("checked", checked);
                        if (vizType === "Heracles Heel") {
                            $("#heraclesHeel").prop("checked", checked);
                        }
                        $scope.analysisClick();
                    });
                    if (checked && first) {
                        $('#auto-filter-div').animate({
                            scrollTop: ($('#auto-filter-div').scrollTop() + first.position().top - $('#auto-filter-div').height()/2 + first.height()/2)
                        }, 1000);
                    }
                }

                $scope.runOnlyNewJobs = function() {
                    if ($scope.selectedJob.newJobs) {
                        if ($scope.selectedJob.newJobs.length === 0) {
                            $scope.selectedJob = {};
                            $("#alreadyRanJobsModal").modal("hide");

                            $scope.message.text = "There are no new jobs to run.";
                            $scope.message.label = "Problem submitting analyses";
                            $("#messageModal").modal('show');

                            return;
                        }
                        $scope.sendJob($scope.selectedJob.newJobs);

                        $.each($scope.selectedJob.alreadyRan, function() {
                            $(".toggle-checkbox-item[analysis-id=" + this + "]").prop("checked", false);
                        });

                        $scope.analysisClick();
                    }
                    $scope.selectedJob = {};
                    $("#alreadyRanJobsModal").modal("hide");
                };

                $scope.runAllJobs = function() {
                    if ($scope.selectedJob.jobs) {
                        $scope.sendJob($scope.selectedJob.jobs);
                    }
                    $scope.selectedJob = {};
                    $("#alreadyRanJobsModal").modal("hide");
                };

                $scope.submitJob = function($event) {
                    window.scrollTo(0, 0);
                    
                    if ($(".toggle-checkbox-item:checked").length === 0) {
                        $scope.message.text = "Please select at least one analyis to run.";
                        $scope.message.label = "Problem submitting analyses";
                        $("#messageModal").modal('show');
                        return;
                    }

                    var jobs = [];
                    var ran = [];
                    var newJobs = [];
                    $(".toggle-checkbox-item:checked").each(function () {
                        var analysisId = $(this).attr("analysis-id");
                        jobs.push(analysisId);

                        var lastRan = $(this).attr('ran');
                        if (lastRan && lastRan !== null && lastRan !== "") {
                            ran.push(analysisId);
                        } else {
                            newJobs.push(analysisId);
                        }
                    });
                    if (ran.length > 0) {
                        $scope.selectJobMessage = (ran.length  + "  of your requested jobs have been previously run. They should be repeated only if you have reason to believe they were run using a custom configuration. Otherwise, we recommend removing these jobs to reduce your analysis' running time.");

                        $scope.selectedJob = {};
                        $scope.selectedJob.alreadyRan = ran;
                        $scope.selectedJob.newJobs = newJobs;
                        $scope.selectedJob.jobs = jobs;
                        $("#alreadyRanJobsModal").modal("show");

                        return;
                    }

                    // meets all conditions so ok to submit
                    $scope.sendJob(jobs);
                };


                $scope.sendJob = function(jobs) {
                    // send notice to user
                    var btn = $("#btnSubmitJob");
                    btn.button('loading');
                    var d = new Date(),
                        jobName = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear() + '_' + d.getHours() + d.getMinutes() + '_' + ($scope.cohort.cohortDefinition.name.split(' ').join('_'));
                    $scope.jobName = jobName;
                    $scope.job.job_link = null;
                    $scope.job.label = "Submitting...";
                    $scope.job.message = "Your job, " + jobName + ", is being submitted. Please wait to receive a status update...";
                    if (!$("#jobStatusModal").is(":visible")) {
                        $("#jobStatusModal").modal("show");
                    }

                    // submit job
                    var cohortJob = {};


                    cohortJob.jobName = jobName;
                    cohortJob.smallCellCount = $("#smallCellCount").val();
                    cohortJob.cohortDefinitionIds = [];
                    cohortJob.cohortDefinitionIds.push($scope.cohort.cohortDefinition.id);
                    cohortJob.analysisIds = jobs;
                    cohortJob.runHeraclesHeel = $("#heraclesHeel").is(":checked");
                    cohortJob.cohortPeriodOnly = $("#cohortPeriodOnly").is(":checked");

                    // set concepts
                    cohortJob.conditionConceptIds = [];
                    cohortJob.drugConceptIds = [];
                    cohortJob.procedureConceptIds = [];
                    cohortJob.observationConceptIds = [];
                    cohortJob.measurementConceptIds = [];

                    $(".toggle-filter-input").each(function() {
                        if ($(this).val().trim() !== "") {
                            var key = $(this).attr("toggle-filter");
                            var ary = _.words($(this).val(), /[^, ]+/g);
                            if (ary.length > 0) {
                                cohortJob[(key + "ConceptIds")] = ary;
                            }
                        }
                    });
                    console.log("Submitting to cohort analysis service:");
                    console.log(cohortJob);

                    $http.post(getWebApiUrl() + "cohortanalysis", cohortJob).
                        success(function(data, status, headers, config) {
                            btn.button('reset');
                            showJobResultModal(true, data, status, headers, config);
                        }).
                        error(function(data, status, headers, config) {
                            btn.button('reset');
                            showJobResultModal(false, data, status, headers, config);
                        });
                };

                function showJobResultModal(success, data, status, headers, config) {
                    $scope.job = {};
                    $scope.job.success = success;
                    if (success) {
                       $scope.job.label = "Success";
                       $scope.job.message = "Your job, " + $scope.jobName + ", was submitted successfully!";
                        if (data.jobInstance) {
                            $scope.job.job_link = getWebApiUrl() + "job/" + data.jobInstance.instanceId +
                                "/execution/" + data.executionId;
                        }
                    } else {
                        $scope.job.label = "Failure";
                        $scope.job.message = "Your job failed.";
                    }
                    if (!$("#jobStatusModal").is(":visible")) {
                        $("#jobStatusModal").modal("show");
                    }

                }

                $scope.goBack = function (evt) {
                    $("#cohort-explorer-main").slideUp("fast", function () {
                        $("#header").slideDown('fast', function () {
                            $scope.refreshUI();
                            $("#cohorts")
                                .val("")
                                .focus();
                        });
                    });
                };

                $scope.analysisClick = function() {
                    $scope.analysisCount = $(".toggle-checkbox-item:checked").length;
                };

                $scope.parentAnalysesClick = function($event) {
                    var parent = $(event.currentTarget);
                    var key = parent.attr("key");
                    var checked = parent.find("input:checkbox").prop("checked");
                    $("input[parent='" + key + "']:visible").prop("checked", checked);
                    $scope.analysisClick();
                };

                $(document).ready(function() {
                    var param = $.urlParam('cohortId');
                    if (param && param !== '') {
                        var datum = { id : param };
                        $(".page-one").hide();
                        $scope.showCohort(datum);

                        // show div
                        $("#cohort-explorer-main").show();

                    }
                    else {
                        setTimeout(function () {
                            $("#cohorts").focus();
                        }, 300);
                    }
                });
            });


            // manually boostrap angular since using amd
            angular.bootstrap(document, ['HeraclesAnalysis']);

            // include other scripts
            require(['cohort-searcher', 'auto-filter-box', 'heracles.main']);
        });



    }
);

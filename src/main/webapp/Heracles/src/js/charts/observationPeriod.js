define(["jquery", "bootstrap", "d3","jnj_chart", "ohdsi_common", "datatables", "datatables-colvis", "colorbrewer"],
    function ($, bootstrap, d3, jnj_chart, common, DataTables, DataTablesColvis, colorbrewer) {

        function ObservationPeriodRenderer() {}
        ObservationPeriodRenderer.prototype = {};
        ObservationPeriodRenderer.prototype.constructor = ObservationPeriodRenderer;

        ObservationPeriodRenderer.render = function(cohort) {
            d3.selectAll("svg").remove();

            var id = cohort.id;
            this.baseUrl = getSourceSpecificWebApiUrl() + 'cohortresults/' + id;
            $('#loading-text').text("Querying Database...");
            $('#spinner-modal').modal('show');


            $.ajax({
                type: "GET",
                url: ObservationPeriodRenderer.baseUrl + "/observationperiod",
                contentType: "application/json; charset=utf-8"
            }).done(function (result) {
                $('#loading-text').text("Rendering Visualizations...");
                // age by gender
                var ageByGenderData = common.normalizeArray(result.ageByGender);
                if (!ageByGenderData.empty) {
                    var agegenderboxplot = new jnj_chart.boxplot();
                    var agData = ageByGenderData.category
                        .map(function (d, i) {
                            var item = {
                                Category: this[i].category,
                                min: this[i].minValue,
                                LIF: this[i].p10Value,
                                q1: this[i].p25Value,
                                median: this[i].medianValue,
                                q3: this[i].p75Value,
                                UIF: this[i].p90Value,
                                max: this[i].maxValue
                            };
                            return item;
                        }, result.ageByGender);
                    agegenderboxplot.render(agData, "#agebygender", 235, 210, {
                        xLabel: "Gender",
                        yLabel: "Age"
                    });
                }
                common.generateCSVDownload($("#agebygender"), result.ageByGender, "agebygender");

                // age at first obs
                var ageAtFirstData = common.normalizeArray(result.ageAtFirst);
                if (!ageAtFirstData.empty) {
                    var histData = {};
                    histData.intervalSize = 1;
                    histData.min = d3.min(ageAtFirstData.countValue);
                    histData.max = d3.max(ageAtFirstData.countValue);
                    histData.intervals = 120;
                    histData.data = ageAtFirstData;
                    d3.selectAll("#ageatfirstobservation svg").remove();
                    var ageAtFirstObservationData = common.mapHistogram(histData);
                    var ageAtFirstObservationHistogram = new jnj_chart.histogram();
                    ageAtFirstObservationHistogram.render(ageAtFirstObservationData, "#ageatfirstobservation", 460, 195, {
                        xFormat: d3.format('d'),
                        xLabel: 'Age',
                        yLabel: 'People'
                    });
                }
                common.generateCSVDownload($("#ageatfirstobservation"), result.ageAtFirst, "ageatfirstobservation");

                // observation length
                if (result.observationLength && result.observationLength.length > 0 && result.observationLengthStats) {
                    var histData2 = {};
                    histData2.data = (common.normalizeArray(result.observationLength));
                    histData2.intervalSize = +result.observationLengthStats[0].intervalSize;
                    histData2.min = +result.observationLengthStats[0].minValue;
                    histData2.max = +result.observationLengthStats[0].maxValue;
                    histData2.intervals = Math.round((histData2.max - histData2.min + 1) / histData2.intervalSize) + histData2.intervalSize ;
                    d3.selectAll("#observationlength svg").remove();
                    if (!histData2.data.empty) {
                        var observationLengthData = common.mapHistogram(histData2);
                        var observationLengthXLabel = 'Days';
                        if (observationLengthData.length > 0) {
                            if (observationLengthData[observationLengthData.length - 1].x - observationLengthData[0].x > 1000) {
                                observationLengthData.forEach(function (d) {
                                    d.x = d.x / 365.25;
                                    d.dx = d.dx / 365.25;
                                });
                                observationLengthXLabel = 'Years';
                            }
                        }
                        var observationLengthHistogram = new jnj_chart.histogram();
                        observationLengthHistogram.render(observationLengthData, "#observationlength", 460, 195, {
                            xLabel: observationLengthXLabel,
                            yLabel: 'People'
                        });
                    }
                }
                common.generateCSVDownload($("#observationlength"), result.observationLength, "observationlength");

                // cumulative observation
                d3.selectAll("#cumulativeobservation svg").remove();
                var cumObsData = common.normalizeArray((result.cumulativeObservation));
                if (!cumObsData.empty) {
                    var cumulativeObservationLine = new jnj_chart.line();
                    var cumulativeData = common.normalizeDataframe(cumObsData).xLengthOfObservation
                        .map(function (d, i) {
                            var item = {
                                xValue: this.xLengthOfObservation[i],
                                yValue: this.yPercentPersons[i]
                            };
                            return item;
                        }, cumObsData);

                    var cumulativeObservationXLabel = 'Days';
                    if (cumulativeData.length > 0) {
                        if (cumulativeData.slice(-1)[0].xValue - cumulativeData[0].xValue > 1000) {
                            // convert x data to years
                            cumulativeData.forEach(function (d) {
                                d.xValue = d.xValue / 365.25;
                            });
                            cumulativeObservationXLabel = 'Years';
                        }
                    }

                    cumulativeObservationLine.render(cumulativeData, "#cumulativeobservation", 450, 260, {
                        yFormat: d3.format('0%'),
                        interpolate: "step-before",
                        xLabel: cumulativeObservationXLabel,
                        yLabel: 'Percent of Population'
                    });
                }
                common.generateCSVDownload($("#cumulativeobservation"), result.cumulativeObservation, "cumulativeobservation");

                // observation period length by gender
                var obsPeriodByGenderData = common.normalizeArray(result.durationByGender);
                if (!obsPeriodByGenderData.empty) {
                    d3.selectAll("#opbygender svg").remove();
                    var opbygenderboxplot = new jnj_chart.boxplot();
                    var opgData = obsPeriodByGenderData.category
                        .map(function (d, i) {
                            var item = {
                                Category: this.category[i],
                                min: this.minValue[i],
                                LIF: this.p10Value[i],
                                q1: this.p25Value[i],
                                median: this.medianValue[i],
                                q3: this.p75Value[i],
                                UIF: this.p90Value[i],
                                max: this.maxValue[i]
                            };
                            return item;
                        }, obsPeriodByGenderData);

                    var opgDataYlabel = 'Days';
                    var opgDataMinY = d3.min(opgData, function (d) {
                        return d.min;
                    });
                    var opgDataMaxY = d3.max(opgData, function (d) {
                        return d.max;
                    });
                    if ((opgDataMaxY - opgDataMinY) > 1000) {
                        opgData.forEach(function (d) {
                            d.min = d.min / 365.25;
                            d.LIF = d.LIF / 365.25;
                            d.q1 = d.q1 / 365.25;
                            d.median = d.median / 365.25;
                            d.q3 = d.q3 / 365.25;
                            d.UIF = d.UIF / 365.25;
                            d.max = d.max / 365.25;
                        });
                        opgDataYlabel = 'Years';
                    }

                    opbygenderboxplot.render(opgData, "#opbygender", 235, 210, {
                        xLabel: 'Gender',
                        yLabel: opgDataYlabel
                    });
                }
                common.generateCSVDownload($("#opbygender"), result.durationByGender, "durationByGender");

                // observation period length by age
                d3.selectAll("#opbyage svg").remove();
                var obsPeriodByLenByAgeData = common.normalizeArray(result.durationByAgeDecile);
                if (!obsPeriodByLenByAgeData.empty) {
                    var opbyageboxplot = new jnj_chart.boxplot();
                    var opaData = obsPeriodByLenByAgeData.category
                        .map(function (d, i) {
                            var item = {
                                Category: this.category[i],
                                min: this.minValue[i],
                                LIF: this.p10Value[i],
                                q1: this.p25Value[i],
                                median: this.medianValue[i],
                                q3: this.p75Value[i],
                                UIF: this.p90Value[i],
                                max: this.maxValue[i]
                            };
                            return item;
                        }, obsPeriodByLenByAgeData);

                    var opaDataYlabel = 'Days';
                    var opaDataMinY = d3.min(opaData, function (d) {
                        return d.min;
                    });
                    var opaDataMaxY = d3.max(opaData, function (d) {
                        return d.max;
                    });
                    if ((opaDataMaxY - opaDataMinY) > 1000) {
                        opaData.forEach(function (d) {
                            d.min = d.min / 365.25;
                            d.LIF = d.LIF / 365.25;
                            d.q1 = d.q1 / 365.25;
                            d.median = d.median / 365.25;
                            d.q3 = d.q3 / 365.25;
                            d.UIF = d.UIF / 365.25;
                            d.max = d.max / 365.25;
                        });
                        opaDataYlabel = 'Years';
                    }

                    opbyageboxplot.render(opaData, "#opbyage", 450, 260, {
                        xLabel: 'Age Decile',
                        yLabel: opaDataYlabel
                    });
                }
                common.generateCSVDownload($("#opbyage"), result.durationByAgeDecile, "durationByAgeDecile");

                // observed by year
                var obsByYearData = common.normalizeArray(result.personsWithContinuousObservationsByYear);
                if (!obsByYearData.empty && result.personsWithContinuousObservationsByYearStats) {
                    var histData3 = {};
                    histData3.data = obsByYearData;
                    histData3.intervalSize = +result.personsWithContinuousObservationsByYearStats[0].intervalSize;
                    histData3.min = +result.personsWithContinuousObservationsByYearStats[0].minValue;
                    histData3.max = +result.personsWithContinuousObservationsByYearStats[0].maxValue;
                    histData3.intervals = Math.round((histData3.max - histData3.min + histData3.intervalSize) / histData3.intervalSize) + histData3.intervalSize ;
                    d3.selectAll("#oppeoplebyyear svg").remove();
                    var observationLengthByYearHistogram = new jnj_chart.histogram();
                    observationLengthByYearHistogram.render(common.mapHistogram(histData3), "#oppeoplebyyear", 460, 195, {
                        xFormat: d3.format('d'),
                        xLabel: 'Year',
                        yLabel: 'People'
                    });
                }
                common.generateCSVDownload($("#oppeoplebyyear"), result.personsWithContinuousObservationsByYear, "personsWithContinuousObservationsByYear");

                // observed by month
                var obsByMonthData = common.normalizeArray(result.observedByMonth);
                if (!obsByMonthData.empty) {
                    var byMonthSeries = common.mapMonthYearDataToSeries(obsByMonthData, {
                        dateField: 'monthYear',
                        yValue: 'countValue',
                        yPercent: 'percentValue'
                    });
                    d3.selectAll("#oppeoplebymonthsingle svg").remove();
                    var observationByMonthSingle = new jnj_chart.line();
                    observationByMonthSingle.render(byMonthSeries, "#oppeoplebymonthsingle", 900, 250, {
                        xScale: d3.time.scale().domain(d3.extent(byMonthSeries[0].values, function (d) {
                            return d.xValue;
                        })),
                        xFormat: d3.time.format("%m/%Y"),
                        tickFormat: d3.time.format("%Y"),
                        ticks: 10,
                        xLabel: "Date",
                        yLabel: "People"
                    });
                }
                common.generateCSVDownload($("#oppeoplebymonthsingle"), result.observedByMonth, "observedByMonth");

                // obs period per person
                var personPeriodData = common.normalizeArray(result.observationPeriodsPerPerson);
                if (!personPeriodData.empty) {
                    d3.selectAll("#opperperson svg").remove();
                    var donut = new jnj_chart.donut();
                    donut.render(common.mapConceptData(result.observationPeriodsPerPerson), "#opperperson", 255, 230, {
                        margin: {
                            top: 5,
                            bottom: 10,
                            right: 50,
                            left: 10
                        }
                    });
                }
                common.generateCSVDownload($("#opperperson"), result.observationPeriodsPerPerson, "observationPeriodsPerPerson");
                $('#spinner-modal').modal('hide');
            }).error(function (result) {
                $('#spinner-modal').modal('hide');
            });

        };

        return ObservationPeriodRenderer;
    });

define(["d3","jnj_chart", "ohdsi_common"], function (d3, jnj_chart, common) {

    function CohortSpecificRenderer() {}
    CohortSpecificRenderer.prototype = {};
    CohortSpecificRenderer.prototype.constructor = CohortSpecificRenderer;

    CohortSpecificRenderer.render = function(cohort) {
        var id = cohort.id;
        this.baseUrl = getWebApiUrl() + 'cohortresults/' + id;
        d3.selectAll("svg").remove();

        $('#loading-text').text("Querying Database...");
        $('#spinner-modal').modal('show');
        $.getJSON(this.baseUrl + '/cohortspecific', function(data) {
            $('#loading-text').text("Rendering Visualizations...");
            // Persons By Duration From Start To End
            var result = common.normalizeArray(data.personsByDurationFromStartToEnd, false);
            if (!result.empty) {
                var personsByDurationData = common.normalizeDataframe(result).duration
                    .map(function (d, i) {
                        var item = {
                            xValue: this.duration[i],
                            yValue: this.pctPersons[i]
                        };
                        return item;
                    }, result);

                var personsByDurationSingle = new jnj_chart.line();
                personsByDurationSingle.render(personsByDurationData, "#personsByDurationFromStartToEnd", 550, 300, {
                    yFormat: d3.format('0%'),
                    xLabel: 'Day',
                    yLabel: 'Percent of Population',
                    labelIndexDate: true,
                    colorBasedOnIndex : true
                });
            }
            common.generateCSVDownload($("#personsByDurationFromStartToEnd"), data.personsByDurationFromStartToEnd, "personsByDurationFromStartToEnd");

            // prevalence by month
            d3.selectAll("#prevalenceByMonth svg").remove();
            var byMonthData = common.normalizeArray(data.prevalenceByMonth, true);
            if (!byMonthData.empty) {
                var byMonthSeries = common.mapMonthYearDataToSeries(byMonthData, {

                    dateField: 'xCalendarMonth',
                    yValue: 'yPrevalence1000Pp',
                    yPercent: 'yPrevalence1000Pp'
                });


                var prevalenceByMonth = new jnj_chart.line();
                prevalenceByMonth.render(byMonthSeries, "#prevalenceByMonth", 1000, 300, {
                    xScale: d3.time.scale().domain(d3.extent(byMonthSeries[0].values, function (d) {
                        return d.xValue;
                    })),
                    xFormat: d3.time.format("%m/%Y"),
                    tickFormat: d3.time.format("%Y"),
                    xLabel: "Date",
                    yLabel: "Prevalence per 1000 People"
                });
            }
            common.generateCSVDownload($("#prevalenceByMonth"), data.prevalenceByMonth, "prevalenceByMonth");

            // age at index
            var ageAtIndexDistribution = common.normalizeArray(data.ageAtIndexDistribution);
            if (!ageAtIndexDistribution.empty) {
                var boxplot = new jnj_chart.boxplot();
                var agData = ageAtIndexDistribution.category
                    .map(function (d, i) {
                        var item = {
                            Category: ageAtIndexDistribution.category[i],
                            min: ageAtIndexDistribution.minValue[i],
                            LIF: ageAtIndexDistribution.p10Value[i],
                            q1: ageAtIndexDistribution.p25Value[i],
                            median: ageAtIndexDistribution.medianValue[i],
                            q3: ageAtIndexDistribution.p75Value[i],
                            UIF: ageAtIndexDistribution.p90Value[i],
                            max: ageAtIndexDistribution.maxValue[i]
                        };
                        return item;
                    }, ageAtIndexDistribution);
                boxplot.render(agData, "#ageAtIndex", 235, 210, {
                    xLabel: "Gender",
                    yLabel: "Age"
                });
            }
            common.generateCSVDownload($("#ageAtIndex"), data.ageAtIndexDistribution, "ageAtIndexDistribution");

            // distributionAgeCohortStartByCohortStartYear
            var distributionAgeCohortStartByCohortStartYear = common.normalizeArray(data.distributionAgeCohortStartByCohortStartYear);
            if (!distributionAgeCohortStartByCohortStartYear.empty) {
                var boxplotCsy = new jnj_chart.boxplot();
                var csyData = distributionAgeCohortStartByCohortStartYear.category
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
                    }, distributionAgeCohortStartByCohortStartYear);
                boxplotCsy.render(csyData, "#distributionAgeCohortStartByCohortStartYear", 235, 210, {
                    xLabel: "Cohort Start Year",
                    yLabel: "Age"
                });
            }
            common.generateCSVDownload($("#distributionAgeCohortStartByCohortStartYear"), data.distributionAgeCohortStartByCohortStartYear, "distributionAgeCohortStartByCohortStartYear");

            // distributionAgeCohortStartByGender
            var distributionAgeCohortStartByGender = common.normalizeArray(data.distributionAgeCohortStartByGender);
            if (!distributionAgeCohortStartByGender.empty) {
                var boxplotBg = new jnj_chart.boxplot();
                var bgData = distributionAgeCohortStartByGender.category
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
                    }, distributionAgeCohortStartByGender);
                boxplotBg.render(bgData, "#distributionAgeCohortStartByGender", 235, 210, {
                    xLabel: "Gender",
                    yLabel: "Age"
                });
            }
            common.generateCSVDownload($("#distributionAgeCohortStartByGender"), data.distributionAgeCohortStartByGender, "distributionAgeCohortStartByGender");

            // persons in cohort from start to end
            var personsInCohortFromCohortStartToEnd = common.normalizeArray(data.personsInCohortFromCohortStartToEnd);
            if (!personsInCohortFromCohortStartToEnd.empty) {
                var personsInCohortFromCohortStartToEndSeries = common.map30DayDataToSeries(personsInCohortFromCohortStartToEnd, {
                    dateField: 'monthYear',
                    yValue: 'countValue',
                    yPercent: 'percentValue'
                });
                d3.selectAll("#personinCohortFromStartToEnd svg").remove();
                var observationByMonthSingle = new jnj_chart.line();
                observationByMonthSingle.render(personsInCohortFromCohortStartToEndSeries, "#personinCohortFromStartToEnd", 900, 250, {
                    xScale: d3.time.scale().domain(d3.extent(personsInCohortFromCohortStartToEndSeries[0].values, function (d) {
                        return d.xValue;
                    })),
                    xLabel: "30 Day Increments",
                    yLabel: "People"
                });
            }
            common.generateCSVDownload($("#personinCohortFromStartToEnd"), data.personsInCohortFromCohortStartToEnd, "personsInCohortFromCohortStartToEnd");

            // render trellis
            d3.selectAll("#trellisLinePlot svg").remove();
            var trellisData = common.normalizeArray(data.numPersonsByCohortStartByGenderByAge, true);

            if (!trellisData.empty) {
                var allDeciles = ["0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80-89", "90-99"];
                var minYear = d3.min(trellisData.xCalendarYear),
                    maxYear = d3.max(trellisData.xCalendarYear);

                var seriesInitializer = function (tName, sName, x, y) {
                    return {
                        trellisName: tName,
                        seriesName: sName,
                        xCalendarYear: x,
                        yPrevalence1000Pp: y
                    };
                };

                var nestByDecile = d3.nest()
                    .key(function (d) {
                        return d.trellisName;
                    })
                    .key(function (d) {
                        return d.seriesName;
                    })
                    .sortValues(function (a, b) {
                        return a.xCalendarYear - b.xCalendarYear;
                    });

                // map data into chartable form
                var normalizedSeries = trellisData.trellisName.map(function (d, i) {
                    var item = {};
                    var container = this;
                    d3.keys(container).forEach(function (p) {
                        item[p] = container[p][i];
                    });
                    return item;
                }, trellisData);

                var dataByDecile = nestByDecile.entries(normalizedSeries);
                // fill in gaps
                var yearRange = d3.range(minYear, maxYear, 1);

                dataByDecile.forEach(function (trellis) {
                    trellis.values.forEach(function (series) {
                        series.values = yearRange.map(function (year) {
                            var yearData = series.values.filter(function (f) {
                                    return f.xCalendarYear === year;
                                })[0] || seriesInitializer(trellis.key, series.key, year, 0);
                            yearData.date = new Date(year, 0, 1);
                            return yearData;
                        });
                    });
                });

                // create svg with range bands based on the trellis names
                var chart = new jnj_chart.trellisline();
                chart.render(dataByDecile, "#trellisLinePlot", 1000, 300, {
                    trellisSet: allDeciles,
                    trellisLabel: "Age Decile",
                    seriesLabel: "Year",
                    yLabel: "Prevalence Per 1000 People",
                    xFormat: d3.time.format("%Y"),
                    yFormat: d3.format("0.2f"),
                    tickPadding: 20,
                    colors: d3.scale.ordinal()
                        .domain(["MALE", "FEMALE", "UNKNOWN"])
                        .range(["#1F78B4", "#FB9A99", "#33A02C"])

                });
            }
            common.generateCSVDownload($("#trellisLinePlot"), data.numPersonsByCohortStartByGenderByAge, "numPersonsByCohortStartByGenderByAge");

            $('#spinner-modal').modal('hide');
        })
            .fail(function() {
                $('#spinner-modal').modal('hide');
            });

    };

    return CohortSpecificRenderer;
});
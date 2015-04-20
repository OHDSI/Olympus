define(["jquery", "bootstrap", "d3","jnj_chart", "ohdsi_common", "datatables", "datatables-colvis", "colorbrewer"],
    function ($, bootstrap, d3, jnj_chart, common, DataTables, DataTablesColvis, colorbrewer) {

        function DeathDataRenderer() {}
        DeathDataRenderer.prototype = {};
        DeathDataRenderer.prototype.constructor = DeathDataRenderer;

        DeathDataRenderer.render = function(cohort) {
            d3.selectAll("svg").remove();

            var id = cohort.id;
            this.baseUrl = getWebApiUrl() + 'cohortresults/' + id;
            $('#loading-text').text("Querying Database...");
            $('#spinner-modal').modal('show');

            $.ajax({
                type: "GET",
                url: DeathDataRenderer.baseUrl + "/death",
                contentType: "application/json; charset=utf-8"
            }).done(function (result) {
                $('#loading-text').text("Rendering Visualizations...");
                // render trellis
                var trellisData = common.normalizeArray(result.prevalenceByGenderAgeYear, true);
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
                        seriesLabel: "Year of Observation",
                        yLabel: "Prevalence Per 1000 People",
                        xFormat: d3.time.format("%Y"),
                        yFormat: d3.format("0.2f"),
                        tickPadding: 20,
                        colors: d3.scale.ordinal()
                            .domain(["MALE", "FEMALE", "UNKNOWN"])
                            .range(["#1F78B4", "#FB9A99", "#33A02C"])
                    });
                }
                common.generateCSVDownload($("#trellisLinePlot"), result.prevalenceByGenderAgeYear, "prevalenceByGenderAgeYear");

                // prevalence by month
                var byMonthData = common.normalizeArray(result.prevalenceByMonth, true);
                if (!byMonthData.empty) {
                    var byMonthSeries = common.mapMonthYearDataToSeries(byMonthData, {
                        dateField: 'xCalendarMonth',
                        yValue: 'yPrevalence1000Pp',
                        yPercent: 'yPrevalence1000Pp'
                    });

                    var prevalenceByMonth = new jnj_chart.line();
                    prevalenceByMonth.render(byMonthSeries, "#deathPrevalenceByMonth", 1000, 300, {
                        xScale: d3.time.scale().domain(d3.extent(byMonthSeries[0].values, function (d) {
                            return d.xValue;
                        })),
                        xFormat: d3.time.format("%m/%Y"),
                        tickFormat: d3.time.format("%Y"),
                        xLabel: "Date",
                        yLabel: "Prevalence per 1000 People"
                    });
                }
                common.generateCSVDownload($("#deathPrevalenceByMonth"), result.prevalenceByMonth, "prevalenceByMonth");

                // death type
                if (result.deathByType && result.deathByType.length > 0) {
                var genderDonut = new jnj_chart.donut();
                    genderDonut.render(common.mapConceptData(result.deathByType), "#deathByType", 500, 300, {
                        margin: {
                            top: 5,
                            left: 5,
                            right: 200,
                            bottom: 5
                        }
                    });
                }
                common.generateCSVDownload($("#deathByType"), result.deathByType, "deathByType");

                // Age At Death
                var bpdata = common.normalizeArray(result.agetAtDeath);
                if (!bpdata.empty) {
                    var boxplot = new jnj_chart.boxplot();
                    var bpseries = [];

                    for (var i = 0; i < bpdata.category.length; i++) {
                        bpseries.push({
                            Category: bpdata.category[i],
                            min: bpdata.minValue[i],
                            max: bpdata.maxValue[i],
                            median: bpdata.medianValue[i],
                            LIF: bpdata.p10Value[i],
                            q1: bpdata.p25Value[i],
                            q3: bpdata.p75Value[i],
                            UIF: bpdata.p90Value[i]
                        });
                    }
                    boxplot.render(bpseries, "#ageAtDeath", 500, 300, {
                        xLabel: 'Gender',
                        yLabel: 'Age at Death'
                    });
                }
                common.generateCSVDownload($("#ageAtDeath"), result.agetAtDeath, "ageAtDeath");

                $('#spinner-modal').modal('hide');
            }).error(function (result) {
                $('#spinner-modal').modal('hide');
            });

        };

        return DeathDataRenderer;
    });
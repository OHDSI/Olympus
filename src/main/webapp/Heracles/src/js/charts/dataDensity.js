define(["jquery", "bootstrap", "d3","jnj_chart", "ohdsi_common", "datatables", "datatables-colvis", "colorbrewer"],
    function ($, bootstrap, d3, jnj_chart, common, DataTables, DataTablesColvis, colorbrewer) {

        function DataDensityRenderer() {}
        DataDensityRenderer.prototype = {};
        DataDensityRenderer.prototype.constructor = DataDensityRenderer;

        DataDensityRenderer.render = function(cohort) {
            d3.selectAll("svg").remove();

            var id = cohort.id;
            this.baseUrl = getWebApiUrl() + 'cohortresults/' + id;
            $('#loading-text').text("Querying Database...");
            $('#spinner-modal').modal('show');

            $.ajax({
                type: "GET",
                url: DataDensityRenderer.baseUrl + "/datadensity",
                contentType: "application/json; charset=utf-8"
            }).done(function (result) {
                $('#loading-text').text("Rendering Visualizations...");

                var totalRecords = (result.totalRecords);
                if (totalRecords.length > 0) {
                    // convert yyyymm to date
                    totalRecords.forEach(function (d, i, ar) {
                        var dt = +d.xCalendarMonth;
                        var dtVal = new Date(Math.floor(dt / 100), (dt % 100) - 1, 1);
                        ar[i].xCalendarMonth = dtVal;
                    });

                    var normalizedTotalRecords = common.dataframeToArray(common.normalizeArray(totalRecords));

                    // nest dataframe data into key->values pair
                    var totalRecordsData = d3.nest()
                        .key(function (d) {
                            return d.seriesName;
                        })
                        .entries(normalizedTotalRecords)
                        .map(function (d) {
                            return {name: d.key, values: d.values};
                        });


                    var totalRecordsLine = new jnj_chart.line();
                    totalRecordsLine.render(totalRecordsData, "#totalrecords", 900, 250, {
                        xScale: d3.time.scale().domain(d3.extent(normalizedTotalRecords, function (d) {
                            return d.xCalendarMonth;
                        })),
                        xFormat: d3.time.format("%m/%Y"),
                        tickFormat: d3.time.format("%Y"),
                        xValue: "xCalendarMonth",
                        yValue: "yRecordCount",
                        xLabel: "Year",
                        yLabel: "# of Records",
                        showLegend: true,
                        colors: d3.scale.category10()
                    });
                }
                common.generateCSVDownload($("#totalrecords"), result.totalRecords, "totalRecords");

                var recordsPerPerson = common.normalizeArray(result.recordsPerPerson, true);
                if (!recordsPerPerson.empty) {
                    // convert yyyymm to date
                    recordsPerPerson.xCalendarMonth.forEach(function (d, i, ar) {
                        ar[i] = new Date(Math.floor(d / 100), (d % 100) - 1, 1);
                    });

                    // convert data-frame structure to array of objects
                    var normalizedRecordsPerPerson = common.dataframeToArray(recordsPerPerson);

                    // nest dataframe data into key->values pair
                    var recordsPerPersonData = d3.nest()
                        .key(function (d) {
                            return d.seriesName;
                        })
                        .entries(normalizedRecordsPerPerson)
                        .map(function (d) {
                            return {name: d.key, values: d.values};
                        });


                    var recordsPerPersonLine = new jnj_chart.line();
                    recordsPerPersonLine.render(recordsPerPersonData, "#recordsperperson", 900, 250, {
                        xScale: d3.time.scale().domain(d3.extent(normalizedRecordsPerPerson, function (d) {
                            return d.xCalendarMonth;
                        })),
                        xFormat: d3.time.format("%m/%Y"),
                        tickFormat: d3.time.format("%Y"),
                        xValue: "xCalendarMonth",
                        yValue: "yRecordCount",
                        xLabel: "Year",
                        yLabel: "Records Per Person",
                        showLegend: true,
                        colors: d3.scale.category10()
                    });
                }
                common.generateCSVDownload($("#recordsperperson"), result.recordsPerPerson, "recordsPerPerson");

                var conceptsData = common.normalizeArray(result.conceptsPerPerson, true);
                if (!conceptsData.empty) {
                    var conceptsBoxplot = new jnj_chart.boxplot();
                    var conceptsSeries = [];

                    for (var i = 0; i < conceptsData.category.length; i++) {
                        conceptsSeries.push({
                            Category: conceptsData.category[i],
                            min: conceptsData.minValue[i],
                            max: conceptsData.maxValue[i],
                            median: conceptsData.medianValue[i],
                            LIF: conceptsData.p10Value[i],
                            q1: conceptsData.p25Value[i],
                            q3: conceptsData.p75Value[i],
                            UIF: conceptsData.p90Value[i]
                        });
                    }
                    conceptsBoxplot.render(conceptsSeries, "#conceptsperperson", 800, 200, {
                        yMax: d3.max(conceptsData.p90Value),
                        xLabel: 'Concept Type',
                        yLabel: 'Concepts per Person'
                    });
                }
                common.generateCSVDownload($("#conceptsperperson"), result.conceptsPerPerson, "conceptsPerPerson");

                $('#spinner-modal').modal('hide');
            }).error(function (result) {
                $('#spinner-modal').modal('hide');
            });

        };

        return DataDensityRenderer;
    });
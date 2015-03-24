define(["d3","jnj_chart", "ohdsi_common"], function (d3, jnj_chart, common) {

    function DashboardRenderer() {}
    DashboardRenderer.prototype = {};
    DashboardRenderer.prototype.constructor = DashboardRenderer;

    var genderDonut;


    DashboardRenderer.render = function(cohort) {
        var id = cohort.id;
        this.baseUrl = getWebApiUrl() + '/cohortresults/' + id;
        d3.selectAll("svg").remove();

        $('#loading-text').text("Querying Database...");
        $('#spinner-modal').modal('show');
        $.getJSON(this.baseUrl + '/dashboard', function(data) {
            $('#loading-text').text("Rendering Visualizations...");
            // gender
            d3.selectAll("#genderPie svg").remove();
            genderDonut = new jnj_chart.donut();
            genderDonut.render(common.mapConceptData(data.gender), "#genderPie", 260, 100, {
                colors: d3.scale.ordinal()
                    .domain([8507, 8551, 8532])
                    .range(["#1F78B4", "#33A02C", "#FB9A99"]),
                margin: {
                    top: 5,
                    bottom: 10,
                    right: 150,
                    left: 10
                }
            });

            // age at first obs histogram
            var histData = {};
            histData.intervalSize = 1;
            histData.min = 0;
            histData.max = 100;
            histData.intervals = 100;
            histData.data = common.normalizeArray(data.ageAtFirstObservation, true);

            d3.selectAll("#ageatfirstobservation svg").remove();
            var ageAtFirstObservationData = common.mapHistogram(histData);
            var ageAtFirstObservationHistogram = new jnj_chart.histogram();
            ageAtFirstObservationHistogram.render(ageAtFirstObservationData, "#ageatfirstobservation", 460, 195, {
                xFormat: d3.format('d'),
                xLabel: 'Age',
                yLabel: 'People'
            });

            // cumulative observation
            var result = common.normalizeArray(data.cumulativeObservation, false);
            if (!result.empty) {
                d3.selectAll("#cumulativeobservation svg").remove();
                var cumulativeObservationLine = new jnj_chart.line();
                var cumulativeData = common.normalizeDataframe(result).xLengthOfObservation
                    .map(function (d, i) {
                        var item = {
                            xValue: this.xLengthOfObservation[i],
                            yValue: this.yPercentPersons[i]
                        };
                        return item;
                    }, result);

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
            // observedByMonth
            var observedByMonth = common.normalizeArray(data.observedByMonth, false);

            var byMonthSeries = common.mapMonthYearDataToSeries(observedByMonth, {
                dateField: 'monthYear',
                yValue: 'countValue',
                yPercent: 'percentValue'
            });

            d3.selectAll("#oppeoplebymonthsingle svg").remove();
            var observationByMonthSingle = new jnj_chart.line();
            observationByMonthSingle.render(byMonthSeries, "#oppeoplebymonthsingle", 550, 300, {
                xScale: d3.time.scale().domain(d3.extent(byMonthSeries[0].values, function (d) {
                    return d.xValue;
                })),
                xFormat: d3.time.format("%m/%Y"),
                tickFormat: d3.time.format("%Y"),
                tickPadding: 10,
                xLabel: "Date",
                yLabel: "People"
            });
            $('#spinner-modal').modal('hide');
        })
        .fail(function() {
                $('#spinner-modal').modal('hide');
        });

    };

    return DashboardRenderer;
});
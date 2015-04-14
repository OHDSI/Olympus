define(["jquery", "bootstrap", "d3","jnj_chart", "ohdsi_common", "datatables", "datatables-colvis", "colorbrewer"],
    function ($, bootstrap, d3, jnj_chart, common, DataTables, DataTablesColvis, colorbrewer) {

    function PersonRenderer() {}
    PersonRenderer.prototype = {};
    PersonRenderer.prototype.constructor = PersonRenderer;

    PersonRenderer.render = function(cohort) {
        d3.selectAll("svg").remove();

        var id = cohort.id;
        this.baseUrl = getWebApiUrl() + '/cohortresults/' + id;
        $('#loading-text').text("Querying Database...");
        $('#spinner-modal').modal('show');

        $.ajax({
            type: "GET",
            url: PersonRenderer.baseUrl + "/person",
            contentType: "application/json; charset=utf-8"
        }).done(function (result) {
            $('#loading-text').text("Rendering Visualizations...");
            d3.selectAll("#genderPie svg").remove();
            var genderDonut = new jnj_chart.donut();
            genderDonut.render(common.mapConceptData(result.gender), "#genderPie", 260, 130, {
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
            common.generateCSVDownload($("#genderPie"), result.gender, "gender");

            d3.selectAll("#raceTypePie svg").remove();
            var raceDonut = new jnj_chart.donut();
            raceDonut.render(common.mapConceptData(result.race), "#raceTypePie", 260, 130, {
                margin: {
                    top: 5,
                    bottom: 10,
                    right: 150,
                    left: 10
                },
                colors : d3.scale.ordinal()
                    .domain(result.race)
                    .range(colorbrewer.Paired[10])
            });
            common.generateCSVDownload($("#raceTypePie"), result.race, "race");

            d3.selectAll("#ethnicityTypePie svg").remove();
            raceDonut = new jnj_chart.donut();
            raceDonut.render(common.mapConceptData(result.ethnicity), "#ethnicityTypePie", 260, 130, {
                margin: {
                    top: 5,
                    bottom: 10,
                    right: 150,
                    left: 10
                },
                colors : d3.scale.ordinal()
                    .domain(result.ethnicity)
                    .range(colorbrewer.Paired[10])
            });
            common.generateCSVDownload($("#ethnicityTypePie"), result.ethnicity, "ethnicity");

            d3.selectAll("#birthyearhist svg").remove();
            if (result.yearOfBirth.length > 0 && result.yearOfBirthStats.length > 0) {
                var yearHistogram = new jnj_chart.histogram();
                var histData = {};
                histData.intervalSize = 1;
                histData.min = result.yearOfBirthStats[0].minValue;
                histData.max = result.yearOfBirthStats[0].maxValue;
                histData.intervals = 100;
                histData.data = (common.normalizeArray(result.yearOfBirth));
                yearHistogram.render(common.mapHistogram(histData), "#birthyearhist", 460, 195, {
                    xFormat: d3.format('d'),
                    xLabel: 'Year',
                    yLabel: 'People'
                });
            }
            common.generateCSVDownload($("#birthyearhist"), result.yearOfBirth, "yearOfBirth");

            $('#spinner-modal').modal('hide');
        }).error(function (result) {
            $('#spinner-modal').modal('hide');
        });

    };

    return PersonRenderer;
});
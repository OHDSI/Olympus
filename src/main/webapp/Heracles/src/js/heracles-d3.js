define(['jquery', 'd3', 'jnj_chart', 'ohdsi_common'], function (jquery, d3, jnj_chart, common) {
    var COLOR_RANGE = ["#AF0C3C", "#290F2E", "#0E7184", "#F0D31A", "#FE7D0D"];
    var DEFAULT_HEIGHT = 175;


    function HeraclesD3() {}
    HeraclesD3.prototype = {};
    HeraclesD3.prototype.constructor = HeraclesD3;


    function translateGenderData(dataIn) {
        var data = {};
        data.array = [];
        data.keys = [];
        data.total_size = 0;
        $.each(dataIn, function () {

            data.total_size += (+this.NUM_PERSONS);

            var obj = {};
            data.keys.push(this.CONCEPT_NAME);
            obj.label = this.CONCEPT_NAME;
            obj.value = this.NUM_PERSONS;

            data.array.push(obj);
        });

        // reset averages
        $.each(data.array, function () {
            this.average_value = Math.round((+this.value / data.total_size) * 100);
        });

        return data;
    }

    function translateAgeData(dataIn) {
        var data = {};
        data.array = [];
        data.total_size = 0;
        data.keys = ["<18", "18-34", "35-49", "50-64", ">=65"];
        $.each(data.keys, function() {
            var obj = {};
            obj.label = (this);
            obj.value = 0;
            data.array.push(obj);
        });

        $.each(dataIn, function() {
            var age = +this.AGE_AT_INDEX;
            var persons = +this.NUM_PERSONS;
            data.total_size += (+this.NUM_PERSONS);

            if (age < 18) {
                data.array[0].value += persons;
            } else if (age >= 18 && age < 35) {
                data.array[1].value += persons;
            } else if (age >= 35 && age < 50) {
                data.array[2].value += persons;
            } else if (age >= 50 && age < 65) {
                data.array[3].value += persons;
            } else {
                data.array[4].value += persons;
            }
        });

        // reset averages
        $.each(data.array, function () {
            this.average_value = Math.round((+this.value / data.total_size) * 100);
        });

        return data;
    }

    HeraclesD3.showAgeDistribution = function(ageData) {
        var data = translateAgeData(ageData);

        $("#age_dist").empty();

        var w = DEFAULT_HEIGHT; //Math.min(getCurrentMaxHeight(), 200);
        var r = w / 2;
        /*
            var color = d3.scale.ordinal()

            .domain(data.keys)
            .range(COLOR_RANGE);
         */

        var color = d3.scale.category10();


        var vis = d3.select('#age_dist')
            .append("svg:svg")
            .data([data.array])
            .attr("width", w)
            .attr("height", w)
            .append("svg:g")
            .attr("transform", "translate(" + r + "," + r + ")");
        var pie = d3.layout.pie().value(function (d) {
            return d.average_value;
        });

        // declare an arc generator function
        var arc = d3.svg.arc().outerRadius(r);

        // select paths, use arc generator to draw
        var arcs = vis
            .selectAll("g.slice")
            .data(pie)
            .enter()
            .append("svg:g")
            .attr("class", "slice");
        arcs.append("svg:path")
            .attr("fill", function (d, i) {
                return color(i);
            })
            .attr("d", function (d) {
                return arc(d);
            });

        // add the text
        arcs.append("svg:text").attr("transform", function (d) {
            d.innerRadius = 0;
            d.outerRadius = r;
            var centroid = (arc.centroid(d));
            centroid[1] -= 10;
            //console.log(centroid);
            return "translate(" + centroid + ")";
        })
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .style("font-size", "11px")
            .text(function (d, i) {
                return data.array[i].label;
            }
        );

        arcs.append("svg:text").attr("transform", function (d) {
            d.innerRadius = 0;
            d.outerRadius = r;
            var centroid = (arc.centroid(d));
            centroid[1] += 10;
            //console.log(centroid);
            return "translate(" + centroid + ")";
        })
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .attr("font-weight", "bold")
            .style("font-size", "10px")
            .text(function (d, i) {
                return "(" + data.array[i].average_value + "%)";
            }
        );

    };

    HeraclesD3.showGenderDistribution = function(genderData) {

        var transData = translateGenderData(genderData);
        var data = transData.array;
        /*
        var color = d3.scale.ordinal()
            .domain(transData.keys)
            .range(COLOR_RANGE);
            */
        var color = d3.scale.category10();

        $("#gender_dist").empty();

        var minHeight = 30;
        var barWidth = 60;
        var width = (barWidth + 10) * data.length;
        var height = DEFAULT_HEIGHT; //Math.min(getCurrentMaxHeight(), 200);

        var x = d3.scale.linear().domain([0, data.length]).range([0, width]);
        var y = d3.scale.linear().domain([0, d3.max(data, function (datum) {
            return datum.average_value;
        })]).
            rangeRound([0, height]);

        // add the canvas to the DOM
        var barChart = d3.select("#gender_dist").
            append("svg:svg").
            attr("width", width).
            attr("height", height);

        barChart.selectAll("rect").
            data(data).
            enter().
            append("svg:rect").
            attr("x", function (datum, index) {
                return x(index);
            }).
            attr("y", function (datum) {
                return height - Math.max(minHeight,y(datum.average_value));
            }).
            attr("height", function (datum) {
                return Math.max(minHeight,y(datum.average_value));
            }).
            attr("width", barWidth).
            attr("fill", function (d, i) {
                return color(i);
            });

        barChart.selectAll("text").
            data(data).
            enter().
            append("svg:text").
            attr("x", function (datum, index) {
                return x(index) + barWidth;
            }).
            attr("y", function (datum) {
                return height - Math.max(minHeight,y(datum.average_value));
            }).
            attr("dx", -barWidth / 2).
            attr("dy", "1.2em").
            attr("text-anchor", "middle").
            attr("font-weight", "bold").
            text(function (datum) {
                return datum.average_value + "%";
            }).
            attr("fill", "white").
            attr("style", "font-size: 10; font-family: Helvetica, sans-serif");

        barChart.selectAll("text.yAxis").
            data(data).
            enter().append("svg:text").
            attr("x", function (datum, index) {
                return x(index) + barWidth;
            }).
            attr("y", height).
            attr("dx", -barWidth / 2).
            attr("text-anchor", "middle").
            attr("style", "font-size: 10; font-family: Helvetica, sans-serif").
            attr("fill", "white").
            text(function (datum) {
                return datum.label;
            }).
            attr("transform", "translate(0, -4)").
            attr("class", "yAxis");

    };

    HeraclesD3.renderOHDSIDefaults = function(data) {


        // gender
        if (data.genderDistribution) {
            d3.selectAll("#gender_dist svg").remove();
            var genderDonut = new jnj_chart.donut();
            genderDonut.render(common.mapConceptData(data.genderDistribution), "#gender_dist", 260, 100, {
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
        }

        // age at first obs histogram
        if (data.ageDistribution) {
            var histData = {};
            histData.intervalSize = 1;
            histData.data = common.normalizeArray(data.ageDistribution, true);
            if (!histData.data.empty) {
                histData.min = 0;
                histData.max = 100;
                histData.intervals = 100;
                d3.selectAll("#age_dist svg").remove();
                var ageAtFirstObservationData = common.mapHistogram(histData);
                var ageAtFirstObservationHistogram = new jnj_chart.histogram();
                ageAtFirstObservationHistogram.render(ageAtFirstObservationData, "#age_dist", 460, 195, {
                    xFormat: d3.format('d'),
                    xLabel: 'Age',
                    yLabel: 'People'
                });
            }
        }
    };



    return HeraclesD3;
});
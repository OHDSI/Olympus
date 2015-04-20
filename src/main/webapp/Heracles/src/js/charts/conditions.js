define(["jquery", "bootstrap", "d3","jnj_chart", "ohdsi_common", "datatables", "datatables-colvis", "colorbrewer", "tabletools"],
    function ($, bootstrap, d3, jnj_chart, common, DataTables, DataTablesColvis, colorbrewer, TableTools) {

    function ConditionRenderer() {}
    ConditionRenderer.prototype = {};
    ConditionRenderer.prototype.constructor = ConditionRenderer;

    ConditionRenderer.render = function(cohort) {
        d3.selectAll("svg").remove();

        var id = cohort.id;
        this.baseUrl = getWebApiUrl() + 'cohortresults/' + id;

        var threshold;
        var datatable;

        // bind to all matching elements upon creation
        $(document).on('click', '#condition_table tbody tr', function () {
            $('#condition_table tbody tr.selected').removeClass('selected');
            $(this).addClass('selected');
            var data = datatable.data()[datatable.row(this)[0]];
            if (data) {
                var did =  data.concept_id;
                var concept_name = data.snomed;
                ConditionRenderer.drilldown(did, concept_name);
            }
        });

        $(document).on( 'shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
            $(window).trigger("resize");

            // Version 1.
            $('table:visible').each(function()
            {
                var oTableTools = TableTools.fnGetInstance(this);

                if (oTableTools && oTableTools.fnResizeRequired())
                {
                    oTableTools.fnResizeButtons();
                }
            });
        });

        ConditionRenderer.drilldown = function (concept_id, concept_name) {
            $('#loading-text').text("Querying Database...");
            $('#spinner-modal').modal('show');

            $('.drilldown svg').remove();
            $('#conditionDrilldownTitle').text(concept_name);
            $('#reportConditionOccurrencesDrilldown').removeClass('hidden');

            $.ajax({
                type: "GET",
                url: ConditionRenderer.baseUrl + '/condition/' + concept_id,
                success: function (data) {
                    $('#loading-text').text("Rendering Visualizations...");
                    // age at first diagnosis visualization
                    d3.selectAll("#ageAtFirstDiagnosis svg").remove();
                    var boxplot = new jnj_chart.boxplot();
                    var bpseries = [];
                    var bpdata = common.normalizeArray(data.ageAtFirstDiagnosis, true);
                    if (!bpdata.empty) {
                        for (i = 0; i < bpdata.category.length; i++) {
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
                        boxplot.render(bpseries, "#ageAtFirstDiagnosis", 500, 300, {
                            xLabel: 'Gender',
                            yLabel: 'Age at First Diagnosis'
                        });
                    }
                    common.generateCSVDownload($("#ageAtFirstDiagnosis"), data.ageAtFirstDiagnosis, "ageAtFirstDiagnosis");

                    // prevalence by month
                    d3.selectAll("#conditionPrevalenceByMonth svg").remove();
                    var byMonthData = common.normalizeArray(data.prevalenceByMonth, true);
                    if (!byMonthData.empty) {
                        var byMonthSeries = common.mapMonthYearDataToSeries(byMonthData, {

                            dateField: 'xCalendarMonth',
                            yValue: 'yPrevalence1000Pp',
                            yPercent: 'yPrevalence1000Pp'
                        });


                        var prevalenceByMonth = new jnj_chart.line();
                        prevalenceByMonth.render(byMonthSeries, "#conditionPrevalenceByMonth", 1000, 300, {
                            xScale: d3.time.scale().domain(d3.extent(byMonthSeries[0].values, function (d) {
                                return d.xValue;
                            })),
                            xFormat: d3.time.format("%m/%Y"),
                            tickFormat: d3.time.format("%Y"),
                            xLabel: "Date",
                            yLabel: "Prevalence per 1000 People"
                        });
                    }
                    common.generateCSVDownload($("#conditionPrevalenceByMonth"), data.prevalenceByMonth, "prevalenceByMonth");

                    // condition type visualization
                    var conditionType = common.mapConceptData(data.conditionsByType);
                    d3.selectAll("#conditionsByType svg").remove();
                    if (conditionType) {
                        var donut = new jnj_chart.donut();
                        donut.render(conditionType, "#conditionsByType", 500, 300, {
                            margin: {
                                top: 5,
                                left: 5,
                                right: 200,
                                bottom: 5
                            },
                            colors : d3.scale.ordinal()
                                .domain(conditionType)
                                .range(colorbrewer.Paired[10])
                        });
                    }
                    common.generateCSVDownload($("#conditionsByType"), data.conditionsByType, "conditionsByType");

                    // render trellis
                    d3.selectAll("#trellisLinePlot svg").remove();
                    var trellisData = common.normalizeArray(data.prevalenceByGenderAgeYear, true);

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
                    common.generateCSVDownload($("#trellisLinePlot"), data.prevalenceByGenderAgeYear, "prevalenceByGenderAgeYear");

                    $('#spinner-modal').modal('hide');
                }, error : function(data) {
                    $('#spinner-modal').modal('hide');
                }
            });
        };


        function buildHierarchyFromJSON(data, threshold) {
            var total = 0;

            var root = {
                "name": "root",
                "children": []
            };

            for (i = 0; i < data.percentPersons.length; i++) {
                total += data.percentPersons[i];
            }

            for (var i = 0; i < data.conceptPath.length; i++) {
                var parts = data.conceptPath[i].split("||");
                var currentNode = root;
                for (var j = 0; j < parts.length; j++) {
                    var children = currentNode.children;
                    var nodeName = parts[j];
                    var childNode;
                    if (j + 1 < parts.length) {
                        // Not yet at the end of the path; move down the tree.
                        var foundChild = false;
                        for (var k = 0; k < children.length; k++) {
                            if (children[k].name === nodeName) {
                                childNode = children[k];
                                foundChild = true;
                                break;
                            }
                        }
                        // If we don't already have a child node for this branch, create it.
                        if (!foundChild) {
                            childNode = {
                                "name": nodeName,
                                "children": []
                            };
                            children.push(childNode);
                        }
                        currentNode = childNode;
                    } else {
                        // Reached the end of the path; create a leaf node.
                        childNode = {
                            "name": nodeName,
                            "num_persons": data.numPersons[i],
                            "id": data.conceptId[i],
                            "path": data.conceptPath[i],
                            "pct_persons": data.percentPersons[i],
                            "records_per_person": data.recordsPerPerson[i]
                        };

                        // we only include nodes with sufficient size in the treemap display
                        // sufficient size is configurable in the calculation of threshold
                        // which is a function of the number of pixels in the treemap display
                        if ((data.percentPersons[i] / total) > threshold) {
                            children.push(childNode);
                        }
                    }
                }
            }
            return root;
        }

        // show the treemap
        $('#loading-text').text("Querying Database...");
        $('#spinner-modal').modal('show');
        var format_pct = d3.format('.2%');
        var format_fixed = d3.format('.2f');
        var format_comma = d3.format(',');

        $('#reportConditionOccurrences svg').remove();

        var width = 1000;
        var height = 250;
        var minimum_area = 50;
        threshold = minimum_area / (width * height);

        $.ajax({
            type: "GET",
            url: ConditionRenderer.baseUrl + '/condition',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $('#loading-text').text("Rendering Visualizations...");
                var normalizedData = common.normalizeDataframe(common.normalizeArray(data, true));
                data = normalizedData;
                if (!data.empty) {
                    var table_data = normalizedData.conceptPath.map(function (d, i) {
                        conceptDetails = this.conceptPath[i].split('||');
                        return {
                            concept_id: this.conceptId[i],
                            soc: conceptDetails[0],
                            hlgt: conceptDetails[1],
                            hlt: conceptDetails[2],
                            pt: conceptDetails[3],
                            snomed: conceptDetails[4],
                            num_persons: format_comma(this.numPersons[i]),
                            percent_persons: format_pct(this.percentPersons[i]),
                            records_per_person: format_fixed(this.recordsPerPerson[i])
                        };
                    }, data);

                    datatable = $('#condition_table').DataTable({
                        order: [6, 'desc'],
                        dom: 'T<"clear">lfrtip',
                        data: table_data,
                        columns: [
                            {
                                data: 'concept_id',
                                visible: false
                            },
                            {
                                data: 'soc'
                            },
                            {
                                data: 'hlgt',
                                visible: false
                            },
                            {
                                data: 'hlt'
                            },
                            {
                                data: 'pt',
                                visible: false
                            },
                            {
                                data: 'snomed'
                            },
                            {
                                data: 'num_persons',
                                className: 'numeric'
                            },
                            {
                                data: 'percent_persons',
                                className: 'numeric'
                            },
                            {
                                data: 'records_per_person',
                                className: 'numeric'
                            }
                        ],
                        pageLength: 5,
                        lengthChange: false,
                        deferRender: true,
                        destroy: true
                    });

                    $('#reportConditionOccurrences').show();

                    tree = buildHierarchyFromJSON(data, threshold);
                    var treemap = new jnj_chart.treemap();
                    treemap.render(tree, '#treemap_container', width, height, {
                        onclick: function (node) {
                            ConditionRenderer.drilldown(node.id, node.name);
                        },
                        getsizevalue: function (node) {
                            return node.num_persons;
                        },
                        getcolorvalue: function (node) {
                            return node.records_per_person;
                        },
                        getcolorrange: function() {
                            return colorbrewer.Paired[3];
                        },
                        getcontent: function (node) {
                            var result = '',
                                steps = node.path.split('||'),
                                i = steps.length - 1;
                            result += '<div class="pathleaf">' + steps[i] + '</div>';
                            result += '<div class="pathleafstat">Prevalence: ' + format_pct(node.pct_persons) + '</div>';
                            result += '<div class="pathleafstat">Number of People: ' + format_comma(node.num_persons) + '</div>';
                            result += '<div class="pathleafstat">Records per Person: ' + format_fixed(node.records_per_person) + '</div>';
                            return result;
                        },
                        gettitle: function (node) {
                            var title = '',
                                steps = node.path.split('||');
                            for (i = 0; i < steps.length - 1; i++) {
                                title += ' <div class="pathstep">' + Array(i + 1).join('&nbsp;&nbsp') + steps[i] + ' </div>';
                            }
                            return title;
                        }
                    });
                    $('[data-toggle="popover"]').popover();
                }
                $('#spinner-modal').modal('hide');
            }, error : function(data) {
                $('#spinner-modal').modal('hide');
            }

        });

        return ConditionRenderer;

    };

    return ConditionRenderer;
});
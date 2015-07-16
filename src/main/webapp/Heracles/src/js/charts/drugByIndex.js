define(["jquery", "bootstrap", "d3","jnj_chart", "ohdsi_common", "datatables", "datatables-colvis", "colorbrewer", "tabletools"],
    function ($, bootstrap, d3, jnj_chart, common, DataTables, DataTablesColvis, colorbrewer, TableTools) {

        function DrugsByIndexRenderer() {}
        DrugsByIndexRenderer.prototype = {};
        DrugsByIndexRenderer.prototype.constructor = DrugsByIndexRenderer;

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

        DrugsByIndexRenderer.render = function(cohort) {
            var id = cohort.id;
            this.baseUrl = getWebApiUrl() + 'cohortresults/' + id;
            d3.selectAll("svg").remove();

            $('#loading-text').text("Querying Database...");
            $('#spinner-modal').modal('show');


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
                                "records_per_person": data.recordsPerPerson[i],
                                "relative_risk" : data.logRRAfterBefore[i],
                                "pct_persons_after": data.percentPersonsAfter[i],
                                "pct_persons_before": data.percentPersonsBefore[i],
                                "risk_difference": data.riskDiffAfterBefore[i]
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



            function drilldown(id, name, type) {
                $('#loading-text').text("Querying Database...");
                $('#spinner-modal').modal('show');
                $("#" + type + "DrilldownScatterplot").empty();
                $("#" + type + 'DrilldownTitle').text(name);
                $.ajax({
                    type: "GET",
                    url: DrugsByIndexRenderer.baseUrl + "/cohortspecific" + type + "/" + id,
                    contentType: "application/json; charset=utf-8"
                }).done(function (result) {
                    $('#loading-text').text("Rendering Visualizations...");

                    if (result && result.length > 0) {

                        var normalized = common.dataframeToArray(common.normalizeArray(result));

                        // nest dataframe data into key->values pair
                        var totalRecordsData = d3.nest()
                            .key(function (d) {
                                return d.recordType;
                            })
                            .entries(normalized)
                            .map(function (d) {
                                return {name: d.key, values: d.values};
                            });


                        var scatter = new jnj_chart.scatterplot();
                        scatter.render(totalRecordsData, "#" + type + "DrilldownScatterplot", 900, 250, {
                            yFormat: d3.format('0%'),
                            xValue: "duration",
                            yValue: "pctPersons",
                            xLabel: "Duration Relative to Index",
                            yLabel: "% Persons",
                            seriesName : "recordType",
                            showLegend: true,
                            colors: d3.scale.category10()
                        });

                        common.generateCSVDownload($("#" + type + "DrilldownScatterplot"), result, type + "Drilldown");
                        $('#' + type + 'OccurrencesDrilldown').removeClass('hidden');

                    }

                    $('#spinner-modal').modal('hide');
                }).error(function (result) {
                    $('#spinner-modal').modal('hide');
                });
            }

            // show the treemap
            $('#loading-text').text("Querying Database...");
            $('#spinner-modal').modal('show');
            var format_pct = d3.format('.2%');
            var format_fixed = d3.format('.2f');
            var format_comma = d3.format(',');

            var width = 1000;
            var height = 250;
            var minimum_area = 50;
            var threshold = minimum_area / (width * height);

            var datatables = {};

            // bind to all matching elements upon creation
            $(document).on('click', '.treemap_table tbody tr', function () {
                $('.treemap_table tbody tr.selected').removeClass('selected');
                $(this).addClass('selected');
                var datatable = datatables[$(this).parents('.treemap_table').attr('id')];
                var data = datatable.data()[datatable.row(this)[0]];
                if (data) {
                    var did = data.concept_id;
                    var concept_name = data.name;
                    drilldown(did, concept_name, $(this).parents('.treemap_table').attr('type'));
                }
            });

            $.getJSON(this.baseUrl + '/cohortspecifictreemap', function(data) {
                $('#loading-text').text("Rendering Visualizations...");
                var table_data, datatable, tree, treemap;

                if (data.drugEraPrevalence) {
                    var drugEraPrevalence = common.normalizeDataframe(common.normalizeArray(data.drugEraPrevalence, true));
                    var drugEraPrevalenceData = drugEraPrevalence;
                    if (!drugEraPrevalenceData.empty) {
                        table_data = drugEraPrevalence.conceptPath.map(function (d, i) {
                            var conceptDetails = this.conceptPath[i].split('||');
                            return {
                                concept_id: this.conceptId[i],
                                atc1: conceptDetails[0],
                                atc3: conceptDetails[1],
                                atc5: conceptDetails[2],
                                ingredient: conceptDetails[3],
                                name: conceptDetails[3],
                                num_persons: format_comma(this.numPersons[i]),
                                percent_persons: format_pct(this.percentPersons[i]),
                                relative_risk: format_fixed(this.logRRAfterBefore[i]),
                                percent_persons_before: format_pct(this.percentPersons[i]),
                                percent_persons_after: format_pct(this.percentPersons[i]),
                                risk_difference: format_fixed(this.riskDiffAfterBefore[i])
                            };
                        }, drugEraPrevalenceData);

                        datatable = $('#drugera_table').DataTable({
                            order: [ 5, 'desc' ],
                            dom: 'T<"clear">lfrtip',
                            data: table_data,
                            columns: [
                                {
                                    data: 'concept_id'
                                },
                                {
                                    data: 'atc1'
                                },
                                {
                                    data: 'atc3',
                                    visible: false
                                },
                                {
                                    data: 'atc5'
                                },
                                {
                                    data: 'ingredient'
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
                                    data: 'relative_risk',
                                    className: 'numeric'
                                }
                            ],
                            pageLength: 5,
                            lengthChange: false,
                            deferRender: true,
                            destroy: true
                        });
                        datatables.drugera_table = datatable;

                        $('#reportDrugEras').show();

                        tree = buildHierarchyFromJSON(drugEraPrevalenceData, threshold);
                        treemap = new jnj_chart.treemap();
                        treemap.render(tree, '#drug_treemap_container', width, height, {
                            onclick: function (node) {
                                drilldown(node.id, node.name, 'drug');
                            },
                            getsizevalue: function (node) {
                                return node.num_persons;
                            },
                            getcolorvalue: function (node) {
                                return node.relative_risk;
                            },
                            getcolorrange: function() {
                                return colorbrewer.RR[3];
                            },
                            getcolorscale : function() {
                                return [-6, 0, 5];
                            },
                            getcontent: function (node) {
                                var result = '',
                                    steps = node.path.split('||'),
                                    i = steps.length - 1;
                                result += '<div class="pathleaf">' + steps[i] + '</div>';
                                result += '<div class="pathleafstat">Prevalence: ' + format_pct(node.pct_persons) + '</div>';
                                result += '<div class="pathleafstat">% Persons Before: ' + format_pct(node.pct_persons_before) + '</div>';
                                result += '<div class="pathleafstat">% Persons After: ' + format_pct(node.pct_persons_after) + '</div>';
                                result += '<div class="pathleafstat">Number of People: ' + format_comma(node.num_persons) + '</div>';
                                result += '<div class="pathleafstat">Log of Relative Risk per Person: ' + format_fixed(node.relative_risk) + '</div>';
                                result += '<div class="pathleafstat">Difference in Risk: ' + format_fixed(node.risk_difference) + '</div>';
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
                    }
                }


                $('[data-toggle="popover"]').popover();

                $('#spinner-modal').modal('hide');
            })
                .fail(function() {

                    $('#spinner-modal').modal('hide');
                });

        };

        return DrugsByIndexRenderer;
    });
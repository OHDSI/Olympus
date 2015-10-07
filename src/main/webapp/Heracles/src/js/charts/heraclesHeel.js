define(["jquery", "bootstrap", "d3","jnj_chart", "ohdsi_common", "datatables", "datatables-colvis", "colorbrewer", "tabletools"],
    function ($, bootstrap, d3, jnj_chart, common, DataTables, DataTablesColvis, colorbrewer, TableTools) {

        function HeraclesHeelRenderer() {}
        HeraclesHeelRenderer.prototype = {};
        HeraclesHeelRenderer.prototype.constructor = HeraclesHeelRenderer;

        HeraclesHeelRenderer.render = function(cohort) {
            d3.selectAll("svg").remove();

            var id = cohort.id;
            this.baseUrl = getSourceSpecificWebApiUrl() + 'cohortresults/' + id;
            $('#loading-text').text("Querying Database...");
            $('#spinner-modal').modal('show');

            $.ajax({
                type: "GET",
                url: HeraclesHeelRenderer.baseUrl + "/heraclesheel",
                contentType: "application/json; charset=utf-8"
            }).done(function (result) {
                $('#loading-text').text("Rendering Visualizations...");
                var table_data = [];
                var normalized = common.normalizeArray(result);

                if (!normalized.empty) {
                    for (var i = 0; i < normalized.attributeName.length; i++) {
                        var temp = normalized.attributeValue[i];
                        var message_type = temp.substring(0, temp.indexOf(':'));
                        var message_content = temp.substring(temp.indexOf(':') + 1);

                        // RSD - A quick hack to put commas into large numbers.
                        // Found the regexp at:
                        // https://stackoverflow.com/questions/23104663/knockoutjs-format-numbers-with-commas
                        message_content = message_content.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

                        table_data[i] = {
                            'type': message_type,
                            'content': message_content
                        };
                    }

                    var datatable = $('#heel_table').DataTable({
                        dom: 'T<"clear">lfrtip',
                        data: table_data,
                        columns: [
                            {
                                data: 'type',
                                visible: true,
                                width: 200
                            },
                            {
                                data: 'content',
                                visible: true
                            }
                        ],
                        pageLength: 15,
                        lengthChange: false,
                        deferRender: true,
                        destroy: true
                    });

                }
                $('#spinner-modal').modal('hide');
            }).error(function (result) {
                $('#spinner-modal').modal('hide');
            });

        };

        return HeraclesHeelRenderer;
    });

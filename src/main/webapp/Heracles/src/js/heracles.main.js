
require(['domReady!', 'jquery', 'bootstrap'], function (domReady, $, b) {

    $(domReady).ready(function () {
        // go back listener on cohort explorer
        $("#cohort-explorer-back").click(function () {
            $("#cohort-explorer-main").slideUp("fast", function () {
                $(".page-one").slideDown('fast', function () {
                    // clear out heracles charts for less jumpiness
                    $("#age_dist").empty();
                    $("#gender_dist").empty();

                    // reset stuff
                    $("input:checkbox").prop("checked", false);
                    $(".toggle-filter-input").val("");
                    $("#auto-filter-input").val("");
                    $("#auto-filter-div").find("label").show();


                    setTimeout(function() {
                        $("#cohorts").focus();
                    }, 300);
                });
            });

            setTimeout(function() {
                $("#cohorts").focus();
            }, 300);
        });

        // initialize bootstrap data toggle
        $("body").tooltip({selector: '[data-toggle=tooltip]'});

        // focus on input box
        setTimeout(function () {
            $(".heracles-typeahead").focus();
        }, 3000);

        $("#auto-filter-input").keyup(function() {
            if ($(this).val() === "") {
                $("#select-filter-button").text("Select all");
                $("#deselect-filter-button").text("Deselect all");
            } else {
                $("#select-filter-button").text("Select current");
                $("#deselect-filter-button").text("Deselect current");
            }
        });

        $(".toggle-filter-input").attr("placeholder", function() {
            return "Enter a list of " + ($(this).attr("toggle-filter")) + " concepts (e.g. 234,532,5,432)";
        });

        $(".toggle-filter-control").click(function() {
            var filter = $(this).attr("toggle-filter");
            var btn = $(this);
            if (btn.attr("down") === "true") {
                $(".toggle-filter-input-wrapper[toggle-filter='" + filter + "']").hide(200);
                btn
                    .removeClass("toggle-filter-active")
                    .attr("down", "false")
                    .find(".toggle-operator").text("+");
            } else {
                // take care of others
                $(".toggle-filter-input-wrapper[toggle-filter!='" + filter + "']").hide(50, function(){
                    $(".toggle-filter-control[toggle-filter!='" + filter + "']")
                        .removeClass("toggle-filter-active")
                        .attr("down", "false")
                        .find(".toggle-operator")
                        .text("+");
                });

                // take care of self
                btn.attr("down", "true");
                setTimeout(function() {
                    $(".toggle-filter-input-wrapper[toggle-filter='" + filter + "']").show("fast");
                        btn
                            .addClass("toggle-filter-active")
                            .find(".toggle-operator").text("-");
                    $(".toggle-filter-input[toggle-filter='" + filter + "']").focus();
                }, 200);
            }
        });
    });
});

require(['domReady!', 'jquery', 'bootstrap'], function (domReady, $, b) {
    $.fn.filterByText = function (textbox, selectSingleMatch) {
        return this.each(function () {
            var select = this;

            $(textbox).bind('change keyup', function () {
                //var options = $(select).empty().data('options');
                var search = $(this).val().trim();
                var regex = new RegExp(search, "gi");
                var shown = [];
                $(select).find("label").each(function () {
                    // child = <label><input type='checkbox .../></label>
                    var child = $(this);
                    /*
                     if (child.hasClass("toggle-parent-label")) {
                     return;
                     }
                     */
                    var childText = child.find("input").attr("value");
                    if (childText && childText.match(regex) !== null) {
                        child.show();
                        var parent = child.find("input").attr("parent");
                        if (parent && shown.indexOf(parent) < 0) {
                            shown.push(parent);
                        }
                    } else {
                        child.hide();
                    }
                });
                // make sure parents are shown even if they text doesn't match
                $.each(shown, function () {
                    $(".toggle-parent-label[key='" + this + "']").show();
                });
            });
        });
    };
    $.fn.multiselect = function () {
        $(this).each(function () {
            var checkboxes = $(this).find(".toggle-checkbox-item");
            checkboxes.each(function () {
                var checkbox = $(this);
                // Highlight pre-selected checkboxes
                if (checkbox.attr("checked")) {
                    checkbox.parent().addClass("multiselect-on");
                }
                // Highlight checkboxes that the user selects
                checkbox.click(function () {
                    if (checkbox.attr("checked")) {
                        checkbox.parent().addClass("multiselect-on");
                    }
                    else {
                        checkbox.parent().removeClass("multiselect-on");
                    }
                });
            });
        });
    };

    function toggleVisibleReports(checked, selector) {
        $(selector).find("input[type='checkbox']:visible").prop('checked', checked);
        angular.element($('#cohort-explorer-main')).scope().analysisClick();
        angular.element($('#cohort-explorer-main')).scope().$apply();
    }


    function split(val) {
        return val.split(/,\s*/);
    }


    $(function () {
        // init multiselect w/ checkboxes
        $(".multiselect").multiselect();

        // init filters
        $(".multiselect").each(function () {
            var filterKey = $(this).attr("filter-key");
            $(this).filterByText($(".auto-filter-check-list-input[filter-key='" + filterKey + "']"), true);
        });

        // set up auto checkbox filters
        //setup select/clear filters events
        $(".auto-filter-check-list-select").click(function() {
            toggleVisibleReports(true, ".multiselect[filter-key='" + $(this).attr("filter-key") + "']");
            return false;
        });
        $(".auto-filter-check-list-clear").click(function() {
            toggleVisibleReports(false, ".multiselect[filter-key='" + $(this).attr("filter-key") + "']");
            return false;
        });

    });


});
define(["d3", "jquery", "lodash"], function (d3, $, _) {


	function mapConceptData(data) {
		var result;

        if (data instanceof Array) {
            result = [];
            $.each(data, function() {
                var datum = {}
                datum.id = (+this.conceptId|| this.conceptName);
                datum.label = this.conceptName;
                datum.value = +this.countValue;
                result.push(datum);
            });
        }
		else if (data.countValue instanceof Array) // multiple rows, each value of each column is in the indexed properties.
		{
			result = data.countValue.map(function (d, i) {
				var datum = {}
				datum.id = (this.conceptId|| this.conceptName)[i];
				datum.label = this.conceptName[i];
				datum.value = this.countValue[i];
				return datum;
			}, data);


		} else // the dataset is a single value result, so the properties are not arrays.
		{
			result = [
				{
					id: data.conceptId,
					label: data.conceptName,
					value: data.countValue
			}];
		}

        result = result.sort(function (a, b) {
            return b.label < a.label ? 1 : -1;
        });

		return result;
	}

	function mapHistogram(histogramData) {
		// result is an array of arrays, each element in the array is another array containing information about each bar of the histogram.
		var result = new Array();
        if (!histogramData.data || histogramData.data.empty) {
            return result;
        }
		var minValue = histogramData.min;
		var intervalSize = histogramData.intervalSize;

		for (var i = 0; i <= histogramData.intervals; i++) {
			var target = new Object();
			target.x = minValue + 1.0 * i * intervalSize;
			target.dx = intervalSize;
			target.y = histogramData.data.countValue[histogramData.data.intervalIndex.indexOf(i)] || 0;
			result.push(target);
		};

		return result;
	}

	function mapMonthYearDataToSeries(data, options) {
		var defaults = {
			dateField: "x",
			yValue: "y",
			yPercent: "p"
		};

		var options = $.extend({}, defaults, options);

		var series = {};
		series.name = "All Time";
		series.values = [];
        if (data && !data.empty) {
            for (var i = 0; i < data[options.dateField].length; i++) {
                var dateInt = data[options.dateField][i];
                series.values.push({
                    xValue: new Date(Math.floor(data[options.dateField][i] / 100), (data[options.dateField][i] % 100) - 1, 1),
                    yValue: data[options.yValue][i],
                    yPercent: data[options.yPercent][i]
                });
            }
            series.values.sort(function (a, b) {
                return a.xValue - b.xValue;
            });
        }
		return [series]; // return series wrapped in an array
	}

	function mapMonthYearDataToSeriesByYear(data, options) {
		// map data in the format yyyymm into a series for each year, and a value for each month index (1-12)
		var defaults = {
			dateField: "x",
			yValue: "y",
			yPercent: "p"
		};

		var options = $.extend({}, defaults, options);

		// this function takes month/year histogram data from Achilles and converts it into a multi-series line plot
		var series = [];
		var seriesMap = {};

		for (var i = 0; i < data[options.dateField].length; i++) {
			var targetSeries = seriesMap[Math.floor(data[options.dateField][i] / 100)];
			if (!targetSeries) {
				targetSeries = {
					name: (Math.floor(data[options.dateField][i] / 100)),
					values: []
				};
				seriesMap[targetSeries.name] = targetSeries;
				series.push(targetSeries);
			}
			targetSeries.values.push({
				xValue: data[options.dateField][i] % 100,
				yValue: data[options.yValue][i],
				yPercent: data[options.yPercent][i]
			});
		}
		series.forEach(function (d) {
			d.values.sort(function (a, b) {
				return a.xValue - b.xValue;
			});
		});
		return series;
	}

	function dataframeToArray(dataframe) {
		// dataframes from R serialize into an obect where each column is an array of values.
		var keys = d3.keys(dataframe);
		var result;
		if (dataframe[keys[0]] instanceof Array) {
			result = dataframe[keys[0]].map(function (d, i) {
				var item = {};
				var container = this;
				keys.forEach(function (p) {
					item[p] = container[p][i];
				});
				return item;
			}, dataframe);
		} else {
			result = [dataframe];
		}
		return result;
	}
	
	function normalizeDataframe(dataframe) {
		// rjson serializes dataframes with 1 row as single element properties.  This function ensures fields are always arrays.
		var keys = d3.keys(dataframe);
		keys.forEach(function (key) {
			if (!(dataframe[key] instanceof Array))
			{
				dataframe[key] = [dataframe[key]];	
			}
		});
		return dataframe;
	}

    function normalizeArray(ary, numerify) {
        var obj = {};
        var keys;

        if (ary && ary.length > 0 && ary instanceof Array) {
            keys = d3.keys(ary[0]);

            $.each(keys, function() {
                obj[this] = [];
            });

            $.each(ary, function() {
                var thisAryObj = this;
                $.each(keys, function() {
                    var val = thisAryObj[this];
                    if (numerify) {
                        if (_.isFinite(+val)) {
                            val = (+val);
                        }
                    }
                    obj[this].push(val);
                });
            });
        } else {
            obj.empty = true;
        }

        return obj;
    }
	
	var module = {
		mapHistogram: mapHistogram,
		mapConceptData: mapConceptData,
		mapMonthYearDataToSeries: mapMonthYearDataToSeries,
		mapMonthYearDataToSeriesByYear: mapMonthYearDataToSeriesByYear,
		dataframeToArray: dataframeToArray,
		normalizeDataframe: normalizeDataframe,
        normalizeArray: normalizeArray
	};

	return module;
});

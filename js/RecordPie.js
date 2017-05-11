// RecordPie
var RecordPie = function () {
	// Set default values
	var width = 960,
		margin = 20,
		height = 500,
		title = 'Historical Weather Data',
		rScale = d3.scale.linear()
			.domain([-10, 110])
			.range([0, height / 2 - margin]),
		radius = 20,
		paramNumber = 4,
		encoding1 = 'Record',
		encoding2 = 'Average',
		encoding3 = 'This Year - within avg',
		encoding4 = 'This year - beyond avg',
		monthInterval = 3,
		dataType = 'Degrees',
		showLegend = true;
	var counter = 0;

	// Math to figure out where to position things since this is a circle
	var yScale = function (day, temp) { return -Math.cos(angleScale(day) * Math.PI / 180) * rScale(parseInt(temp) * radius / 20) },
		xScale = function (day, temp) { return Math.sin(angleScale(day) * Math.PI / 180) * rScale(parseInt(temp) * radius / 20) },
		angleScale = d3.scale.linear()
			.range([0, 360]);

	// var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	// var getDateNum = function (monthNum, dateNum) {
	//     var newDate = new Date(2010, monthNum, dateNum);
	//     var start = new Date(newDate.getFullYear(), 0, 0);
	//     var diff = newDate - start;
	//     var oneDay = 1000 * 60 * 60 * 24;
	//     var day = Math.floor(diff / oneDay);
	//     return day;
	// }

	// Function to actually draw the lines
	var drawRadial = function (chart, cl, data, low, high) {
		chart.selectAll('line.' + cl)
			.data(data)
			.enter().append('line')
			.attr('x1', function (d) { return xScale(d.dateNum, d[low]) })
			.attr('x2', function (d) { return xScale(d.dateNum, d[high]) })
			.attr('y1', function (d) { return yScale(d.dateNum, d[low]) })
			.attr('y2', function (d) { return yScale(d.dateNum, d[high]) })
			.attr('class', cl);
	};

	// Function returned by RecordPie
	var chart = function (selection) {
		var chartHeight = height - margin * 2;
		var chartWidth = width - margin * 2;
		var rScale = d3.scale.linear()
			.domain([-10, 110])
			.range([0, height / 2 - margin]);

		// Make graphs with expectation that there may be multiple selections
		selection.each(function (data) {
			var cityName = data.name;
			var data = data.values;
			var ele = d3.select(this);
			var svg = ele.selectAll("svg").data([data]);

			// Append static elements (i.e., only added once)
			var svgEnter = svg.enter()
				.append("svg")
				.attr('width', width)
				.attr("height", height);

			// Add origin of the circle to the svg
			var origin = svg.append('g')
				.attr('transform', 'translate(' + width * 3 / 5 + ',' + height / 2 + ')')
			angleScale.domain([0, data.length - 1]);
			var months = [];
			data.forEach(function (d, i) {
				counter += 1;
				var month = d.date.split('-')[1];
				// var monthNum = months.indexOf(month + 1);
				// var date = d.date.split('-')[0];
				d.dateNum = counter;
				var prevDaysMonth = (i === 0) ? undefined : data[i - 1].date.split('-')[1];
				if (i === 0 || month != prevDaysMonth) {
					months.push({
						month: month,
						index: i
					});
				}
			})

			// Add circles outside
			origin.selectAll('circle.axis-green')
				.data([radius * 2, radius * 3, radius * 4, radius * 5])
				.enter().append('circle')
				.attr('r', function (d) { return rScale(d) })
				.attr('class', 'axis record')



			// Change number of outputted plots depending on how much the user wants
			if (paramNumber > 0) {
				//record low and high
				drawRadial(origin, 'record', data, 'recLow', 'recHigh')
			}

			if (paramNumber > 1) {
				//avg low and high
				drawRadial(origin, 'avg', data, 'avgLow', 'avgHigh')
			}

			if (paramNumber > 2) {
				//this year's temperature
				var thisYear = data.filter(function (d) { return d.min });
				drawRadial(origin, 'year', thisYear, 'min', 'max')
			}
			if (paramNumber > 3) {
				var lowLower = data.filter(function (d) { return d.min && parseInt(d.min) < parseInt(d.avgLow) });
				drawRadial(origin, 'yearLow', lowLower, 'min', 'avgLow')
				var highHigher = data.filter(function (d) { return d.min && parseInt(d.max) > parseInt(d.avgHigh) });
				drawRadial(origin, 'yearHigh', highHigher, 'max', 'avgHigh')
			}


			var circleAxis = [0, 40, 60, 80, 100]
			circleAxis = circleAxis.map(function (d) { return { temp: d, index: 320 } })


			// Writes the text on the green circles
			origin.selectAll('text.temp')
				.data(circleAxis)
				.enter().append('text')
				.attr('x', function (d) { return xScale(d.index, d.temp) })
				.attr('y', function (d) { return yScale(d.index, d.temp) })
				.text(function (d) {
					if (dataType == 'Degrees') {
						return d.temp + '°';
					} else if (dataType == 'Percent') {
						return d.temp + '%';
					} else {
						return d.temp;
					}
				})
				.attr('class', 'temp');

			//axis lines
			var axis = origin.append('g');

			axis.selectAll('line.axis')
				.data(months)
				.enter().append('line')
				.attr('x2', function (d) { return xScale(d.index, 120) })
				.attr('y2', function (d) { return -yScale(d.index, 120) })
				.attr('class', 'axis');

			var monthLabels = months.filter((d, i) => i % monthInterval === 0)
			//month labels
			axis.selectAll('text.months')
				.data(monthLabels)
				.enter().append('text')
				.attr('x', function (d) { return xScale(d.index, 110) })
				.attr('y', function (d) { return yScale(d.index, 110) })
				.text(function (d) { return d.month })
				.attr('class', 'months');

			//center for reference
			axis.append('circle')
				.attr('r', 3)
				.attr('class', 'avg')

			//title
			svg.append('text')
				.attr('x', 30)
				.attr('y', 60)
				.text(cityName)
				.attr('class', 'title')

			//subtitle
			svg.append('text')
				.attr('x', 30)
				.attr('y', 100)
				.text(title)

			if (showLegend) {
				//create legend
				if (paramNumber == 1) {
					var legendScale = d3.scale.ordinal()
						.domain([encoding1])
						.range(['record'])
				} else if (paramNumber == 2) {
					var legendScale = d3.scale.ordinal()
						.domain([encoding1, encoding2])
						.range(['record', 'avg'])
				} else if (paramNumber == 3) {
					var legendScale = d3.scale.ordinal()
						.domain([encoding1, encoding2, encoding3])
						.range(['record', 'avg', 'beyond'])
				} else {
					var legendScale = d3.scale.ordinal()
						.domain([encoding1, encoding2, encoding3, encoding4])
						.range(['record', 'avg', 'beyond', 'year'])
				}

				// var legendScale = d3.scale.ordinal()
				// 	.domain([encoding1, encoding2, encoding3, encoding4,])
				// 	.range(['record', 'avg', 'beyond', 'year'])

				//d3-legend
				var legend = d3.legend.color()
					.shapePadding(5)
					.useClass(true)
					.scale(legendScale);


				svg.append('g')
					.attr('transform', 'translate(30,120)')
					.call(legend);
			}
		});
	};

	// Getter-setter for chart height
	chart.height = function (value) {
		if (!arguments.length) return height;
		height = value;
		return chart;
	};

	// Getter-setter for chart width
	chart.width = function (value) {
		if (!arguments.length) return width;
		width = value;
		return chart;
	};

	// Getter-setter for chart title
	chart.title = function (value) {
		if (!arguments.length) return title;
		title = value;
		return chart;
	};

	// Getter-setter for chart radius
	chart.radius = function (value) {
		if (!arguments.length) return radius;
		radius = value;
		return chart;
	};

	// Getter-setter for number of parameters the user wants encoded
	chart.paramNumber = function (value) {
		if (!arguments.length) return paramNumber;
		paramNumber = value;
		return chart;
	};

	// Getter-setter for Encoding number 1
	chart.encoding1 = function (value) {
		if (!arguments.length) return encoding1;
		encoding1 = value;
		return chart;
	};

	// Getter-setter for Encoding number 2
	chart.encoding2 = function (value) {
		if (!arguments.length) return encoding2;
		encoding2 = value;
		return chart;
	};

	// Getter-setter for Encoding number 3
	chart.encoding3 = function (value) {
		if (!arguments.length) return encoding3;
		encoding3 = value;
		return chart;
	};

	// Getter-setter for Encoding number 4
	chart.encoding4 = function (value) {
		if (!arguments.length) return encoding4;
		encoding4 = value;
		return chart;
	};

	// Getter-setter for how often user wants to see months
	chart.monthInterval = function (value) {
		if (!arguments.length) return monthInterval;
		monthInterval = value;
		return chart;
	};

	// Getter-setter for data unit
	chart.dataType = function (value) {
		if (!arguments.length) return dataType;
		dataType = value;
		return chart;
	};

	// Getter-setter for whether or not legend exists
	chart.showLegend = function (value) {
		if (!arguments.length) return showLegend;
		showLegend = value;
		return chart;
	};

	return chart;
};
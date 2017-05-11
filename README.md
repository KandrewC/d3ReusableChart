# d3ReusableChart

This repo contains the D3 javascript code to create a *reusable* circular calendar that can keep track of anything from temperatures, grades, and so forth.
Inspiration for this project can be found [here](https://bl.ocks.org/susielu/b6bdb82045c2aa8225f5). index.html is here for my own debugging purposes, so please ignore it. As I mention later on, I have added in sample data set and image of completed version to this repo. These were to help me finish the assignment as I moved between computers.

This package  is really good if you want to compare trends from from this year versus previous years (average) and against the extremes (min and max)

Before I begin talking about the chart itself, there are three libraries the client needs to import:
1. D3.js, which can be found [here](https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.js)
2. The Legend color scheme, which can be found [here](https://cdnjs.cloudflare.com/ajax/libs/d3-legend/1.3.0/d3-legend.min.js)
3. Google fonts for [Lato](https://fonts.googleapis.com/css?family=Lato:300)
4. The css file that can be found in the **css** folder

Note that if you need an example of data to use, or want to look at an image of the completed graph, these are both available in the **data** and **img** folders, respectively.

##Data
This graph is intended for organizations with a lot of chronological data, spanning at least one year (and maybe more for historical significance)
For inputted data, data should follow the following structure:

```
{
	'name': 'lorem',
	'values': [{ "date": "1-Jan", "avgLow": "24", "avgHigh": "38", "recLow": "10", "recHigh": "59", "index": 0, "max": 39, "min": 27 }]
}
```
Here is a break down of what all the inputted data consists of:
`name` is the name of the city/county/country the data comes from
`date` is the date it occurred on. The format must be date followed by a '-' followed by the first three letters of the month (first one being capitalized)
`avgLow` is the average of the `min` data points for that day over the years
`avgHigh` is the average of the `max` data points for that day over the years
`recLow` is the recorded lowest data point for that day
`recHigh` is the recorded highest data point for that day
`index` must start at 0 and increment by one for each row - D3 didn't like the date-to-number functions I made so I'm keeping this column to make it happy :(
`max` is the maximum value for that day this year
`min` is the minimum value for that day this year
######NOTE
The graph works best if there are enough data points to cover almost all of the year. If you don't have time to write that many lines, I highly recommend looking at the example data provided in the data folder.

## Methods
This graph is meant to be reusable, so here are some functions the client can use to manipulate the graph (note that if you don't specify a parameter, the current value will be returned. In addition, all of these technically *output* a chart, but client shouldn't have to worry about that. Effects are detailed below):
1. `height(integer)` allows client to specify the height of the svg
2. `width(integer)` allows client to specify the width of the svg
3. `title(string)` allows client to specify the secondary name of the plot (first one is dictated by 'name' in the data)
4. `radius(integer)` allows client to specify the radius of the circles. Essentially how 'big' the graph is. Default is `radius(20)`
5. `paramNumber(integer)` allows client to specify how many visual encodings they wanted graphed. The numbers the program takes are 1, 2, 3, and 4. Each number shows a new encoding in addition to all the previous ones. 1 shows just the record lows and highs. 2 shows the averages over each year. 3 shows the data from this year. 4. shows the data from this year, and also shows whether or not they fall within the previous averages.
6. `encodingx(string)` allows user to change the names of the encodings in the legend. x takes a value from 1 to 4
7. `monthInterval(integer)` changes how many months are shown around the graph. Takes a parameter from 1 (all months are shown) to 12 (only one is shown). Default is `monthInterval(3)` (four months are shown)
8. `dataType(string)` changes the graph to accomodate different types of data. Values it takes are 'Degrees', 'Percent', or 'none'. Default is `dataType('Degrees')`.
9. `showLegend(boolean)` affects whether or not the legend actually shows.

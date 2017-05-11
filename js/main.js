$(function() {
    d3.json('data/sampleData.json', function(error, data) {
        if (error) {
            console.error('Error getting or parsing the data.');
            throw error;
        }
        console.log(data)

        var myChart = RecordPie()
        // myChart.height(500)
        // myChart.width(500)
        myChart.title("An amazing chart")
        myChart.paramNumber(10)
        myChart.radius(10)
        myChart.dataType('Degrees')
        // myChart.color()
        var wrapper = d3.select('#vis').datum(data).call(myChart);

    
    });
})
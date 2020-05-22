dollarIndexAnalysis();

function dollarIndexAnalysis() {
    var chart;
    var opts = {
        angle: 0,
        lineWidth: 0.7,
        limitMax: 'true',
        strokeColor: 'red',
        radiusScale: 1,
        generateGradient: true,
        pointer: {
            length: 0.5, // // Relative to gauge radius
            strokeWidth: 0.03, // The thickness
            color: '#2c3e50' // Fill color
        },
        staticLabels: {
            font: "90% sans-serif", // Specifies font
            labels: [-100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100], // Print labels at these values
            color: "black", // Optional: Label text color
            fractionDigits: 0 // Optional: Numerical precision. 0=round off.
        }, // just experiment with them
        strokeColor: 'red', // to see which ones work best for you
        staticZones: [{
                strokeStyle: "#82b944",
                min: -100,
                max: -80
            }, // Yellow#a6db69
            {
                strokeStyle: "#a6db69",
                min: -80,
                max: -60
            }, // Green#a6db69
            {
                strokeStyle: "#a7cb43",
                min: -60,
                max: -40
            }, // Yellowa7cb43
            {
                strokeStyle: "#ddec12",
                min: -40,
                max: -20
            }, // Yellow
            {
                strokeStyle: "#f2c750",
                min: -20,
                max: 0
            }, // Green #f2c750
            {
                strokeStyle: "#ffc31f",
                min: 0,
                max: 20
            }, // Yellow
            {
                strokeStyle: "#ffbb00",
                min: 20,
                max: 40
            }, // Yellow #ffbb00
            {
                strokeStyle: "#ff6200",
                min: 40,
                max: 60
            }, // Green
            {
                strokeStyle: "#ff4000",
                min: 60,
                max: 80
            }, // Yellow
            {
                strokeStyle: "#ff0000",
                min: 80,
                max: 100
            }, // Yellow
        ],
        generateGradient: true,
        highDpiSupport: true,
    };
    var target = document.getElementById('dollar_index_speedometer'); // your canvas element
    var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
    gauge.minValue = -100;
    gauge.maxValue = 100; // set max gauge value
    gauge.animationSpeed = 70; // set animation speed (32 is default value)
    var x = 4;
    setInterval(gauge.set(x + 3), 500);
    // var target = document.getElementById('dollar_index_speedometer'); // your canvas element

    // randomly change value
    var randomize = 0;
    updateDollarIndexGaugeVal();

    setTimeout(function() {
        setInterval(updateDollarIndexGaugeVal, 2000);
    }, 1000);

    function updateDollarIndexGaugeVal() {
        $.getJSON("scraper/dollar_index.json", function(json) {
            try {
                randomize = parseFloat(json[json.length - 1].latest_price);
            } catch (err) {
                console.log(err);
                randomize = 0;
            }
        });
        gauge.set(randomize);
    }

    gauge.setTextField(document.getElementById("dollar_index-gauge_value"), 3);

    createDollarIndexBarChart();

    function createDollarIndexBarChart() {
        $.getJSON("scraper/dollar_index.json", function(json) {
            try {
                var today = new Date();
                var currentYear = today.getFullYear();

                var series = []
                var categories = []
                var json_data = json.slice(-100)
                $.each(json_data, function(key, value) {
                    var timeS = value.date.split(':');
                    var newTimeSerie = currentYear + '-' + timeS[1] + '-' + timeS[0] + ' ' + timeS[2] + ':' + timeS[3] + ':' + timeS[4];
                    var newDateTimeSerie = new Date(newTimeSerie);
                    var timeMinute = newDateTimeSerie.getHours() + ':' + newDateTimeSerie.getMinutes();
                    if (today.getFullYear() === newDateTimeSerie.getFullYear() && today.getMonth() === newDateTimeSerie.getMonth() && today.getDate() === newDateTimeSerie.getDate()) {
                        series.push(value.latest_price);
                        categories.push(newTimeSerie);
                    }
                })

                var options = {
                    series: [{
                        name: 'Latest Price',
                        data: series
                    }],
                    chart: {
                        type: 'bar',
                        height: 350
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    yaxis: {
                        title: {
                            text: 'Latest Price',
                        },
                        labels: {
                            formatter: function(y) {
                                return y.toFixed(3);
                            }
                        }
                    },
                    xaxis: {
                        type: 'time',
                        categories: categories,
                        labels: {
                            // format: 'HH:mm',
                            // text: 'Rally',
                            datetimeFormatter: {
                                // year: 'yyyy',
                                // month: "MMM 'yy",
                                // day: 'dd MMM',
                                hour: 'HH:mm',
                            },
                            // formatter: function (value) {
                            //     return value;
                            // },
                            // rotate: -90
                        },
                        max: 300
                    },
                    tooltip: {
                        x: {
                            show: true,
                            format: 'HH:mm'
                        }
                    }
                };

                chart = new ApexCharts(document.querySelector("#dollar_index_Chart"), options);
                chart.render();

            } catch (err) {
                console.log(err);
            }

        });
    }

    setTimeout(function() {
        setInterval(updateDollarIndexBarChart, 1000);
    }, 1000);

    function updateDollarIndexBarChart() {
        $.getJSON("scraper/dollar_index.json", function(json) {
            try {
                var today = new Date();
                var currentYear = today.getFullYear();

                var tempSeries = []
                var categories = []
                var json_data = json.slice(-100);
                $.each(json_data, function(key, value) {
                    var timeS = value.date.split(':');
                    var newTimeSerie = currentYear + '-' + timeS[1] + '-' + timeS[0] + ' ' + timeS[2] + ':' + timeS[3] + ':' + timeS[4];
                    var newDateTimeSerie = new Date(newTimeSerie);
                    var timeMinute = newDateTimeSerie.getHours() + ':' + newDateTimeSerie.getMinutes();
                    if (today.getFullYear() === newDateTimeSerie.getFullYear() && today.getMonth() === newDateTimeSerie.getMonth() && today.getDate() === newDateTimeSerie.getDate()) {
                        tempSeries.push(value.latest_price);
                        categories.push(newTimeSerie);
                    }
                })

                var series = [{
                    name: 'Latest Price',
                    data: tempSeries
                }]

                chart.updateSeries(series);
                chart.updateOptions({
                    xaxis: {
                        categories: categories
                    },
                })

            } catch (err) {
                console.log(err);
            }

        });
    }
}
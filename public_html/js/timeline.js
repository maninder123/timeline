/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
callLogTimes = [];
locationTimes = [];
window.onload = function() {
    d3.csv("data/CallLogProbe.csv", function(error1, callLogData) {
        d3.csv("data/LocationProbe.csv", function(error2, locationData) {
            d3.csv("data/ScreenProbe.csv", function(error2, screenData) {
                // console.log(callLogData, locationData);
                var i = 0;
                var previousTimestamp;
                callLogData.sort(SortByName);
                locationData.sort(SortByName);
                var startDate = new Date('2013-07-19 00:00:00'.split(' ').join('T')).getTime();
                var endDate = new Date('2013-07-20 00:00:00'.split(' ').join('T')).getTime();

                $.each(callLogData, function(index, value) {
                    // console.log(value.timestamp);
                    if (value.timestamp <= endDate / 1000 && value.timestamp >= startDate / 1000 && i > 0) {
                        var times = {
                            color: "green",
                            label: "",
                            starting_time: previousTimestamp * 1000,
                            ending_time: value.timestamp * 1000
                        };
                        callLogTimes.push(times);
                    }
                    previousTimestamp = value.timestamp;
                    i++;
                });

                $.each(locationData, function(index, value) {
                    //console.log(value.timestamp);
                    if (value.timestamp <= endDate / 1000 && value.timestamp >= startDate / 1000 && i > 0) {
                        var times = {
                            color: "pink",
                            label: "",
                            starting_time: previousTimestamp * 1000,
                            ending_time: value.timestamp * 1000
                        };
                        locationTimes.push(times);
                    }
                    previousTimestamp = value.timestamp;
                    i++;
                });


                var labelColorTestData = [
                    {id : "callLog", label: "Call Log", times: callLogTimes},
                    {id : "location",label: "Location", times: locationTimes},
                  ];
                console.log(labelColorTestData);

                var width = 700;

                function timelineLabelColor() {
                    var chart = d3.timeline()
                            .beginning(startDate) // we can optionally add beginning and ending times to speed up rendering a little
                            .ending(endDate)
                            .tickFormat({
                                format: function(d) {
                                    return d3.time.format("%H:%M")(d)
                                },
                                tickTime: d3.time.hours,
                                tickInterval: 3,
                                tickSize: 15,
                            })
                            .stack() // toggles graph stacking
                            .margin({left: 70, right: 30, top: 0, bottom: 0});
                    var svg = d3.select("#timeline").append("svg").attr("width", width)
                            .datum(labelColorTestData).call(chart);
                }
                timelineLabelColor();

            });
        });
    });

    function SortByName(a, b) {
        var a1 = a.timestamp, b1 = b.timestamp;
        if (a1 == b1)
            return 0;
        return a1 > b1 ? 1 : -1;
    }

}


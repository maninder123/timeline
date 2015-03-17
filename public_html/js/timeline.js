/**
 * This java script file reads the data from csv file and plot the timelines.
 * 
 * @version             0.0.1
 * @since 		v0.0.1
 * @access 		public
 * @author 		Maninder Singh		<manindersingh221@gmail.com> 
 */
callLogTimes = [];
smsTimes = [];
window.onload = function () {
    /* This function find the current week
     * 
     * @version             0.0.1
     * @since 		v0.0.1
     * @access 		public
     * @author 		Maninder Singh		<manindersingh221@gmail.com> 
     */
    var d1 = Date.parse('today');
    var d2 = Date.parse('today');
    if (d1.is().monday()) {
        startDate = d1
        endDate = d2.next().sunday();
    }
    else if (d1.is().sunday()) {
        startDate = d1.last().monday();
        endDate = d2;
    }
    else {
        startDate = d1.last().monday();
        console.log(startDate);
        endDate = d2.next().sunday();
    }
    //append current date
    //var Dates = new Date().getWeek();
    $(".current-week-start").text(dateFormat(startDate, "dddd, mmmm dS, yyyy"));
    $(".current-week-end").text(dateFormat(endDate, "dddd, mmmm dS, yyyy"));
    //---------------------------------------------------------------------------
//appending week days
    var day_zero = dateFormat(startDate, 'dddd, mmmm dS');
    $('.day0').text(day_zero);
    var i = 1;
    for (i = 1; i < 7; i++) {
        var week_days = startDate.next().day();
        $('.day' + i).text(dateFormat(week_days, "dddd, mmmm dS"));

    }
//  ------------------------------------------------------------------------------
    $(".previousArrow").click(function () {
        var currentWeekStart = $(".current-week-start").text();
        var currentWeekEnd = $(".current-week-end").text();
        var s1 = Date.parse(currentWeekStart);
        var e1 = Date.parse(currentWeekEnd);
        newStartDate = s1.last().monday();
        newEndDate = e1.last().sunday();

        $(".current-week-start").text(dateFormat(newStartDate, "dddd, mmmm dS, yyyy"));

        $(".current-week-end").text(dateFormat(newEndDate, "dddd, mmmm dS, yyyy"));
        //appending week days
        var day_zero_new = dateFormat(newStartDate, "dddd, mmmm dS");
        $('.day0').text(day_zero_new);
        var i = 1;
        for (i = 1; i < 7; i++) {
            var week_days_new = newStartDate.next().day();
            $('.day' + i).text(dateFormat(week_days_new, "dddd, mmmm dS"));
        }
//   timelineLabelColor();
    });

    $(".nextArrow").click(function () {
        var currentWeekStart = $(".current-week-start").text();
        var currentWeekEnd = $(".current-week-end").text();
        var s1 = Date.parse(currentWeekStart);
        var e1 = Date.parse(currentWeekEnd);
        newStartDate = s1.next().monday();
        newEndDate = e1.next().sunday();
        $(".current-week-start").text(dateFormat(newStartDate, "dddd, mmmm dS, yyyy"));
        $(".current-week-end").text(dateFormat(newEndDate, "dddd, mmmm dS, yyyy"));
        //appending week days
        var day_zero_new1 = dateFormat(newStartDate, "dddd, mmmm dS");
        $('.day0').text(day_zero_new1);
        var i = 1;
        for (i = 1; i < 7; i++) {
            var week_days_new1 = newStartDate.next().day();
            $('.day' + i).text(dateFormat(week_days_new1, "dddd, mmmm dS"));
        }
    });

    // reading the data from csv file
    d3.csv("data/CallLogProbe.csv", function (error1, callLogData) {
        d3.csv("data/SMSProbe.csv", function (error2, smsData) {
            d3.csv("data/ScreenProbe.csv", function (error2, screenData) {
                // console.log(callLogData, locationData);
                var i = 0;
                var previousTimestamp;
                callLogData.sort(SortByName);
                smsData.sort(SortByName);
                console.log(callLogData);
                console.log(smsData);
                var day1 = $(".current-week-start").text();
                var d1 = Date.parse(day1);
                var newStartDate = dateFormat(d1, "yyyy-mm-dd hh:mm:ss");
                var day2 = d1.next().day();
                var newEndDate = dateFormat(d2, "yyyy-mm-dd hh:mm:ss");
//                alert(newEndDate);

                var startDate = d1.getTime();
//                console.log(startDate);

                var endDate = day2.getTime();
                var startDate = new Date('2013-07-19 00:00:00'.split(' ').join('T')).getTime();
                var endDate = new Date('2013-07-20 00:00:00'.split(' ').join('T')).getTime();
                for(j=0; j < 7; j++){
                $.each(callLogData, function(index, value) {
                    if (value.timestamp <= endDate / 1000 && value.timestamp >= startDate / 1000 && i > 0) {
                            var times = {
                                color: "green",
                                label: "",
                                starting_time: previousTimestamp * 1000,
                                ending_time: value.timestamp * 1000
                            };
                            callLogTimes.push(times);
                            console.log(times);
                        }
                        previousTimestamp = value.timestamp;
                        i++;
                    });

                    $.each(smsData, function (index, value) {
                        //console.log(value.timestamp);
                        if (value.timestamp <= endDate / 1000 && value.timestamp >= startDate / 1000 && i > 0) {
                            var times = {
                                color: "pink",
                                label: "",
                                starting_time: previousTimestamp * 1000,
                                ending_time: value.timestamp * 1000
                            };
                            smsTimes.push(times);
                        }
                        previousTimestamp = value.timestamp;
                        i++;
                    });


                    var labelColorTestData = [
                        {id: "callLog", label: "Call Log", times: callLogTimes},
                        {id: "sms", label: "SMS", times: smsTimes},
                    ];
                    console.log(labelColorTestData);

                    var width = 700;

                    function timelineLabelColor() {
                        var chart = d3.timeline()
                                .beginning(startDate) // we can optionally add beginning and ending times to speed up rendering a little
                                .ending(endDate)
                                .tickFormat({
                                    format: function (d) {
                                        return d3.time.format("%H:%M")(d)
                                    },
                                    tickTime: d3.time.hours,
                                    tickInterval: 3,
                                    tickSize: 15,
                                })
                                .stack() // toggles graph stacking
                                .margin({left: 70, right: 30, top: 0, bottom: 0});
                        var svg = d3.select("#timeline" + j).append("svg").attr("width", width)
                                .datum(labelColorTestData).call(chart);
                    }
                    timelineLabelColor();
                }
                ;
            });
        });
    });

    /* This function will sort the data on timestamp
     * 
     * @version             0.0.1
     * @since 		v0.0.1
     * @access 		public
     * @author 		Maninder Singh		<manindersingh221@gmail.com> 
     */
    function SortByName(a, b) {
        var a1 = a.timestamp, b1 = b.timestamp;
        if (a1 == b1)
            return 0;
        return a1 > b1 ? 1 : -1;
    }
}
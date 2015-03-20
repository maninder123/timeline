
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
callLogData = new Array();
smsData = new Array();
screenData = new Array();
locationData = new Array();
var previousTimestamp;	
window.onload = function() {
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
        $('.day' + i).text(dateFormat(week_days, "dddd, mmmm dS,  yyyy"));

    }
    //  ------------------------------------------------------------------------------
    $(".previousArrow").click(function() {

        $.blockUI({css: {
                border: 'none',
                padding: '15px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .5,
                color: '#fff'
            }});

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

        drawGraph();
        $.unblockUI();
    });

    $(".nextArrow").click(function() {

        $.blockUI();
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
            $('.day' + i).text(dateFormat(week_days_new1, "dddd, mmmm dS, yyyy"));
        }

        drawGraph();
        $.unblockUI();


    });


    var drawGraph = function() {

    	function callLog(){
          $.each(callLogData, function(index, value) {
          	    
                if (value.timestamp <= endDate / 1000 && value.timestamp >= startDate / 1000) {
                    
                 	  if(value.CALLS_type==1){
                	  	  var color_graph = "green";
                	  	}
                	  	if(value.CALLS_type == 2){
                        var color_graph = "red"; 
                	  	}
                	  		if(value.CALLS_type == 3){
                        var color_graph = "blue"; 
                	  	}
                        times = {
                            color: ""+color_graph,
                            label: "",
                            starting_time: value.timestamp * 1000,
                            ending_time: value.timestamp * 1000 + value.CALLS_duration*1000
                        };
                        callLogTimes.push(times);
                        call_log_check_count++;

                }

            });
         }

       function smsLog(){
           $.each(smsData, function(index, value) {
                if (value.timestamp <= endDate / 1000 && value.timestamp >= startDate / 1000) {
                	
                	   if(value.MESSAGES_type==1){
                	  	  var color_graph = "blue";
                	  	}
                	  	if(value.MESSAGES_type == 2){
                        var color_graph = "yellow"; 
                	  	}
                        var times = {
                            color: ""+color_graph,
                            label: "",
                            starting_time: value.timestamp * 1000,
                            ending_time: value.timestamp * 1000 + 1000
                        };
                        smsTimes.push(times);
                        sms_check_count++;
                }

            });
            }
            
        function screenLog(){
        	    $.each(screenData, function(index, value) {
                if (value.timestamp <= endDate / 1000 && value.timestamp >= startDate / 1000) {
                    if (screen_check_count > 0) {
                    	  
                	   if(value.screenOn == "False"){
                	  	  var color_graph = "blue";
                	  	}
                	  	if(value.screenOn == "True"){
                        var color_graph = "yellow"; 
                	  	}
                        var times = {
                            color: ""+color_graph,
                            label: "",
                            starting_time: previousTimestamp * 1000,
                            ending_time: value.timestamp * 1000
                        };
                        screenLogTimes.push(times);
                    }
                    previousTimestamp = value.timestamp;
                    screen_check_count++;
                }

            });
        	}

        function locationLog(){
    
        	    $.each(locationData, function(index, value) {
                if (value.timestamp <= endDate / 1000 && value.timestamp >= startDate / 1000) {
                        var times = {
                            color : value.location_color,
                            label: "",
                            starting_time: value.timestamp * 1000 ,
                            ending_time: value.timestamp * 1000 + value.duration
                        };
                        locationLogTimes.push(times);
                        location_check_count++;
                }

            });
        	}
        	
        for (j = 0; j < 7; j++) {
        	
            var call_log_check_count = 0;
            var sms_check_count = 0;
            var screen_check_count = 0;
            var location_check_count = 0;
            var offset = 0;
            var times={};
            var callLogTimes= new Array();
            var smsTimes = new Array();
            var screenLogTimes = new Array();
            var locationLogTimes = new Array();
            
            $("#timeline" + j).empty();
            var startDateText = $(".day" + j).text();
            var startDateObj = Date.parse(startDateText);
            
            var startDate = startDateObj.getTime();
            var endDate = startDateObj.next().day().getTime();
            callLog();
            smsLog();
            screenLog();
            locationLog();
            
            var labelColorTestData = [
                {id: "screenLog", label: "Screen", times: screenLogTimes},
                {id: "locationLog", label: "Location", times: locationLogTimes},
                {id: "callLog", label: "Call Log", times: callLogTimes},
                {id: "sms", label: "SMS", times: smsTimes},
            ];
         


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
                var svg = d3.select("#timeline" + j).append("svg").attr("width", width)
                        .datum(labelColorTestData).call(chart);
            }
            timelineLabelColor();
        }
    }

    // reading the data from csv file
    d3.csv("data/CallLogProbe.csv", function(error1, callLog) {
        d3.csv("data/SMSProbe.csv", function(error2, smsLog) {
            d3.csv("data/ScreenProbe.csv", function(error2, screenLog) {
            	 d3.csv("data/LocationProbe.csv", function(error2, locationLog) {
            	 	
   
                callLogData = callLog.sort(SortByName);
                smsData = smsLog.sort(SortByName);
                screenData = screenLog.sort(SortByName);
                locationData = locationLog.sort(SortByName);
           
          
                var day1 = $(".current-week-start").text();
                var d1 = Date.parse(day1);
                var newStartDate = dateFormat(d1, "yyyy-mm-dd hh:mm:ss");
                var day2 = d1.next().day();
                var newEndDate = dateFormat(d2, "yyyy-mm-dd hh:mm:ss");
                drawGraph();

            });
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

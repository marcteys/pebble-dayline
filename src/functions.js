var ajax = require('ajax');
var DaysItem = require('daysItem');
var Settings = require('settings');
var DayLineWatch = require('daylineWatch');

var Functions = {
  
  timeline : null,
  mainWindow : null,
  
  initDays : function(dayFormat, rectColor, startHour, endHour) {
      this.timeline = DaysItem.init(this.mainWindow, rectColor,startHour, endHour);
  },
  
  getCalendar: function(varURL) {
    var that = this;
    ajax({url: varURL, type: 'json'},
         function(data) {
            that.fetchEvents(data);
         },
         function(error) {
           console.log('Ajax failed: ' + error);
           //TODO : Display message "error loading calendars";
         }
        );
  },

  getWeather: function(varURL) {
    var that = this;
    ajax({url: varURL, type: 'json'},
         function(data) {
            that.displayWeather(data);
         },
         function(error) {
           console.log('Ajax failed: ' + error);
         }
        );
  },
  
  displayWeather : function(data) {
   // console.log(JSON.stringify(data));
    if(data.cod === "404") DayLineWatch.updateWeatherText("No city found");
    else  DayLineWatch.updateWeatherText(Math.round(parseInt(data.main.temp)) + "°- " + data.weather[0].main);
    //                                                                         ^-- data.weather[0].description 
  },
  
  displayEventDescription : function(hour, description) {
    //do some stuff with the "hour" variable
     DayLineWatch.displayNextEventDetail(hour, description);
  },
    
  fetchEvents : function(data) {
    
    var closestEventTime = 480;
    var closestEventTimeFormat = "";
    var closestEventText = "";
    
    if(data.calendars.length !== null) {
      //function to display base events layout
      for(var i = 0,  j = data.calendars.length; i < j ; i++) {
        for(var k = 0,  m = data.calendars[i].events.length; k < m; k++) {
          if(data.calendars[i].events[k].day < 0) { 
            data.calendars[i].events[k].duration = data.calendars[i].events[k].duration + data.calendars[i].events[k].day;
            data.calendars[i].events[k].day = 0;
          }
          if( data.calendars[i].events[k].startTime < closestEventTime) {
            closestEventText = data.calendars[i].events[k].description;
            closestEventTime = data.calendars[i].events[k].startTime; //.niceStartTime
            closestEventTimeFormat =  data.calendars[i].events[k].niceStartTime;
          }
          DaysItem.createEvent(this.timeline, data.calendars[i].events[k], Settings.option('calendars')[i].color, 0);
        }
      }
      
      //TODO : Clean this function for overlaping events
    /*  for(var i = 0,  j = data.calendars.length-1; i < j ; i++) {
        for(var  k = 0,  m = data.calendars[i].events.length; k < m; k++) {
          if(data.calendars[i].events[k].day < 0) { 
            data.calendars[i].events[k].duration =  data.calendars[i].events[k].duration + data.calendars[i].events[k].day;
            data.calendars[i].events[k].day = 0;
          }
          DaysItem.createEvent(this.timeline, data.calendars[i].events[k], Settings.option('calendars')[i].color, i+1);
        }
      }*/
      
    }
    
    //TODO : Send a timestanmp, use daylineEvents to display events, refresh automatically etc
   this.displayEventDescription(closestEventTimeFormat, closestEventText);
  //  this.displayEventDescription("18:20pm", "RCA Workshop");
    this.displayTimeBar();
  },
  
  displayTimeBar : function(){
    DaysItem.displayTimeBar(this.timeline, 'red');
  },
  
  deleteEvents : function() {
    DaysItem.deleteEvents();
  },
  
  setWindow : function(window) {
    this.mainWindow = window;
    DaysItem.setWindow(window);
  }
  
};
this.exports = Functions;
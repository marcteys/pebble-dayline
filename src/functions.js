var ajax = require('ajax');
var DaysItem = require('daysItem');
var Settings = require('settings');
var DayLineWatch = require('daylineWatch');
var DayLineEvents = require('daylineEvents');
var Utils = require('utils');

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
  
  fetchEvents : function(data) {
    
    var now = new Date();
    var relativeTime = null;
    var closestEventTime = 120; // don't diplay events above 120minutes
    var closestEventTimeFormat = "";
    var closestEventText = "";
    var closestEventDate = null;
    
    if(data.calendars.length !== null) {
      //function to display base events layout
      for(var i = 0,  j = data.calendars.length; i < j ; i++) {
        for(var k = 0,  m = data.calendars[i].events.length; k < m; k++) {
          if(data.calendars[i].events[k].day < 0) { 
            data.calendars[i].events[k].duration = data.calendars[i].events[k].duration + data.calendars[i].events[k].day;
            data.calendars[i].events[k].day = 0;
          }
          relativeTime = Utils.differenceBetweenDates(now, Date.parse(data.calendars[i].events[k].startDate));
          if(relativeTime < closestEventTime ) {
            closestEventText = data.calendars[i].events[k].description;
            closestEventTime = relativeTime; //.niceStartTime
            closestEventTimeFormat = data.calendars[i].events[k].niceStartTime;
            closestEventDate = Date.parse(data.calendars[i].events[k].startDate);
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
    console.log("closestEventDate, closestEventTimeFormat, closestEventText" + closestEventDate, closestEventTimeFormat, closestEventText );
   DayLineEvents.displayEventDescription(closestEventDate, closestEventTimeFormat, closestEventText);
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
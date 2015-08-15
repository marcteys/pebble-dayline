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
    if(data.cod === "404") DayLineWatch.updateWeatherText("No city found");
    else  DayLineWatch.updateWeatherText(Math.round(parseInt(data.main.temp)) + "°- " + data.weather[0].main);
    //                                                                         ^-- data.weather[0].description 
  },
  
  fetchEvents : function(data) {
    DaysItem.deleteEvents();

    var now = new Date();
    var relativeTime = null;
    var closestEventTime = 120; // don't diplay events above 120minutes
    var closestEventTimeFormat = "";
    var closestEventText = "";
    var closestEventDate = null;
    var hasFullDayEvent = false;
    
    if(data.calendars.length !== null) {
      //function to display base events layout
      for(var i = 0,  j = data.calendars.length; i < j ; i++) {
        //TODO : if data.calendars[i].id == "overlaping", return
        for(var k = 0,  m = data.calendars[i].events.length; k < m; k++) {
          var event = data.calendars[i].events[k];
          if(event.day < 0) { 
            event.duration = event.duration + event.day;
            event.day = 0;
          }
          //Get the closest event;
          relativeTime = Utils.differenceRelativeBetweenDates( new Date(event.startDate), now);
          if(relativeTime > 0 && relativeTime < closestEventTime ) {
            closestEventText = event.description;
            closestEventTime = relativeTime;
            closestEventTimeFormat = event.niceStartTime;
            closestEventDate = new Date(event.startDate);
          }
         DaysItem.createEvent(this.timeline, event, Settings.option('calendars')[i].color, 0);
         if(!hasFullDayEvent && event.allDay === true) hasFullDayEvent = true;
        }
      }      
    }
    DayLineEvents.displayEventDescription(closestEventDate, closestEventTimeFormat, closestEventText);
    if(!hasFullDayEvent) DaysItem.removeAllDayBox();
    DaysItem.updateTimeBar(); // TODO : Move that somewhere else
  },

  deleteEvents : function() {
    DaysItem.deleteEvents();
  },
  
  setWindow : function(window) {
    this.mainWindow = window;
    DaysItem.setWindow(window);
  },
  
  clearTimeout : function() {
    if(DayLineEvents.onGoingTimeout !== null) DayLineEvents.clearTimeout(DayLineEvents.onGoingTimeout);
    if(DaysItem.timebarTimeout !== null) DaysItem.timebarTimeout(DaysItem.timebarTimeout);
  }
  
};
this.exports = Functions;
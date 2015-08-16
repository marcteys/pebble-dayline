/* global clearTimeout */
var ajax = require('ajax');
var DaysItem = require('daysItem');
var Settings = require('settings');
var DayLineWatch = require('daylineWatch');
var DayLineEvents = require('daylineEvents');
var Utils = require('utils');

var Functions = {
  
  timeline : null,
  mainWindow : null,
  calendarData : null,
  onGoingTimeout : null,

  initDays : function(dayFormat, rectColor, startHour, endHour) {
      this.timeline = DaysItem.init(this.mainWindow, rectColor,startHour, endHour);
  },
  
  getCalendar: function(varURL) {
    var that = this;
    ajax({url: varURL, type: 'json'},
         function(data) {
            that.calendarData = data;
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
  
  fetchEventsExternal : function(that) {
    console.log("a");
   // var that = this;
    console.log(that.calendarData);
    if(that.calendarData !== null ) {
      that.fetchEvents(that.calendarData);
    }
  },
  
  fetchEvents : function(data) {
    
    DaysItem.deleteEvents();
    var that = this;
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
    this.displayEventDescription(closestEventDate, closestEventTimeFormat, closestEventText);
    if(!hasFullDayEvent) DaysItem.removeAllDayBox();
    DaysItem.updateTimeBar(); // TODO : Move that somewhere else
  },
  
  displayEventDescription : function(date, niceFormat, description)
  {
   // parent.fetchEventsExternal();
    var that = this;
    var parent = this;
   if(this.onGoingTimeout !== null ) clearTimeout(this.onGoingTimeout);
    this.onGoingTimeout = setTimeout(that.fetchEventsExternal.bind(that),1000); //change 1 to 5
    var timeFormatted = this.formatTimeText(date, niceFormat,description, parent);
    if(timeFormatted !== null) DayLineWatch.displayNextEventDetail(timeFormatted, description);
  },
  
  formatTimeText : function(date, niceFormat, description, parent){
    var now = new Date();
    var that  = this;
    var difference = Utils.differenceRelativeBetweenDates(date,now);
    var textHour = niceFormat;
    
    if(difference <= 0 && difference > -5) {
       textHour = "Now";
      this.onGoingTimeout = setTimeout(function(){that.removeTextEvent(parent);},1 * 60000); //change 1 to 5
    } else if(difference == 1 && difference > -5) {
       textHour = "In " + difference + " minute";
      this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description, parent );}, 1 * 60000);
    }  else if(difference < 10 && difference > -5) {
       textHour = "In " + difference + " minutes";
      this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description, parent);}, 1 * 60000);
    } else if(difference < 30 && difference > -5) {
       textHour = "In " + difference + " minutes";
      this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description, parent);}, 5 * 60000);
    } else if(difference < 60 && difference > -5) {
       textHour = "In " + difference + " minutes";
       this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description, parent);}, 15 * 60000);
    } else if(difference < 70 && difference > -5) {
       textHour = "In 1 hour";
       this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description, parent);}, 15 * 60000);
    }  else if(difference < 120 && difference > -5) {
       textHour = niceFormat;
      this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description, parent);}, 45 * 60000);
    } else {
      textHour = null;
      DayLineWatch.removeNextEventDetail();
      this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description, parent);}, 60 * 60000);
    }

    return textHour;
  },
  

  deleteEvents : function() {
    DaysItem.deleteEvents();
  },
  
  setWindow : function(window) {
    this.mainWindow = window;
    DaysItem.setWindow(window);
  },
  
  clearTimeout : function() {
    if(DayLineEvents.onGoingTimeout !== null) clearTimeout(DayLineEvents.onGoingTimeout);
    if(DaysItem.timebarTimeout !== null) clearTimeout(DaysItem.timebarTimeout);
  }
  
};
this.exports = Functions;
/* global clearTimeout */
var ajax            = require('ajax'),
    DaysItem        = require('./daysItem'),
    Settings        = require('settings'),
    DayLineWatch    = require('./daylineWatch'),
    DayLineSettings = require('./daylineSettings'),
    Utils           = require('./utils');

function Functions() {
  this.timeline       = null;
  this.mainWindow     = null;
  this.calendarData   = null;
  this.onGoingTimeout = null;
}

Functions.prototype.initDays = function() {
    this.timeline = DaysItem.init(this.mainWindow, DayLineSettings.getBackgroundColor(),DayLineSettings.getStartHour(),DayLineSettings.getEndHour());
};

Functions.prototype.updateDays = function() {
   DaysItem.updateDays(DayLineSettings.getStartHour(),DayLineSettings.getEndHour());
};

Functions.prototype.getCalendar = function(varURL) {
  var that = this;
  ajax({url: varURL, type: 'json'},
       function(data) {
          that.calendarData = data;
          that.fetchEvents(data);
       },
       function(error) {
         console.log('Calendar ajax failed: ' + error);
       }
      );
};

Functions.prototype.getWeather = function(varURL) {
  var that = this;
  ajax({url: varURL, type: 'json'},
       function(data) {
          that.displayWeather(data);
       },
       function(error) {
         console.log('Weather ajax failed: ' + error);
       }
      );
};

Functions.prototype.displayWeather = function(data) {
  if(data.cod === "404") DayLineWatch.updateWeatherText("No city found");
  else  DayLineWatch.updateWeatherText(Math.round(parseInt(data.main.temp)) + "°- " + data.weather[0].main);
  //                                                                         ^-- data.weather[0].description 
};

Functions.prototype.fetchEventsExternal = function() {
  console.log(this.calendarData);
  if(this.calendarData !== null ) {
    this.fetchEvents(this.calendarData);
  } else {
    this.getCalendar(DayLineSettings.getApiURL());
  }
};

Functions.prototype.fetchEvents = function(data) {
  
  DaysItem.deleteEvents();
  var now                    = new Date();
  var relativeTime           = null;
  var closestEventTime       = 120; // don't diplay events above 120minutes
  var closestEventTimeFormat = "";
  var closestEventText       = "";
  var closestEventDate       = null;
  var hasFullDayEvent        = false;
  var endDate                = DayLineSettings.getEndHour();
  
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
       if(new Date(event.startDate) > endDate ) continue;
       DaysItem.createEvent(this.timeline, event, Settings.option('calendars')[i].color, 0);
       if(!hasFullDayEvent && event.allDay === true) hasFullDayEvent = true;
      }
    }      
  }
  this.displayEventDescription(closestEventDate, closestEventTimeFormat, closestEventText);
  if(!hasFullDayEvent) DaysItem.removeAllDayBox();
  DaysItem.updateTimeBar();
};

Functions.prototype.displayEventDescription = function(date, niceFormat, description)
{
 if(this.onGoingTimeout !== null ) clearTimeout(this.onGoingTimeout);
  var timeFormatted = this.formatTimeText(date, niceFormat,description);
  if(timeFormatted !== null) DayLineWatch.displayNextEventDetail(timeFormatted, description);
};

Functions.prototype.formatTimeText = function(date, niceFormat, description){
  var now = new Date();
  var that  = this;
  var difference = Utils.differenceRelativeBetweenDates(date,now);
  var textHour = niceFormat;
  
  if(difference <= 0 && difference > -5) {
     textHour = "Now";
    this.onGoingTimeout = setTimeout(function(){that.removeTextEvent();},1 * 60000); //change 1 to 5
  } else if(difference == 1 && difference > -5) {
     textHour = "In " + difference + " minute";
    this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description );}, 1 * 60000);
  }  else if(difference < 10 && difference > -5) {
     textHour = "In " + difference + " minutes";
    this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description);}, 1 * 60000);
  } else if(difference < 30 && difference > -5) {
     textHour = "In " + difference + " minutes";
    this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description);}, 5 * 60000);
  } else if(difference < 60 && difference > -5) {
     textHour = "In " + difference + " minutes";
     this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description);}, 15 * 60000);
  } else if(difference < 70 && difference > -5) {
     textHour = "In 1 hour";
     this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description);}, 15 * 60000);
  }  else if(difference < 120 && difference > -5) {
     textHour = niceFormat;
    this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description);}, 45 * 60000);
  } else {
    textHour = null;
    DayLineWatch.removeNextEventDetail();
    this.onGoingTimeout = setTimeout(function(){that.displayEventDescription(date, niceFormat, description);}, 60 * 60000);
  }
  return textHour;
};

Functions.prototype.removeTextEvent = function() {
  if(this.onGoingTimeout !== null ) clearTimeout(this.onGoingTimeout);
  DayLineWatch.removeNextEventDetail();
  this.fetchEventsExternal();
};

Functions.prototype.deleteEvents = function() {
  DaysItem.deleteEvents();
};

Functions.prototype.setWindow = function(window) {
  this.mainWindow = window;
  DaysItem.setWindow(window);
};

Functions.prototype.clearTimeout = function() {
  if(this.onGoingTimeout !== null) clearTimeout(this.onGoingTimeout);
  if(DaysItem.timebarTimeout !== null) clearTimeout(DaysItem.timebarTimeout);
};

module.exports = new Functions;
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
          relativeTime = Utils.differenceBetweenDates(now, new Date(event.startDate));
          if(relativeTime < closestEventTime ) {
            closestEventText = event.description;
            closestEventTime = relativeTime;
            closestEventTimeFormat = event.niceStartTime;
            closestEventDate = new Date(event.startDate);
          }
         DaysItem.createEvent(this.timeline, event, Settings.option('calendars')[i].color, 0);
         if(!hasFullDayEvent && event.allDay === true) hasFullDayEvent = true;
          
          //Loop not at the good position...... do that at the end 
          
          // Easier and faster to do that in php ! 
          
          /*
          var startDate = new Date(event.startDate);
          var endDate = new Date(event.endDate);
          //Loop again to check if the date is overlaping
           for(var i2 = 0; i2 < j ; i2++) {
            for(var k2 = 0; k2 < data.calendars[i2].events.length; k2++) {
              if(i !== i2 && k !== k2 && !event.allDay && !data.calendars[i2].events[k2].allDay) { // if it's not the same event
                var overlapingCount = 0;
                var overlaping = Utils.calculateOverlapingEvent(startDate,endDate, new Date(data.calendars[i2].events[k2].startDate), new Date(data.calendars[i2].events[k2].endDate));
                if(overlaping !== false) {
                  overlapingCount++;
                  var newEvent = data.calendars[i2].events[k2];
                  newEvent.startDate = overlaping.start;
                  newEvent.endDate = overlaping.end;
                  newEvent.duration = overlaping.duration;
                  console.log("event overlaping : " + newEvent.description );
                  
                  // TODO : Ne pas dessiner direct le rectangle mais le stocker dans un array, et compter si cet event possède d'autres events overlaping. 
                  DaysItem.createEvent(this.timeline, newEvent, "black", 1);
                }
              }
            } 
          }*/
        }
      }      
    }
    
    DayLineEvents.displayEventDescription(closestEventDate, closestEventTimeFormat, closestEventText);
    if(!hasFullDayEvent) DaysItem.removeAllDayBox();
    this.updateTimeBar(); // TODO : Move that somewhere else
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
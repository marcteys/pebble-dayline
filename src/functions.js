var ajax = require('ajax');
var DaysItem = require('daysItem');
var Settings = require('settings');
var daylineWatch = require('daylineWatch');

var Functions = {
  
  timeline : null,
  mainWindow : null,
  
  initDays : function(dayFormat, rectColor, dayNumber) {
      this.timeline = DaysItem.init(this.mainWindow, rectColor);
  },
  
  getCalendar: function(varURL) {
    var that = this;
    ajax({url: varURL, type: 'json'},
         function(data) {
            that.fetchEvents(data);
           console.log(JSON.stringify(data));
         },
         function(error) {
           console.log('Ajax failed: ' + error);
         }
        );
  },

  getWeather: function(varURL, textZone) {
    var that = this;
    console.log("z");
    ajax({url: varURL, type: 'json'},
         function(data) {
            that.displayWeather(data,textZone);
         },
         function(error) {
           console.log('Ajax failed: ' + error);
         }
        );
  },
  
  displayWeather : function(data,textZone) {
    daylineWatch.redrawBackground(data.temp + "° " + data.weather);
    console.log(data.weather);
    console.log(Math.round(data.temp));
  },
  
  fetchEvents : function(data) {
    if(data.calendars.length !== null) {
      for(var i = 0,  j = data.calendars.length; i < j ; i++) {
        for(var k = 0,  m = data.calendars[i].events.length; k < m; k++) {
          if(data.calendars[i].events[k].day < 0) { // filter allDay events started in the past
            data.calendars[i].events[k].duration =  data.calendars[i].events[k].duration + data.calendars[i].events[k].day;
            data.calendars[i].events[k].day = 0;
          }
          DaysItem.createEvent(this.timeline, data.calendars[i].events[k], Settings.option('calendars')[i].color);
        }
      }    
    }
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
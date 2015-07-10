var ajax = require('ajax');
var DaysItem = require('daysItem');
var Settings = require('settings');

var Cabble = {
  
  timeline : null,
  mainWindow : null,
  
  getCalendar: function(varURL) {
    var that = this;
    ajax({url: varURL, type: 'json'},
         function(data) {
            that.fetchEvents(data);
         },
         function(error) {
           console.log('Ajax failed: ' + error);
         }
        );
  },

  initDays : function(dayFormat, rectColor, dayNumber) {
      this.timeline = DaysItem.init(this.mainWindow, rectColor);
  },
  
  fetchEvents : function(data) {
    for(var i = 0,  j =data.calendars.length; i < j ; i++) {
      for(var k = 0,  m = data.calendars[i].events.length; k < m; k++) {
        if(data.calendars[i].events[k].day < 0) { // filter allDay events started in the past
          data.calendars[i].events[k].duration =  data.calendars[i].events[k].duration + data.calendars[i].events[k].day;
          data.calendars[i].events[k].day = 0;
        }
        DaysItem.createEvent(this.timeline, data.calendars[i].events[k], Settings.option('calendars')[i].color);
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
this.exports = Cabble;
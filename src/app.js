var UI = require('ui');
var Settings = require('settings');

var Functions = require('functions');
var DayLineWatch = require('daylineWatch');
var DayLineSettings = require('daylineSettings');

var App = {
  
  mainWindow: null,
  customMessage : null,
  refreshTimeout : null,
  
  init:function() {
    if(this.mainWindow === null) this.mainWindow = new UI.Window({fullscreen : true });
    DayLineWatch.init(this.mainWindow, DayLineSettings.getBackgroundColor(), DayLineSettings.getDominantColor(),DayLineSettings.getTextColor(), DayLineSettings.getTimeFormat(), DayLineSettings.getDayTop());
    Functions.setWindow(this.mainWindow);
    this.initSettings();
    
    if(Settings.option('refresh_token') === undefined) {
      DayLineWatch.displayMessage("Open Pebble app to setup.");
    } else {
      this.initCalendar();
    }
  },
  
  initCalendar : function() {
    Functions.initDays(DayLineSettings.getDayFormat(),DayLineSettings.getBackgroundColor());
    this.updateCalendar();
    this.updateWeather();
  },
  
  updateWeather : function() {
    Functions.getWeather(DayLineSettings.getWeatherURL());
  },
  
  updateCalendar : function() {
    Functions.getCalendar( DayLineSettings.getApiURL());
    this.scheduleWakeup(15);
    this.removeMessage(this.customMessage, 0);
  },
  
  initSettings : function() {
    var that = this;
    DayLineSettings.setLocalisation();
  //  that.displayMessage("waiting for update");
    DayLineWatch.updateWeatherText("Select a city");
    Settings.config(
      { url: DayLineSettings.getSettingsURL() },
      function(e) {
        if (e.failed) {
      //    this.displayMessage("Failed to load the calendar : " + DayLineSettings.getSettingsURL());
          console.log("Error for : " +  DayLineSettings.getSettingsURL() + " "+ e.response);
        } else {
          //Functions.deleteEvents();
          Settings.option('refresh_token', e.options.refresh_token);
          Settings.option('background', e.options.background);
          Settings.option('dominant', e.options.dominant);
          Settings.option('textcol', e.options.textcol);
          Settings.option('calendars', e.options.calendars);
          Settings.option('timeformat', e.options.timeformat);
          Settings.option('daytop', e.options.daytop);
          Settings.option('weather', e.options.weather);
          
          // TODO : Not destroy everything !!
          
         // CabbleWatch.redrawBackground(e.options.background);
        //  that.initCalendar();
          that.destroy();
          that.init();
        }
      }
    );
  },
  
  destroy: function(time) {
   this.mainWindow.each(function(element) {
     element.remove();
   });
  },

  scheduleWakeup: function(time) {
    /* 
    * Do not use setTimout // find an other solution
    * 
    * var that = this;
    this.refreshTimeout = setTimeout(that.updateCalendar, time * 60000);*/
  },

};
this.exports = App;
App.init();
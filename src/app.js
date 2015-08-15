/* global clearTimeout */
var UI = require('ui');
var Settings = require('settings');
var Functions = require('functions');
var DayLineWatch = require('daylineWatch');
var DayLineSettings = require('daylineSettings');
// BUG : GPS NOT WORKING !
// TODO : Callback on GS location found
// http://half4.com/cabble/cabble.php?page=settings&project=dayline&%7B%22gps%22%3A%7B%22longitude%22%3A-77.4875%2C%22latitude%22%3A39.0437%2C%22accuracy%22%3A1000%7D%7D&return_to=https%3A//cloudpebble.net/ide/emulator/config%3F#%7B%22gps%22%3A%7B%22longitude%22%3A-77.4875%2C%22latitude%22%3A39.0437%2C%22accuracy%22%3A1000%7D%7D

var App = {
  
  mainWindow: null,
  refreshTimeout : null,
  
  init:function() {
    if(this.mainWindow === null) this.mainWindow = new UI.Window({fullscreen : true });
    DayLineWatch.init(this.mainWindow, DayLineSettings.getBackgroundColor(), DayLineSettings.getDominantColor(),DayLineSettings.getTextColor(), DayLineSettings.getTimeFormat(), DayLineSettings.getDayTop());
    Functions.setWindow(this.mainWindow);
    this.initSettings();
    if(Settings.option('refresh_token') === undefined) {
      DayLineWatch.displayNextEventDetail("Error","Open Pebble app to setup.");
    } else {
      this.initCalendar();
    }
  },
  
  initCalendar : function() {
    Functions.initDays(DayLineSettings.getDayFormat(),DayLineSettings.getBackgroundColor(),DayLineSettings.getStartHour(),DayLineSettings.getEndHour());
    this.updateCalendar();
    this.updateWeather();
  },
  
  updateWeather : function() {
    Functions.getWeather(DayLineSettings.getWeatherURL());
  },
  
  updateCalendar : function() {
    Functions.getCalendar(DayLineSettings.getApiURL());
    this.scheduleWakeup(DayLineSettings.getRefreshRate());
  },
  
  initSettings : function() {
    var that = this;
    DayLineSettings.setLocalisation(that.updateWeather);
    DayLineWatch.updateWeatherText("Select a city");
    Settings.config(
      { url: DayLineSettings.getSettingsURL() },
      function(e) {
        if (e.failed) {
          console.log("Error for : " +  DayLineSettings.getSettingsURL() + " "+ e.response);
        } else {
          Settings.option('refresh_token', e.options.refresh_token);
          Settings.option('background', e.options.background);
          Settings.option('dominant', e.options.dominant);
          Settings.option('textcol', e.options.textcol);
          Settings.option('calendars', e.options.calendars);
          Settings.option('timeformat', e.options.timeformat);
          Settings.option('daytop', e.options.daytop);
          Settings.option('weather', e.options.weather);
          Settings.option('starthour', e.options.starthour);
          Settings.option('endhour', e.options.endhour);
          Settings.option('refreshrate', e.options.refreshrate);
          Functions.deleteEvents();
          that.destroy();
          that.init();
        }
      }
    );
  },
  
  destroy: function(callback) {
   this.mainWindow.each(function(element) {
     element.remove();
   });
    Functions.clearTimeout();
    if(this.refreshTimeout !== null) clearTimeout(this.refreshTimeout);
  },

  scheduleWakeup: function(time) {
    var that = this;
    if(this.refreshTimeout !== null) clearTimeout(this.refreshTimeout);
    this.refreshTimeout = setTimeout(function()  {
       Functions.deleteEvents();
       that.updateWeather();
       that.updateCalendar();
    }, time * 60000);
  },
};
this.exports = App;
App.init();
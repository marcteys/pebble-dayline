var UI = require('ui');
var Vector2 = require('vector2');
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
    DayLineWatch.init(this.mainWindow, DayLineSettings.getBackgroundColor(), DayLineSettings.getDominantColor(), DayLineSettings.getTimeFormat(), DayLineSettings.getDayTop());
    Functions.setWindow(this.mainWindow);
    this.initSettings();
    
    if(Settings.option('refresh_token') === undefined) {
      this.displayMessage("Open Pebble app to setup the watchface");
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
  
  displayMessage : function(message) {
    this.removeMessage(this.customMessage, 400);
    //TODO : if removeMessage exists, animate it. 
    var messagePos = new Vector2(-144, 110);
    this.customMessage =  new UI.Text ({
      position: messagePos,
      size: new Vector2(144, 50),
      font: 'gothic-18',
      textAlign : 'center',
      text: message,
      color : DayLineSettings.getDominantColor(),
    });
    this.mainWindow.add(this.customMessage);
    
    messagePos.x = 0;
    this.customMessage.animate('position', messagePos, 400);
  },
  
  removeMessage : function(element, speed){
   if(element) {
     var pos = element.position();
     pos.x = 144;
     element.animate('position', pos, 400).queue(function() {
       element.remove();
     });
   } 
  },

  initSettings : function() {
    var that = this;
    DayLineSettings.setLocalisation();
  //  that.displayMessage("waiting for update");
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
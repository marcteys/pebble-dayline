var UI = require('ui');
var Vector2 = require('vector2');
var Settings = require('settings');

var Cabble = require('cabble');
var CabbleWatch = require('cabbleWatch');
var CabbleSettings = require('cabbleSettings');

//TODO : Weather 
// http://api.openweathermap.org/data/2.5/forecast/daily?q=London&units=metric&cnt=7

var App = {
  
  mainWindow: null,
  customMessage : null,
  refreshTimeout : null,
  
  init:function() {
    if(this.mainWindow === null) this.mainWindow = new UI.Window({fullscreen : true });
    CabbleWatch.init(this.mainWindow, CabbleSettings.getBackgroundColor(), CabbleSettings.getDominantColor(), CabbleSettings.getTimeFormat(), CabbleSettings.getDayTop());
    Cabble.setWindow(this.mainWindow);
    this.initSettings();
    
    if(Settings.option('refresh_token') === undefined) {
      this.displayMessage("Open Pebble app to setup the watchface");
    } else {
      this.initCalendar();
    }
  },
  
  initCalendar : function() {
    Cabble.initDays(CabbleSettings.getDayFormat(),CabbleSettings.getDominantColor(), CabbleSettings.getDayNumber());
    this.updateCalendar();
  },
  
  updateCalendar : function() {
    Cabble.getCalendar( CabbleSettings.getApiURL());
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
      color : CabbleSettings.getDominantColor(),
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
  //  that.displayMessage("waiting for update");
    Settings.config(
      { url: CabbleSettings.getSettingsURL() },
      function(e) {
        if (e.failed) {
          this.displayMessage("Failed to load the calendar : " + CabbleSettings.getSettingsURL());
          console.log("Error for : " +  CabbleSettings.getSettingsURL() + " "+ e.response);
        } else {
          //Cabble.deleteEvents();
          Settings.option('refresh_token', e.options.refresh_token);
          Settings.option('background', e.options.background);
          Settings.option('dominant', e.options.dominant);
          Settings.option('calendars', e.options.calendars);
          Settings.option('timeformat', e.options.timeformat);
          Settings.option('daytop', e.options.daytop);
          CabbleWatch.redrawBackground(e.options.background);
          that.initCalendar();
         // that.destroy();
        //  that.init();
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
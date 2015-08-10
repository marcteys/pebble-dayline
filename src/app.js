var UI = require('ui');
var Settings = require('settings');
var Wakeup = require('wakeup');
var Functions = require('functions');
var DayLineWatch = require('daylineWatch');
var DayLineSettings = require('daylineSettings');
// BUG : GPS NOT WORKING !
// http://half4.com/cabble/cabble.php?page=settings&project=dayline&%7B%22gps%22%3A%7B%22longitude%22%3A-77.4875%2C%22latitude%22%3A39.0437%2C%22accuracy%22%3A1000%7D%7D&return_to=https%3A//cloudpebble.net/ide/emulator/config%3F#%7B%22gps%22%3A%7B%22longitude%22%3A-77.4875%2C%22latitude%22%3A39.0437%2C%22accuracy%22%3A1000%7D%7D

// TODO : When Settings. is closed, refresh the app with destroy.
// When it' a regular wakeup, destroy only the events on the right,
// at the end of the ajax getCalendar is loaded.

/*TODO Overlaping events 
Calculer les overlaping events directement 
Utiliser une fonction dans Utils. 
http://stackoverflow.com/questions/22784883/check-if-more-than-two-date-ranges-overlap
Pour cahque overla^ping event, créer un novueau petit en JS, qui prend la date de début d'overlaping, la date de fin d'overlaping et la couleur de l'event (+allDay = false)
Ne pas faire d'overlaping quand l'event est allday ? A tester ! (peut etre que ça marche quand même, avec l'évènement au fond)
Pour débug : Tracer le timestamp en console.log() au début du process et a la fin, voir combien de temps ça prend. 
*/

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
    var that = this;
    console.log("update calendar");
    Functions.getCalendar( DayLineSettings.getApiURL());
  //  this.scheduleWakeup(2); // TODO : TO remove
   // DayLineWatch.displayNextEventDetail("DayLineWatch.customMessage, 0");

    //WIP Launch Event
    var today = new Date();
    var newDateObj = new Date(today.getTime() + 1*60000);
    console.log('date ' +  newDateObj.getTime());
    //    number of seconds --------------------------^
    Wakeup.cancel('all');
    console.log("Current date :" + today.getTime() +" , set date :" + newDateObj.getTime());
    Wakeup.schedule(
      {
        // Set the wakeup event for one minute from now
        //time: Date.now() / 1000 + 60,
    //    time: newDateObj.getTime(),
        time :  today.getTime() + 1000 * 60,
        data: { hello: 'world' }
      },
      function(e) {
        if (e.failed) {
          console.log('Wakeup set failed: ' + e.error);
        } else {
          console.log('Wakeup set! Event ID: ' + e.id);
        }
      }
    );

  },
  
  initSettings : function() {
    var that = this;
    DayLineSettings.setLocalisation();
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
          // TODO : Not destroy everything !!
         // CabbleWatch.redrawBackground(e.options.background);
         Functions.deleteEvents();
       //  that.initCalendar();
          that.destroy();
          that.init();
        }
      }
    );
  },
  
  destroy: function(callback) {
    console.log("Destroy app");
   this.mainWindow.each(function(element) {
     element.remove();
   });
        console.log("Destroyed");
  },

  scheduleWakeup: function(time) {
    /* 
    * Do not use setTimout // find an other solution
    * 
    */
    /*
    var that = this;
    this.refreshTimeout = setTimeout(function()  {
       Functions.deleteEvents();
       that.updateCalendar();
    }, (time * 60000) / 6 );*/
  },

};
this.exports = App;
App.init();


  Wakeup.launch(function(e) {
    if (e.wakeup) {
      console.log('Woke up to ' + e.id + '! data: ' + JSON.stringify(e.data));
      App.updateCalendar();
    } else {
      console.log('Regular launch not by a wakeup event.');
    }
  });
  

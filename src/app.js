/* global clearTimeout */
var UI              = require('ui'),
    Settings        = require('settings'),
    Functions       = require('./functions'),
    DayLineWatch    = require('./daylineWatch'),
    DayLineSettings = require('./daylineSettings');
// BUG : GPS NOT WORKING !
// TODO : Callback on GS location found
// http://half4.com/cabble/cabble.php?page=settings&project=dayline&%7B%22gps%22%3A%7B%22longitude%22%3A-77.4875%2C%22latitude%22%3A39.0437%2C%22accuracy%22%3A1000%7D%7D&return_to=https%3A//cloudpebble.net/ide/emulator/config%3F#%7B%22gps%22%3A%7B%22longitude%22%3A-77.4875%2C%22latitude%22%3A39.0437%2C%22accuracy%22%3A1000%7D%7D


function App() {
  this.mainWindow = null;
  this.refreshTimeout = null;
  this.caca = 10;
  this.init();
}

App.prototype.init = function() {
    if(this.mainWindow === null) this.mainWindow = new UI.Window({fullscreen : true });
    DayLineWatch.init(this.mainWindow, DayLineSettings.getBackgroundColor(), DayLineSettings.getDominantColor(),DayLineSettings.getTextColor(), DayLineSettings.getTimeFormat(), DayLineSettings.getDayTop());
    Functions.setWindow(this.mainWindow);
    this.initSettings();
    if(Settings.option('refresh_token') === undefined) {
      DayLineWatch.displayNextEventDetail("Initialize","Open Pebble app.");
    } else {
      this.initCalendar();
    }
};

App.prototype.initCalendar = function() {
  Functions.initDays();
  this.updateCalendar();
  this.updateWeather();
};

App.prototype.updateWeather = function() {
  Functions.getWeather(DayLineSettings.getWeatherURL());
};

App.prototype.updateCalendar = function() {
  this.scheduleWakeup(DayLineSettings.getRefreshRate());
  Functions.updateDays();
  Functions.getCalendar(DayLineSettings.getApiURL());
};

App.prototype.initSettings = function() {
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
        if(Settings.option('weather').type === "gps") {
          DayLineSettings.prototype.setLocalisation(that.updateWeather());
        }
        that.destroy();
        that.init();
      }
    }
  );
};

App.prototype.destroy = function(callback) {
 this.mainWindow.each(function(element) {
   element.remove();
 });
  Functions.clearTimeout();
  if(this.refreshTimeout !== null) clearTimeout(this.refreshTimeout);
};

App.prototype.scheduleWakeup = function(time) {
  var that = this;
  if(this.refreshTimeout !== null) clearTimeout(this.refreshTimeout);
  this.refreshTimeout = setTimeout(function()  {
     Functions.deleteEvents();
     that.updateWeather();
     that.updateCalendar();
  }, time * 60000);
};

new App();
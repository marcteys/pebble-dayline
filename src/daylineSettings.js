var Settings = require('settings');

var DayLineSettings = {

  baseUrl : "http://half4.com/cabble/cabble.php?",
  weatherURL : "http://api.openweathermap.org/data/2.5/weather?",
//TODO : Weather 
// http://api.openweathermap.org/data/2.5/forecast/daily?q=London&units=metric&cnt=7

  isSettingsInit : function () {
    if(Settings.option('calendars')  !== undefined) return true;
    if(Settings.option('refresh_token')  !== undefined) return true;
    else return false;
  },

  getSettingsURL : function() {
    var settingsUrl = this.baseUrl + "page=settings&project=dayline&";
    if(this.isSettingsInit) {
      settingsUrl += encodeURIComponent(JSON.stringify(Settings.option()));
    }
    return settingsUrl;
  },
  
  getApiURL : function() {
    var apiUrl = this.baseUrl + "page=api";
    if(this.isSettingsInit()) {
      apiUrl +='&refresh_token='+   Settings.option('refresh_token');
      var calendars = Settings.option('calendars');
      apiUrl +='&calendar=';
      for(var i =0; i < calendars.length; i++) {
        if( i > 0 ) apiUrl += ',';
        apiUrl += calendars[i].name;
      }
    }
    apiUrl += '&days=1';
    apiUrl += '&callback=?';
    return apiUrl;
  },
  
  getWeatherURL : function() {
    var weatherURL = this.weatherURL;
    var weather = null;
    if(Settings.option('weather')  !== undefined) {
      weather = Settings.option('weather');
      if(weather.type == "gps" && (Settings.option('gps')  !== undefined)) {

        var storedLocation = Settings.option('gps');
                        console.log("w " + JSON.stringify(storedLocation));

        weatherURL += "lat="+storedLocation.latitude+"&lon="+storedLocation.longitude+"";
      } else  if(weather.type == "location") {
        weatherURL += "q=" +  weather.city;
      } else {
        //error, no location set
      }
      if(weather.unit === "f") weatherURL += "&units=imperial";
      if(weather.unit === "c") weatherURL += "&units=metric";
    }
    console.log(weatherURL);
    return weatherURL;
  },
  
  setLocalisation : function() {
    var locationSuccess = function (pos) {
    var coordinates = pos.coords;
        console.log('location : ' + coordinates.latitude + ', ' + coordinates.longitude);
        console.log("s " + JSON.stringify(pos.coords));
        Settings.option("gps", pos.coords);
    };
    var locationError = function (err) {
      console.warn('location error (' + err.code + '): ' + err.message);
    };
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {maximumAge:0, timeout:1000, enableHighAccuracy:true});
    } else {
      console.log('No geolocation');
    }
  },
  
  getBackgroundColor : function() {
    var backgroundColor = 'white';
    if(Settings.option('background')  !== undefined) backgroundColor = Settings.option('background');
    return backgroundColor;
  }, 
  getDominantColor : function() {
    var dominantColor = 'orange';
    if(Settings.option('dominant')  !== undefined) dominantColor = Settings.option('dominant');
    return dominantColor;
  },
  
  getTextColor : function() {
    var textCol = 'black';
    if(Settings.option('textcol')  !== undefined) textCol = Settings.option('textcol');
    return textCol;
  },
  
  getTimeFormat : function() {
    var timeformat = '12';
    if(Settings.option('timeformat')  !== undefined) timeformat = Settings.option('timeformat');
    return timeformat;
  },
  
  getDayFormat : function() {
    var dayFormat = 'num';
    if(Settings.option('dayformat')  !== undefined) dayFormat = Settings.option('dayformat');
    return dayFormat;
  },
  
  getDayTop : function() {
    var dayTop = true;
    if(Settings.option('daytop')  !== undefined) dayTop = Settings.option('daytop');
    return dayTop;
  }

};
this.exports = DayLineSettings;
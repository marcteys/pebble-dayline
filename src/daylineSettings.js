var Settings = require('settings');

function DayLineSettings() {
  this.baseUrl    = "http://half4.com/cabble/cabble.php?";
  this.weatherURL = "http://api.openweathermap.org/data/2.5/weather?";
}

DayLineSettings.prototype.isSettingsInit = function () {
  if(Settings.option('calendars')  !== undefined) return true;
  if(Settings.option('refresh_token')  !== undefined) return true;
  else return false;
};

DayLineSettings.prototype.getSettingsURL = function() {
  var settingsUrl = this.baseUrl + "page=settings&project=dayline&";
  if(this.isSettingsInit) {
    settingsUrl += encodeURIComponent(JSON.stringify(Settings.option()));
  }
  return settingsUrl;
};

DayLineSettings.prototype.getApiURL = function() {
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
  apiUrl += "&timeformat=" + this.getTimeFormat();
  apiUrl += "&starthour=" + this.getStartHour().getHours();
  apiUrl += "&endhour=" + this.getEndHour().getHours();
  apiUrl += '&callback=?';
  console.log(apiUrl);
  return apiUrl;
};

DayLineSettings.prototype.getWeatherURL = function() {
  var weatherURL = this.weatherURL;
  var weather = null;
  if(Settings.option('weather')  !== undefined) {
    weather = Settings.option('weather');
    if(weather.type == "gps" && (Settings.option('gps')  !== undefined)) {
      var storedLocation = Settings.option('gps');
    // console.log("w " + JSON.stringify(storedLocation));
      weatherURL += "lat="+storedLocation.latitude+"&lon="+storedLocation.longitude+"";
    } else  if(weather.type == "location") {
      weatherURL += "q=" +  weather.city;
    } else {
      //error, no location set
    }
    if(weather.unit === "f") weatherURL += "&units=imperial";
    if(weather.unit === "c") weatherURL += "&units=metric";
  }
//  console.log(weatherURL);
  return weatherURL;
};

DayLineSettings.prototype.setLocalisation = function(callback) {
  var locationSuccess = function (pos) {
      var coordinates = pos.coords;
      console.log('location : ' + coordinates.latitude + ', ' + coordinates.longitude);
      Settings.option("gps", pos.coords);
      if(callback) callback();
  };
  var locationError = function (err) {
    console.warn('location error (' + err.code + '): ' + err.message);
  };
  if (navigator && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {maximumAge:0, timeout:1000, enableHighAccuracy:true});
    return true;
  } else {
    console.log('No geolocation');
    return false;
  }
};

DayLineSettings.prototype.getBackgroundColor = function() {
  var backgroundColor = 'white';
  if(Settings.option('background')  !== undefined) backgroundColor = Settings.option('background');
 return backgroundColor;
};

DayLineSettings.prototype.getDominantColor = function() {
  var dominantColor = 'orange';
  if(Settings.option('dominant')  !== undefined) dominantColor = Settings.option('dominant');
  return dominantColor;
};

DayLineSettings.prototype.getTextColor = function() {
  var textCol = 'black';
  if(Settings.option('textcol')  !== undefined) textCol = Settings.option('textcol');
  return textCol;
};

DayLineSettings.prototype.getTimeFormat = function() {
  var timeformat = '24';
  if(Settings.option('timeformat')  !== undefined) timeformat = Settings.option('timeformat');
  return timeformat;
};

DayLineSettings.prototype.getDayFormat = function() {
  var dayFormat = 'num';
  if(Settings.option('dayformat')  !== undefined) dayFormat = Settings.option('dayformat');
  return dayFormat;
};

DayLineSettings.prototype.getDayTop = function() {
  var dayTop = true;
  if(Settings.option('daytop')  !== undefined) dayTop = Settings.option('daytop');
  return dayTop;
};

DayLineSettings.prototype.getStartHour = function()
{
  var startHour = '8';
  if(Settings.option('starthour')  !== undefined) startHour = Settings.option('starthour');
  
  var d = new Date();
  d.setHours(startHour,0,0,0);
  return d;
};

DayLineSettings.prototype.getEndHour = function() {
 var endHour = '18';
  if(Settings.option('endhour')  !== undefined) endHour = Settings.option('endhour');
  
  var d = new Date();
  d.setHours(endHour,0,0,0);
  return d;
};

DayLineSettings.prototype.getRefreshRate= function() {
  var refresh = '120';
  if(Settings.option('refreshrate')  !== undefined) refresh = Settings.option('refreshrate');
  return refresh;
};
module.exports = new DayLineSettings;
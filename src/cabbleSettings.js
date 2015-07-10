var Settings = require('settings');

var CabbleSettings = {

  baseUrl : "http://half4.com/cabble/cabble.php?",

  isSettingsInit : function () {
    if(Settings.option('calendars')  !== undefined) return true;
    if(Settings.option('refresh_token')  !== undefined) return true;
    else return false;
  },

  getSettingsURL : function() {
    var settingsUrl = this.baseUrl + "page=settings&";
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
this.exports = CabbleSettings;
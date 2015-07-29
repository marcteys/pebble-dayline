var UI = require('ui');
var Vector2 = require('vector2');

var DayLineWatch = {

  window : null,
  textfield : null,
  backgroundRect : null,
  rightBar : null,
  weatherText : null,
  nextEventTitle : null,
  nextEventText : null,
  colors : {},
  
  init: function(mainWindow, backgroundColor, dominantColor, textColor, timeFormat, dayTop) {
    var that = this;
    this.colors.textColor = textColor;
    this.window = mainWindow;
    
    this.backgroundRect = new UI.Rect({
      size: new Vector2(144, 168),
      backgroundColor : backgroundColor
    });
    mainWindow.add(this.backgroundRect);
    
    this.rightBar = new UI.Rect({
      size: new Vector2(30, 168),
      position: new Vector2(114, 0),
      backgroundColor : dominantColor
    });
    mainWindow.add(this.rightBar);
 
    var formatString = '%I:%M';
    var timePosition = new Vector2(0, 62);
    if(timeFormat == "24") formatString = '%H:%M';
    if(!dayTop) timePosition = new Vector2(0, 62);
    
    this.textfield =  new UI.TimeText ({
      position: timePosition,
      size: new Vector2(114, 50),
   //   font: 'bitham-42-light',
      //LECO_38_BOLD_NUMBERS
      font: 'leco-36-bold-numbers',
      text: formatString,
      textAlign : 'center',
      color : that.colors.textColor
    });
    mainWindow.add(this.textfield);
    
    if(dayTop) {
     var dayText =  new UI.TimeText ({
        position: new Vector2(8, 4),
        size: new Vector2(50, 30),
        font: 'gothic-18-bold',
        text: '%a %d',
        textAlign : 'left',
        color : that.colors.textColor
      });
      mainWindow.add(dayText);
    }
    
   this.updateWeatherText("Loading...");
    
    mainWindow.show();
  },
  
  redrawBackground : function(newColor) {
    this.window.remove(this.backgroundRect);
    this.backgroundRect = new UI.Rect({
        size: new Vector2(114, 168),
        backgroundColor : newColor
    });
    this.window.insert(0,this.backgroundRect);
  },
  
  updateWeatherText : function(weatherText)
  {
    if(this.weatherText !== null) {
      this.weatherText.remove();
    }
    var that = this;
    this.weatherText =  new UI.TimeText ({
      position: new Vector2(8, 23),
      size: new Vector2(110, 30), // 114 - 30
      font: 'gothic-18',
      text: weatherText,
      textAlign : 'left',
      color : that.colors.textColor
    });
    this.window.add(this.weatherText);
  },
  
  displayNextEventDetail : function(title, message) {
    var that = this;
    if(this.nextEventText !== null) {
      this.nextEventTitle.remove();
      this.nextEventText.remove();
    }
    
    this.nextEventTitle =  new UI.Text ({
      position: new Vector2(8, 125),
      size: new Vector2(110, 50),
      font: 'gothic-14-bold',
      textAlign : 'left',
      text: title,
      color : that.colors.textColor
    });
    this.window.add(this.nextEventTitle);
    
    this.nextEventText =  new UI.Text ({
      position: new Vector2(8, 142),
      size: new Vector2(110, 50),
      font: 'gothic-14',
      textAlign : 'left',
      text: message,
      color : that.colors.textColor
    });
    this.window.add(this.nextEventText);
    
  },
  
  removeNextEventDetail : function()
  {
    if(this.nextEventText !== null) {
      this.nextEventTitle.remove();
      this.removeMessage(this.nextEventText, 400);
    }    
  },
  
  
  
};
this.exports = DayLineWatch;
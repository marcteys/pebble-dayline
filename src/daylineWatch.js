var UI = require('ui');
var Vector2 = require('vector2');

var DayLineWatch = {

  window : null,
  textfield : null,
  backgroundRect : null,
  rightBar : null,
  weatherText : null,
  colors : {},
  customMessage : null,
  
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

    var calendarIcon = new UI.Image({
      size: new Vector2(21, 24),
      position: new Vector2(119, 6),
      image : 'images/calendar-icon.png',
      compositing : 'set'
    });

    mainWindow.add(calendarIcon);
 
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
        position: new Vector2(6, 4),
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
    console.log("Display weather");
    this.weatherText =  new UI.TimeText ({
      position: new Vector2(6, 23),
      size: new Vector2(114, 30),
      font: 'gothic-18',
      text: weatherText,
      textAlign : 'left',
      color : that.colors.textColor
    });
    this.window.add(this.weatherText);
  },
  
  displayMessage : function(message) {
    var that = this;
    
    this.removeMessage(this.customMessage, 400);
    var messagePos = new Vector2(-144, 110);
    this.customMessage =  new UI.Text ({
      position: messagePos,
      size: new Vector2(114, 50),
      font: 'gothic-18',
      textAlign : 'center',
      text: message,
      color : that.colors.textColor
    });
    this.window.add(this.customMessage);
    
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
  
  
  
};
this.exports = DayLineWatch;
var UI      = require('ui'),
    Vector2 = require('vector2');

function DayLineWatch() {
  this.window         = null;
  this.textfield      = null;
  this.backgroundRect = null;
  this.rightBar       = null;
  this.weatherText    = null;
  this.nextEventTitle = null;
  this.nextEventText  = null;
  this.colors         = {};
}


DayLineWatch.prototype.init = function(mainWindow, backgroundColor, dominantColor, textColor, timeFormat, dayTop) {
  var that = this;
  this.colors.textColor = textColor;
  this.window = mainWindow;
    console.log(mainWindow);

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
      size: new Vector2(107, 18),
      textOverflow : 'ellipsis',
      font: 'gothic-18-bold',
      text: '%a %d',
      textAlign : 'left',
      color : that.colors.textColor
    });
    mainWindow.add(dayText);
  }
  
 this.updateWeatherText("Loading...");
  
  mainWindow.show();
};

DayLineWatch.prototype.redrawBackground = function(newColor) {
  this.window.remove(this.backgroundRect);
  this.backgroundRect = new UI.Rect({
      size: new Vector2(114, 168),
      backgroundColor : newColor
  });
  this.window.insert(0,this.backgroundRect);
};

DayLineWatch.prototype.updateWeatherText = function(weatherText)
{
  if(this.weatherText !== null) {
    this.weatherText.remove();
  }
  var that = this;
  this.weatherText =  new UI.TimeText ({
    position: new Vector2(8, 23),
    size: new Vector2(107, 18), // 114 - 30
    font: 'gothic-18',
    text: weatherText,
    textAlign : 'left',
    textOverflow : 'ellipsis',
    color : that.colors.textColor
  });
  this.window.add(this.weatherText);
};

DayLineWatch.prototype.displayNextEventDetail = function(title, message) {
  var that = this;
  if(this.nextEventText !== null) {
    this.nextEventTitle.remove();
    this.nextEventText.remove();
  }
  
  this.nextEventTitle =  new UI.Text ({
    position: new Vector2(8, 123),
    size: new Vector2(107, 50),
    font: 'gothic-14-bold',
    textAlign : 'left',
    text: title,
    color : that.colors.textColor
  });
  this.window.add(this.nextEventTitle);
  
  this.nextEventText =  new UI.Text ({
    position: new Vector2(8, 140),
    size: new Vector2(107, 15), // 110, 50
    font: 'gothic-14',
    textAlign : 'left',
    text: message,
    textOverflow : 'ellipsis',
    color : that.colors.textColor
  });
  this.window.add(this.nextEventText);
  
};

DayLineWatch.prototype.removeNextEventDetail = function()
{
  console.log("remove next evt");
  if(this.nextEventText !== null) {
    this.nextEventTitle.remove();
    this.nextEventText.remove();
    this.nextEventText = null;
  }  
};

module.exports = new DayLineWatch;
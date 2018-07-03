const componentList = [
  {
    "component": "Button",
    "type": "digital",
    "dir": "in",
    "image_url": "button",
    "presets": ["Data"],
    "pwm": 0,
    "ifttt": { 
      "actions" : [
        {
          "action" : "pressed",
          "parameters" : [
            {
              "filler"  : null,
              "option"  : "integer"
            },
            {
              "filler"  : null,
              "option"  : ["times"]
            }
          ]  
        },
        {
          "action" : "released",
          "parameters" : [
            {
              "filler"  : null,
              "option"  : "integer"
            },
            {
              "filler"  : null,
              "option"  : ["times"]
            }
          ]  
        },{
          "action" : "held",
          "parameters" : [
            {
              "filler"  : "for",
              "option"  : "integer"
            },
            {
              "filler"  : null,
              "option"  : ["seconds","minutes"]
            }
          ]  
        }
      ]
    }
  },
  {
    "component": "LED",
    "type": "digital",
    "dir": "out",
    "image_url": "led",
    "presets": ["Data","Brightness"],
    "pwm": 1
  },
  {
    "component": "Potentiometer",
    "type": "analog",
    "dir": "in",
    "image_url": "rotary-potentiometer",
    "presets": ["Data", "Percentage", "Angle"],
    "pwm": 0
  },
  {
    "component": "Touch Sensor",
    "type": "digital",
    "dir": "in",
    "image_url": "touch",
    "presets": ["Data"],
    "pwm": 0
  },
  {
    "component": "Brightness Sensor",
    "type": "analog",
    "dir": "in",
    "image_url": "brightness",
    "presets": ["Data", "Lumen"],
    "pwm": 0
  },
  {
    "component": "Servo Motor",
    "type": "analog",
    "dir": "out",
    "image_url": "servo",
    "presets": ["Data", "Angle"],
    "pwm": 1
  },
  {
    "component": "Buzzer",
    "type": "digital",
    "dir": "out",
    "image_url": "buzzer",
    "presets": ["Data", "Note"],
    "pwm": 0
  }
]
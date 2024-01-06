(function() {
  'use strict';
  var GUY, alert, debug, echo, help, info, inspect, log, main, plain, praise, rpr, urge, use_events, warn, whisper;

  //###########################################################################################################
  GUY = require('../../../apps/guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('processing-interception-linux-tools-keyboard-events'));

  ({rpr, inspect, echo, log} = GUY.trm);

  // stdin.setEncoding 'utf8'
  use_events = function() {
    help('^409-1^', "use_events");
    // process.stdin.on 'readable', () ->
    //   warn '^409-2^', "readable!"
    //   return null
    process.stdin.on('data', function(chunk) {
      info('^409-3^', rpr(chunk));
      return null;
    });
    return process.stdin.resume();
  };

  // # stdin.on('end', () ->
  // #   console.log("Hello " + data)
  // # })

  // stdin.on 'error', console.error
  main = async function() {
    var chunk, ref;
    help('^409-4^', "main");
    process.stdin.resume();
    ref = process.stdin;
    for await (chunk of ref) {
      debug('^409-5^', Date.now(), rpr(chunk.toString('hex')));
      debug('^409-5^', Date.now(), new InputEvent(chunk));
      process.stdout.write(chunk);
    }
    return null;
  };

  
const EVENT_TYPES = {
  EV_SYN: 0x00,
  EV_KEY: 0x01, // [joystick] JS_EVENT_BUTTON
  EV_REL: 0x02, // [joystick] JS_EVENT_AXIS
  EV_ABS: 0x03,
  EV_MSC: 0x04,
  EV_SW: 0x05,
  EV_LED: 0x11,
  EV_SND: 0x12,
  EV_REP: 0x14,
  EV_FF: 0x15,
  EV_PWR: 0x16,
  EV_FF_STATUS: 0x17,
  EV_MAX: 0x1f,
  EV_INIT: 0x80 // [joystick] JS_EVENT_INIT
};

class InputEvent {



  constructor( chunk ) {
    this.chunk = chunk;
    this.process();
    return undefined; }

  process() {
    var event;
    /**
     * Sometimes (modern Linux), multiple key events will be in the triggered at once for the same timestamp.
     * The first 4 bytes will be repeated for every event, so we use that knowledge to actually split it.
     * We assume event structures of 3 bytes, 8 bytes, 16 bytes or 24 bytes.
     */
    if (this.chunk.length > 8) {
      var t = this.chunk.readUInt32LE(0);
      var lastPos = 0;
      for (var i = 8, n = this.chunk.length; i < n; i += 8) {
        if (this.chunk.readUInt32LE(i) === t) {
          var part = this.chunk.slice(lastPos, i);
          event = this.parse(part);
          if (event) urge( "event", 'data', event, part);
          lastPos = i;
        }
      }
      var part = this.chunk.slice(lastPos, i);
      event = this.parse(part);
      if (event) urge( "event", 'data', event, part);
    } else {
      event = this.parse(this.chunk);
      if (event) urge( "event", 'data', event, this.chunk);
    }
  }
  parse() {
    if (this.chunk.length >= 24) {
      // unsigned long time structure.
      return {
        tssec:  this.chunk.readUInt32LE(0),
        tsusec: this.chunk.readUInt32LE(8),
        type:   this.chunk.readUInt16LE(16),
        code:   this.chunk.readUInt16LE(18),
        value:  this.chunk.readInt32LE(20)
      };
    }
    if (this.chunk.length >= 16) {
      // https://www.kernel.org/doc/Documentation/input/input.txt
      // is inconsistent with linux/input.h
      // 'value' is a signed 32 bit int in input.h.
      // code is truth, and this also makes more sense for negative
      // axis movement
      // struct input_event {
      //   struct timeval time;
      //   __u16 type;
      //   __u16 code;
      //   __s32 value;
      // };
      return {
        tssec: this.chunk.readUInt32LE(0),
        tsusec: this.chunk.readUInt32LE(4),
        type: this.chunk.readUInt16LE(8),
        code: this.chunk.readUInt16LE(10),
        value: this.chunk.readInt32LE(12)
      };
    } else if (this.chunk.length == 8) {
      // https://www.kernel.org/doc/Documentation/input/joystick-api.txt
      // struct js_event {
      //  __u32 time;     /* event timestamp in milliseconds */
      //  __s16 value;    /* value */
      //  __u8 type;      /* event type */
      //  __u8 number;    /* axis/button number */
      // };
      return {
        time: this.chunk.readUInt32LE(0),
        value: this.chunk.readInt16LE(4),
        type: this.chunk.readUInt8(6),
        number: this.chunk.readUInt8(7)
      };
    } else if (this.chunk.length == 3) {
      // mice mouse
      return {
        t: this.chunk.readInt8(0),
        x: this.chunk.readInt8(1),
        y: this.chunk.readInt8(2)
      };
    }
  }
}

InputEvent.EVENT_TYPES = EVENT_TYPES;
  // use_linux_input_device = ->
  //   LinuxInputListener        = require 'linux-input-device'
  //   SW_LID = 0x00;
  //   input = new LinuxInputListener '/dev/input/by-path/platform-i8042-serio-0-event-kbd'

  //   input.on 'state', ( value, key, kind ) ->
  //     help '^409-6^', "State:", { value, key, kind, }

  //   input.on 'error', console.error

  //   # //start by querying for the initial state.
  //   # input.on 'open', () => input.query 'EV_SW', SW_LID
  //   input.on 'open', () => input.query 'EV_KEY', SW_LID
  //   return null

  // use_input_event = ->
  //   InputEvent  = require 'input-event'
  //   input       = new InputEvent '/dev/input/by-path/platform-i8042-serio-0-event-kbd'
  //   keyboard    = new InputEvent.Keyboard input

  //   keyboard.on 'keyup'   , ( P... ) -> help '^409-7^', "keyup:     ", P
  //   keyboard.on 'keydown' , ( P... ) -> help '^409-8^', "keydown:   ", P
  //   keyboard.on 'keypress', ( P... ) -> help '^409-9^', "keypress:  ", P
;

  if (require.main === module) {
    (async() => {
      // debug new InputEvent()
      // use_input_event()
      return (await main());
    })();
  }

  // use_events()

}).call(this);

//# sourceMappingURL=processing-interception-linux-tools-keyboard-events.js.map
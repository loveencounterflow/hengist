(function() {
  'use strict';
  var GUY, alert, debug, echo, help, info, inspect, log, nameit, plain, praise, rpr, rvr, test, types, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('METTEUR/tests/basics'));

  ({rpr, inspect, echo, log} = GUY.trm);

  rvr = GUY.trm.reverse;

  nameit = function(name, f) {
    return Object.defineProperty(f, 'name', {
      value: name
    });
  };

  //...........................................................................................................
  test = require('guy-test');

  types = new (require('../../../apps/intertype')).Intertype();

  //-----------------------------------------------------------------------------------------------------------
  this.mtr_template_is_constructor = function(T, done) {
    var MTR;
    MTR = require('../../../apps/metteur');
    if (T != null) {
      T.ok(types.isa.function(MTR.Template));
    }
    if (T != null) {
      T.throws(/not a valid mtr_new_template/, function() {
        var e;
        try {
          return new MTR.Template();
        } catch (error1) {
          e = error1;
          warn(rvr(e.message));
          throw e;
        }
      });
    }
    // debug new MTR.Template { template: '', }
    if (T != null) {
      T.ok((new MTR.Template({
        template: ''
      })) instanceof MTR.Template);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mtr_template_and_cfg_are_strict = function(T, done) {
    var MTR, template, tpl;
    MTR = require('../../../apps/metteur');
    template = "helo {name}.";
    tpl = new MTR.Template({template});
    if (T != null) {
      T.throws(/instance does not have property 'NONEXISTANT'/, function() {
        var e;
        try {
          return tpl.NONEXISTANT;
        } catch (error1) {
          e = error1;
          warn(rvr(e.message));
          throw e;
        }
      });
    }
    if (T != null) {
      T.throws(/instance does not have property 'NONEXISTANT'/, function() {
        var e;
        try {
          return tpl.cfg.NONEXISTANT;
        } catch (error1) {
          e = error1;
          warn(rvr(e.message));
          throw e;
        }
      });
    }
    if (T != null) {
      T.ok(Object.isFrozen(tpl.cfg));
    }
    if (T != null) {
      T.ok(Object.isFrozen(tpl._cfg));
    }
    if (T != null) {
      T.eq(tpl.cfg.open, '{');
    }
    if (T != null) {
      T.eq(tpl.cfg.close, '}');
    }
    if (T != null) {
      T.eq(tpl._cfg, {
        open: '\\{',
        close: '\\}',
        rx: /\{(?<key>[^\}]*)\}/g
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mtr_template_defaults = function(T, done) {
    var MTR, result, template, tpl;
    MTR = require('../../../apps/metteur');
    template = "helo {name}.";
    tpl = new MTR.Template({template});
    tpl.fill_all({
      name: "world"
    });
    result = tpl.peek();
    if (T != null) {
      T.eq(result, "helo world.");
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mtr_template_rejects_nonstring_values = function(T, done) {
    var MTR, template, tpl;
    MTR = require('../../../apps/metteur');
    template = "the answer is {answer}.";
    tpl = new MTR.Template({template});
    if (T != null) {
      T.throws(/expected text, got a float/, function() {
        var e;
        try {
          return tpl.fill_all({
            answer: 42
          });
        } catch (error1) {
          e = error1;
          warn(rvr(e.message));
          throw e;
        }
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mtr_template_rejects_missing_keys = function(T, done) {
    var MTR, template, tpl;
    MTR = require('../../../apps/metteur');
    template = "the answer is {answer}.";
    tpl = new MTR.Template({template});
    if (T != null) {
      T.throws(/unknown key 'answer'/, function() {
        var e;
        try {
          return tpl.fill_all({});
        } catch (error1) {
          e = error1;
          warn(rvr(e.message));
          throw e;
        }
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mtr_template_accepts_custom_braces = function(T, done) {
    var MTR, close, open, result, template, tpl;
    MTR = require('../../../apps/metteur');
    template = "the answer is ❰answer❱.";
    open = '❰';
    close = '❱';
    tpl = new MTR.Template({template, open, close});
    if (T != null) {
      T.eq(tpl.cfg.open, '❰');
    }
    if (T != null) {
      T.eq(tpl.cfg.close, '❱');
    }
    if (T != null) {
      T.eq(tpl._cfg, {
        open: '❰',
        close: '❱',
        rx: /❰(?<key>[^❱]*)❱/g
      });
    }
    tpl.fill_all({
      answer: "42"
    });
    result = tpl.peek();
    if (T != null) {
      T.eq(result, "the answer is 42.");
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mtr_template_honours_triple_dots = function(T, done) {
    var MTR, close, open, template, tpl;
    MTR = require('../../../apps/metteur');
    //.........................................................................................................
    template = "the numbers are ❰...numbers❱ in ascending and ❰numbers...❱ in descending order.";
    open = '❰';
    close = '❱';
    tpl = new MTR.Template({template, open, close});
    tpl.fill_all({
      numbers: "1"
    });
    if (T != null) {
      T.eq(tpl.peek(), "the numbers are 1 in ascending and 1 in descending order.");
    }
    tpl.fill_all({
      numbers: " 2 "
    });
    if (T != null) {
      T.eq(tpl.peek(), "the numbers are 1 2  in ascending and  2 1 in descending order.");
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mtr_template_finish_clears_segments = function(T, done) {
    var MTR, close, open, template, tpl;
    MTR = require('../../../apps/metteur');
    //.........................................................................................................
    template = "the answers are ❰...answer❱.";
    open = '❰';
    close = '❱';
    tpl = new MTR.Template({template, open, close});
    tpl.fill_all({
      answer: "42"
    });
    tpl.fill_all({
      answer: " and 108"
    });
    if (T != null) {
      T.eq(tpl.finish(), "the answers are 42 and 108.");
    }
    if (T != null) {
      T.eq(tpl.finish(), "the answers are .");
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mtr_template_peek_returns_current_state = function(T, done) {
    var MTR, close, open, template, tpl;
    MTR = require('../../../apps/metteur');
    //.........................................................................................................
    template = "the {{{what}}} are {{{...answer}}}.";
    open = '{{{';
    close = '}}}';
    tpl = new MTR.Template({template, open, close});
    if (T != null) {
      T.eq(tpl.peek(), "the  are .");
    }
    tpl.fill_all({
      what: "answers",
      answer: "42"
    });
    if (T != null) {
      T.eq(tpl.peek(), "the answers are 42.");
    }
    tpl.fill_some({
      answer: " and 108"
    });
    if (T != null) {
      T.eq(tpl.peek(), "the answers are 42 and 108.");
    }
    if (T != null) {
      T.eq(tpl.finish(), "the answers are 42 and 108.");
    }
    if (T != null) {
      T.eq(tpl.peek(), "the  are .");
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mtr_template_fill_some_targets_some_fields = function(T, done) {
    var MTR, template, tpl;
    MTR = require('../../../apps/metteur');
    //.........................................................................................................
    template = "I have {count1} {fruit1} and {count2} {fruit2}.";
    tpl = new MTR.Template({template});
    tpl.fill_some({
      count1: "1"
    });
    if (T != null) {
      T.eq(tpl.peek(), "I have 1  and  .");
    }
    tpl.fill_some({
      count2: "2"
    });
    if (T != null) {
      T.eq(tpl.peek(), "I have 1  and 2 .");
    }
    if (T != null) {
      T.eq(tpl.finish(), "I have 1  and 2 .");
    }
    if (T != null) {
      T.eq(tpl.peek(), "I have   and  .");
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mtr_template_class_has_prop_misfit = function(T, done) {
    var MTR, facets, template, tpl;
    MTR = require('../../../apps/metteur');
    //.........................................................................................................
    template = "I have {count1} {fruit1} and {count2} {fruit2}.";
    tpl = new MTR.Template({template});
    facets = {
      count1: "1",
      fruit1: MTR.Template.misfit,
      count2: "13",
      fruit2: "bananas"
    };
    tpl.fill_some(facets);
    if (T != null) {
      T.eq(tpl.peek(), "I have 1  and 13 bananas.");
    }
    if (T != null) {
      T.throws(/unknown key 'fruit1'/, function() {
        var e;
        try {
          return tpl.fill_all(facets);
        } catch (error1) {
          e = error1;
          warn(rvr(e.message));
          throw e;
        }
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mtr_split_caches_validation_results = async function(T, done) {
    var MTR, error, i, k, len, matcher, mtr, probe, probes_and_matchers;
    MTR = require('../../../apps/metteur');
    mtr = new MTR.Metteur();
    //.........................................................................................................
    probes_and_matchers = [
      [
        '3',
        [
          {
            pnr: 3,
            count: 2e308
          }
        ]
      ],
      [
        '3,-1',
        [
          {
            pnr: 3,
            count: 2e308
          },
          {
            pnr: -1,
            count: 2e308
          }
        ]
      ],
      ['x',
      null,
      /not a valid/],
      ['3,x',
      null,
      /not a valid/],
      [
        '3:1',
        [
          {
            pnr: 3,
            count: 1
          }
        ]
      ],
      [
        '3:1,-1:2',
        [
          {
            pnr: 3,
            count: 1
          },
          {
            pnr: -1,
            count: 2
          }
        ]
      ],
      [
        '-0',
        [
          {
            pnr: -0,
            count: 2e308
          }
        ]
      ]
    ];
    //.........................................................................................................
    // mtr.types.validate.mtr_split '3,x'
    // mtr.types.validate.mtr_split 'x'
    debug((function() {
      var results;
      results = [];
      for (k in T) {
        results.push(k);
      }
      return results;
    })());
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          mtr.types.validate.mtr_split(probe);
          return resolve(mtr.types.data.mtr_split);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._demo_pdf_generation_jspdf = async function(T, done) {
    var FS, PATH, jsPDF;
    PATH = require('node:path');
    FS = require('node:fs');
    ({jsPDF} = require('jspdf'));
    await GUY.temp.with_directory({
      keep: true
    }, function({path}) {
      var doc, dy, i, my_font, x, y;
      doc = new jsPDF();
      y = 0;
      dy = 10;
      // font_path = PATH.join __dirname, '../../../apps/metteur/fonts/EBGaramond08-Regular.ttf'
      // font_path = '/home/flow/io/mingkwai-rack/jizura-fonts/fonts/Alegreya/Alegreya-Italic.ttf'
      my_font = FS.readFileSync(font_path);
      doc.addFileToVFS('my_font.ttf', my_font);
      doc.addFont('my_font.ttf', 'my_font', 'normal');
      return null;
      doc.setFont('my_font');
      for (x = i = 0; i <= 210; x = i += +10) {
        doc.text("Hello world!", x, y);
        y += dy;
      }
      path = '/tmp/guy.temp--2905412-Uu7YRujOlg0V/a4.pdf';
      // path = PATH.join path, 'a4.pdf'
      doc.save(path);
      return help(`^53784^ output saved to ${path}`);
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._demo_pdf_generation_pdflib = async function(T, done) {
    var FS, PATH, PDFDocument, doc_path, doc_raw, fontBytes, font_path, fontkit, jsPDF, mm_from_pt, my_font, page, pdfDoc, pt_from_mm, size, x, y;
    PATH = require('node:path');
    FS = require('node:fs');
    ({jsPDF} = require('jspdf'));
    // await GUY.temp.with_directory { keep: true, }, ({ path }) ->
    ({PDFDocument} = require('pdf-lib'));
    doc_path = '/tmp/guy.temp--2905412-Uu7YRujOlg0V/a4.pdf';
    fontkit = require('@pdf-lib/fontkit');
    font_path = PATH.join(__dirname, '../../../apps/metteur/fonts/EBGaramond08-Regular.ttf');
    fontBytes = FS.readFileSync(font_path);
    // debug ( k for k of fontBytes )
    // fontBytes = fontBytes.arrayBuffer()
    mm_from_pt = function(pt) {
      return pt / 72 * 25.4;
    };
    pt_from_mm = function(mm) {
      return mm / 25.4 * 72;
    };
    pdfDoc = (await PDFDocument.create());
    pdfDoc.registerFontkit(fontkit);
    my_font = (await pdfDoc.embedFont(fontBytes));
    page = pdfDoc.addPage();
    // page.moveTo 5, 200
    size = pt_from_mm(10);
    x = pt_from_mm(10);
    y = pt_from_mm(10);
    page.drawText("Some fancy Unicode text in the ŪЬȕǹƚü font", {
      font: my_font,
      x,
      y,
      size
    });
    doc_raw = (await pdfDoc.save());
    FS.writeFileSync(doc_path, doc_raw);
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // @mtr_template_cfg_prop_rpr()
      // test @mtr_template_and_cfg_are_strict
      // @mtr_template_demo_splitting()
      // test @mtr_template_accepts_custom_braces
      // test @mtr_template_honours_triple_dots
      // @mtr_split_caches_validation_results()
      // test @mtr_split_caches_validation_results
      // test @
      // @_demo_pdf_generation_jspdf()
      return this._demo_pdf_generation_pdflib();
    })();
  }

}).call(this);

//# sourceMappingURL=basic.test.js.map
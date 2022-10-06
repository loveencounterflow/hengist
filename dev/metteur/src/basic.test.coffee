
'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'METTEUR/tests/basics'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
rvr                       = GUY.trm.reverse
nameit                    = ( name, f ) -> Object.defineProperty f, 'name', { value: name, }
#...........................................................................................................
test                      = require 'guy-test'
types                     = new ( require '../../../apps/intertype' ).Intertype()


#-----------------------------------------------------------------------------------------------------------
@mtr_template_is_constructor = ( T, done ) ->
  MTR = require '../../../apps/metteur'
  T?.ok types.isa.function MTR.Template
  T?.throws /not a valid mtr_new_template/, -> try new MTR.Template() catch e then warn rvr e.message; throw e
  # debug new MTR.Template { template: '', }
  T?.ok ( new MTR.Template { template: '', } ) instanceof MTR.Template
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@mtr_template_and_cfg_are_strict = ( T, done ) ->
  MTR       = require '../../../apps/metteur'
  template  = "helo {name}."
  tpl       = new MTR.Template { template, }
  T?.throws /instance does not have property 'NONEXISTANT'/, -> try tpl.NONEXISTANT     catch e then warn rvr e.message; throw e
  T?.throws /instance does not have property 'NONEXISTANT'/, -> try tpl.cfg.NONEXISTANT catch e then warn rvr e.message; throw e
  T?.ok Object.isFrozen tpl.cfg
  T?.ok Object.isFrozen tpl._cfg
  T?.eq tpl.cfg.open,   '{'
  T?.eq tpl.cfg.close,  '}'
  T?.eq tpl._cfg, { open: '\\{', close: '\\}', rx: /\{(?<key>[^\}]*)\}/g, }
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@mtr_template_defaults = ( T, done ) ->
  MTR       = require '../../../apps/metteur'
  template  = "helo {name}."
  tpl       = new MTR.Template { template, }
  tpl.fill_all { name: "world", }
  result    = tpl.peek()
  T?.eq result, "helo world."
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@mtr_template_rejects_nonstring_values = ( T, done ) ->
  MTR       = require '../../../apps/metteur'
  template  = "the answer is {answer}."
  tpl       = new MTR.Template { template, }
  T?.throws /expected text, got a float/, -> try tpl.fill_all { answer: 42, } catch e then warn rvr e.message; throw e
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@mtr_template_rejects_missing_keys = ( T, done ) ->
  MTR       = require '../../../apps/metteur'
  template  = "the answer is {answer}."
  tpl       = new MTR.Template { template, }
  T?.throws /unknown key 'answer'/, -> try tpl.fill_all {} catch e then warn rvr e.message; throw e
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@mtr_template_accepts_custom_braces = ( T, done ) ->
  MTR       = require '../../../apps/metteur'
  template  = "the answer is ❰answer❱."
  open      = '❰'
  close     = '❱'
  tpl       = new MTR.Template { template, open, close, }
  T?.eq tpl.cfg.open,   '❰'
  T?.eq tpl.cfg.close,  '❱'
  T?.eq tpl._cfg, { open: '❰', close: '❱', rx: /❰(?<key>[^❱]*)❱/g, }
  tpl.fill_all { answer: "42", }
  result    = tpl.peek()
  T?.eq result, "the answer is 42."
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@mtr_template_honours_triple_dots = ( T, done ) ->
  MTR       = require '../../../apps/metteur'
  #.........................................................................................................
  template  = "the numbers are ❰...numbers❱ in ascending and ❰numbers...❱ in descending order."
  open      = '❰'
  close     = '❱'
  tpl       = new MTR.Template { template, open, close, }
  tpl.fill_all { numbers: "1", }
  T?.eq tpl.peek(), "the numbers are 1 in ascending and 1 in descending order."
  tpl.fill_all { numbers: " 2 ", }
  T?.eq tpl.peek(), "the numbers are 1 2  in ascending and  2 1 in descending order."
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@mtr_template_finish_clears_segments = ( T, done ) ->
  MTR       = require '../../../apps/metteur'
  #.........................................................................................................
  template  = "the answers are ❰...answer❱."
  open      = '❰'
  close     = '❱'
  tpl       = new MTR.Template { template, open, close, }
  tpl.fill_all { answer: "42", }
  tpl.fill_all { answer: " and 108", }
  T?.eq tpl.finish(), "the answers are 42 and 108."
  T?.eq tpl.finish(), "the answers are ."
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@mtr_template_peek_returns_current_state = ( T, done ) ->
  MTR       = require '../../../apps/metteur'
  #.........................................................................................................
  template  = "the {{{what}}} are {{{...answer}}}."
  open      = '{{{'
  close     = '}}}'
  tpl       = new MTR.Template { template, open, close, }
  T?.eq tpl.peek(), "the  are ."
  tpl.fill_all { what: "answers", answer: "42", }
  T?.eq tpl.peek(), "the answers are 42."
  tpl.fill_some { answer: " and 108", }
  T?.eq tpl.peek(), "the answers are 42 and 108."
  T?.eq tpl.finish(), "the answers are 42 and 108."
  T?.eq tpl.peek(), "the  are ."
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@mtr_template_fill_some_targets_some_fields = ( T, done ) ->
  MTR       = require '../../../apps/metteur'
  #.........................................................................................................
  template  = "I have {count1} {fruit1} and {count2} {fruit2}."
  tpl       = new MTR.Template { template, }
  tpl.fill_some { count1: "1", }
  T?.eq tpl.peek(), "I have 1  and  ."
  tpl.fill_some { count2: "2", }
  T?.eq tpl.peek(), "I have 1  and 2 ."
  T?.eq tpl.finish(), "I have 1  and 2 ."
  T?.eq tpl.peek(), "I have   and  ."
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@mtr_template_class_has_prop_misfit = ( T, done ) ->
  MTR       = require '../../../apps/metteur'
  #.........................................................................................................
  template  = "I have {count1} {fruit1} and {count2} {fruit2}."
  tpl       = new MTR.Template { template, }
  facets    = { count1: "1", fruit1: MTR.Template.misfit, count2: "13", fruit2: "bananas", }
  tpl.fill_some facets
  T?.eq tpl.peek(), "I have 1  and 13 bananas."
  T?.throws /unknown key 'fruit1'/, -> try tpl.fill_all facets catch e then warn rvr e.message; throw e
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@mtr_split_caches_validation_results = ( T, done ) ->
  MTR       = require '../../../apps/metteur'
  mtr       = new MTR.Metteur()
  #.........................................................................................................
  probes_and_matchers = [
    [ '3', [ { pnr: 3, count: Infinity } ], ]
    [ '3,-1', [ { pnr: 3, count: Infinity }, { pnr: -1, count: Infinity } ], ]
    [ 'x',    null, /not a valid/, ]
    [ '3,x',  null, /not a valid/, ]
    [ '3:1', [ { pnr: 3, count: 1 } ], ]
    [ '3:1,-1:2', [ { pnr: 3, count: 1 }, { pnr: -1, count: 2 } ], ]
    [ '-0', [ { pnr: -0, count: Infinity } ], ]
    ]
  #.........................................................................................................
  # mtr.types.validate.mtr_split '3,x'
  # mtr.types.validate.mtr_split 'x'
  debug ( k for k of T )
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      mtr.types.validate.mtr_split probe
      resolve mtr.types.data.mtr_split
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@_demo_pdf_generation_jspdf = ( T, done ) ->
  PATH      = require 'node:path'
  FS        = require 'node:fs'
  { jsPDF } = require 'jspdf'
  await GUY.temp.with_directory { keep: true, }, ({ path }) ->
    doc       = new jsPDF()
    y         = 0
    dy        = 10
    # font_path = PATH.join __dirname, '../../../apps/metteur/fonts/EBGaramond08-Regular.ttf'
    # font_path = '/home/flow/io/mingkwai-rack/jizura-fonts/fonts/Alegreya/Alegreya-Italic.ttf'
    my_font   = FS.readFileSync font_path
    doc.addFileToVFS 'my_font.ttf', my_font
    doc.addFont 'my_font.ttf', 'my_font', 'normal'
    return null
    doc.setFont 'my_font'
    for x in [ 0 .. 210 ] by +10
      doc.text "Hello world!", x, y
      y += dy
    path = '/tmp/guy.temp--2905412-Uu7YRujOlg0V/a4.pdf'
    # path = PATH.join path, 'a4.pdf'
    doc.save path
    help "^53784^ output saved to #{path}"
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@_demo_pdf_generation_pdflib = ( T, done ) ->
  PATH      = require 'node:path'
  FS        = require 'node:fs'
  { jsPDF } = require 'jspdf'
  # await GUY.temp.with_directory { keep: true, }, ({ path }) ->
  { PDFDocument } = require 'pdf-lib'
  doc_path  = '/tmp/guy.temp--2905412-Uu7YRujOlg0V/a4.pdf'
  fontkit   = require '@pdf-lib/fontkit'
  font_path = PATH.join __dirname, '../../../apps/metteur/fonts/EBGaramond08-Regular.ttf'
  fontBytes = FS.readFileSync font_path
  # debug ( k for k of fontBytes )
  # fontBytes = fontBytes.arrayBuffer()
  mm_from_pt = ( pt ) -> pt / 72 * 25.4
  pt_from_mm = ( mm ) -> mm / 25.4 * 72
  pdfDoc    = await PDFDocument.create()
  pdfDoc.registerFontkit fontkit
  my_font   = await pdfDoc.embedFont fontBytes
  page      = pdfDoc.addPage()
  page.moveTo 5, 200
  size      = pt_from_mm 10
  x         = pt_from_mm 10
  y         = pt_from_mm 10
  page.drawText "Some fancy Unicode text in the ŪЬȕǹƚü font", { font: my_font, x, y, size, }
  doc_raw   = await pdfDoc.save()
  FS.writeFileSync doc_path, doc_raw
  #.........................................................................................................
  done?()



############################################################################################################
if module is require.main then do =>
  # @mtr_template_cfg_prop_rpr()
  # test @mtr_template_and_cfg_are_strict
  # @mtr_template_demo_splitting()
  # test @mtr_template_accepts_custom_braces
  # test @mtr_template_honours_triple_dots
  # @mtr_split_caches_validation_results()
  # test @mtr_split_caches_validation_results
  # test @
  # @_demo_pdf_generation_jspdf()
  @_demo_pdf_generation_pdflib()
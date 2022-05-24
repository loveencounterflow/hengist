
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-TABULATOR/TESTS/HTML-GENERATION'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../apps/guy-test'
# PATH                      = require 'path'
# FS                        = require 'fs'
# H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
GUY                       = require '../../../apps/guy'
# MMX                       = require '../../../apps/multimix/lib/cataloguing'


#-----------------------------------------------------------------------------------------------------------
@[ "tabulate() 1" ] = ( T, done ) ->
  { Tabulator }         = require '../../../apps/dbay-tabulator'
  tabulator             = new Tabulator()
  rows                  = [
    { sid_min: 1, sid_max: 1, pid: 'xx-1', dsk: 'xx', rank: 1, ts: '12345Z', raw_trend: '[{"dsk":"xx","pid":"xx-1","sid":1,"rank":1,"first":1,"last":1}]', duh: ( JSON.stringify { foo: 42, bar: 108, } ), }
    ]
  result                = tabulator.tabulate { rows, }
  help '^348^', result
  T?.ok ( result.indexOf "<table>"                          ) > -1
  T?.ok ( result.indexOf "<th class='sid_min'>sid_min</th>" ) > -1
  T?.ok ( result.indexOf "<th class='sid_max'>sid_max</th>" ) > -1
  T?.ok ( result.indexOf "<th class='dsk'>dsk</th>"         ) > -1
  T?.ok ( result.indexOf "<th class='ts'>ts</th>"           ) > -1
  T?.ok ( result.indexOf "<th class='pid'>pid</th>"         ) > -1
  T?.ok ( result.indexOf """<td class='dsk'>xx</td>"""                                                                    ) > -1
  T?.ok ( result.indexOf """<td class='sid_min'>1</td>"""                                                                 ) > -1
  T?.ok ( result.indexOf """<td class='sid_max'>1</td>"""                                                                 ) > -1
  T?.ok ( result.indexOf """<td class='pid'>xx-1</td>"""                                                                  ) > -1
  T?.ok ( result.indexOf """<td class='rank'>1</td>"""                                                                    ) > -1
  T?.ok ( result.indexOf """<td class='raw_trend'>[{"dsk":"xx","pid":"xx-1","sid":1,"rank":1,"first":1,"last":1}]</td>""" ) > -1
  T?.ok ( result.indexOf """<td class='duh'>{"foo":42,"bar":108}</td>"""                                              ) > -1
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "tabulate() 2" ] = ( T, done ) ->
  { Tabulator }         = require '../../../apps/dbay-tabulator'
  tabulator             = new Tabulator()
  rows                  = [
    { sid: 1, pid: 'xx-1', dsk: 'xx', sid_min: 1, sid_max: 1, details: ( JSON.stringify { foo: 42, bar: 108, } ), }
    ]
  cfg                   =
    rows:      rows
    class:      'vogue_trends'
    undefined:  "N/A"
    fields:
      dsk:
        title: "DSK"
      sid_min:
        hide: true
      sid_max:
        title: "SIDs"
        outer_html: ( d ) =>
          value = "#{d.row.sid_min}—#{d.row.sid_max}"
          urge '^4535^', d
          urge '^4535^', rpr value
          T?.eq value, "1—1"
          T?.eq d.raw_value, 1
          return "<td class=sids>#{value}</td>"
      details:
        inner_html: ( d ) =>
          return "<div>#{rpr d.raw_value}</div>"
      extra:
        title: "Extra"
        inner_html: ( d ) => "#{d.row_nr}"
      asboolean: true
  result                = tabulator.tabulate cfg
  help '^348^', result
  T?.ok ( result.indexOf "<th class='dsk'>DSK</th>" ) > -1
  T?.ok ( result.indexOf "<th class='extra'>Extra</th>" ) > -1
  T?.ok ( result.indexOf "<td class='extra'>1</td>" ) > -1
  T?.ok ( result.indexOf "<th class='sid_min'>" ) == -1
  T?.ok ( result.indexOf "<td class='sid_min'>" ) == -1
  T?.ok ( result.indexOf "<td class=sids>1—1</td>" ) > -1
  T?.ok ( result.indexOf "<td class='asboolean'>N/A</td>" ) > -1
  T?.ok ( result.indexOf """<td class='details'><div>'{"foo":42,"bar":108}'</div></td>""" ) > -1
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "`query`, `table` are disallowed" ] = ( T, done ) ->
  { TABULATOR }         = require '../../../apps/dbay-tabulator'
  { SQL, }              = ( require '../../../apps/dbay' ).DBay
  #.........................................................................................................
  do =>
    cfg =
      class:        'tabulator trends xx'
      query:        SQL"""select * from vogue_trends where dsk = $dsk order by pid;"""
      parameters:   { dsk: 'xx', }
    T?.throws /not a valid vgt_as_html_cfg/, => TABULATOR.tabulate cfg
  #.........................................................................................................
  do =>
    cfg =
      table:        'mytable'
      parameters:   { dsk: 'xx', }
    T?.throws /not a valid vgt_as_html_cfg/, => TABULATOR.tabulate cfg
  #.........................................................................................................
  do =>
    cfg =
      rows:         []
      parameters:   { dsk: 'xx', }
    T?.throws /not a valid vgt_as_html_cfg/, => TABULATOR.tabulate cfg
    return null
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "tabulate() can use `rows`" ] = ( T, done ) ->
  { Tabulator }             = require '../../../apps/dbay-tabulator'
  tabulator                 = new Tabulator()
  #.........................................................................................................
  do =>
    cfg =
      rows:         []
    result = tabulator.tabulate cfg
    help '^348^', result
    T?.eq result, "<table>\n</table>"
    return null
  #.........................................................................................................
  do =>
    cfg =
      class:        'classy'
      rows:         []
      fields:
        a: true
        b: true
        c: true
    result = tabulator.tabulate cfg
    help '^348^', result
    T?.ok ( result.indexOf "<table class='classy'>" ) > -1
    T?.ok ( result.indexOf "<th class='a'>a</th>" ) > -1
    T?.ok ( result.indexOf "<th class='b'>b</th>" ) > -1
    T?.ok ( result.indexOf "<th class='c'>c</th>" ) > -1
    return null
  #.........................................................................................................
  do =>
    cfg =
      rows:         [
        { a: 1, b: "something", c: "else", }
        { a: 2, b: "something", c: "else", }
        { a: 3, b: "something", c: "else", }
        { a: 4, b: "something", c: "else", }
        ]
    result = tabulator.tabulate cfg
    help '^348^', result
    T?.ok ( result.indexOf "<th class='a'>a</th>" ) > -1
    T?.ok ( result.indexOf "<th class='b'>b</th>" ) > -1
    T?.ok ( result.indexOf "<th class='c'>c</th>" ) > -1
    T?.ok ( result.indexOf "<td class='a'>3</td>" ) > -1
    T?.ok ( result.indexOf "<td class='b'>something</td>" ) > -1
    T?.ok ( result.indexOf "<td class='c'>else</td>" ) > -1
    return null
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "tabulate() can use iterator for `rows`" ] = ( T, done ) ->
  { TABULATOR }             = require '../../../apps/dbay-tabulator'
  #.........................................................................................................
  do =>
    _rows   = [
        { a: 1, b: "something", c: "else", }
        { a: 2, b: "something", c: "else", }
        { a: 3, b: "something", c: "else", }
        { a: 4, b: "something", c: "else", }
        ]
    rows    = ( -> yield from _rows )()
    result  = TABULATOR.tabulate { rows, }
    help '^348^', result
    T?.ok ( result.indexOf "<th class='a'>a</th>" ) > -1
    T?.ok ( result.indexOf "<th class='b'>b</th>" ) > -1
    T?.ok ( result.indexOf "<th class='c'>c</th>" ) > -1
    T?.ok ( result.indexOf "<td class='a'>3</td>" ) > -1
    T?.ok ( result.indexOf "<td class='b'>something</td>" ) > -1
    T?.ok ( result.indexOf "<td class='c'>else</td>" ) > -1
    return null
  #.........................................................................................................
  do =>
    { DBay }  = require '../../../apps/dbay'
    { SQL }   = GUY.str
    db        = new DBay()
    rows      = db SQL"select * from sqlite_schema;"
    result  = TABULATOR.tabulate { rows, }
    help '^348^', result
    return null
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "tabulate() can use subtables 1" ] = ( T, done ) ->
  { tabulate
    summarize }             = require '../../../apps/dbay-tabulator'
  #.........................................................................................................
  do =>
    cfg =
      rows:         [
        { nr: 1, details: ( JSON.stringify { a: "something", b: "else" } ), }
        # { nr: 2, details: ( JSON.stringify { "something", c: "else" } ), }
        # { nr: 3, details: ( JSON.stringify { "something", c: "else" } ), }
        # { nr: 4, details: ( JSON.stringify { "something", c: "else" } ), }
        ]
      fields:
        details:
          inner_html: ( d ) -> summarize { row: d.value, }
    result = tabulate cfg
    help '^348^', result
    T?.ok ( result.indexOf "<td class='details'><table>"                      ) > -1
    T?.ok ( result.indexOf "<tr><th>a</th><td class='a'>something</td></tr>"  ) > -1
    T?.ok ( result.indexOf "<tr><th>b</th><td class='b'>else</td></tr>"       ) > -1
    T?.ok ( result.indexOf "</table></td>"                                    ) > -1
    return null
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "tabulate() can use subtables 2" ] = ( T, done ) ->
  { Tabulator }             = require '../../../apps/dbay-tabulator'
  tabulator                 = new Tabulator()
  #.........................................................................................................
  do =>
    #.......................................................................................................
    details_cfg =
      fields:
        a:
          title:  "Ants"
          inner_html: ( d ) -> "*#{d.value}*"
    #.......................................................................................................
    table_cfg =
      rows:         [
        { nr: 1, details: ( JSON.stringify { a: "something", b: "else" } ), }
        # { nr: 2, details: ( JSON.stringify { "something", c: "else" } ), }
        # { nr: 3, details: ( JSON.stringify { "something", c: "else" } ), }
        # { nr: 4, details: ( JSON.stringify { "something", c: "else" } ), }
        ]
      fields:
        details:
          inner_html: ( d ) -> tabulator.summarize { row: d.value, details_cfg..., }
    #.......................................................................................................
    result = tabulator.tabulate table_cfg
    help '^348^', result
    T?.ok ( result.indexOf "<td class='details'><table>"                        ) > -1
    T?.ok ( result.indexOf "<tr><th>Ants</th><td class='a'>*something*</td></tr>"  ) > -1
    T?.ok ( result.indexOf "<tr><th>b</th><td class='b'>else</td></tr>"         ) > -1
    T?.ok ( result.indexOf "</table></td>"                                      ) > -1
    return null
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "`inner_html()`, `outer_html()` can hide lines" ] = ( T, done ) ->
  { summarize }             = require '../../../apps/dbay-tabulator'
  rows                      = [
    { nr: 1, word: "one",   show_word: true,  }
    { nr: 2, word: "two",   show_word: false, }
    { nr: 3, word: "three", show_word: true,  }
    { nr: 4, word: "four",  show_word: false, }
    ]
  #.........................................................................................................
  cfg =
    fields:
      nr:
        title:      "Nr"
        inner_html: ( d ) -> "##{d.value}"
      word:
        title:      "Word"
        inner_html: ( d ) ->
          return Symbol.for 'hide' if d.row.nr %% 2 is 0
          return d.value
  #.........................................................................................................
  for row in rows
    { show_word } = row; delete row.show_word
    result = summarize { row, cfg..., }
    help '^348^', result
    if show_word
      T?.ok ( result.indexOf "<th>Word</th><td class='word'>" ) > -1
    else
      T?.ok ( result.indexOf "<th>Word</th><td class='word'>" ) == -1
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "vgt_iterable()" ] = ( T, done ) ->
  { TABULATOR }         = require '../../../apps/dbay-tabulator'
  probes_and_matchers = [
    [ null,                   false, ]
    [ [],                     true,  ]
    [ {},                     false, ]
    [ ( new Set() ),          true,  ]
    [ ( new Set().keys() ),   true,  ]
    [ "whatever",             true,  ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      resolve TABULATOR.types.isa.vgt_iterable probe
  return done()

#-----------------------------------------------------------------------------------------------------------
@[ "vgt_iterable_no_text()" ] = ( T, done ) ->
  { TABULATOR }         = require '../../../apps/dbay-tabulator'
  probes_and_matchers = [
    [ null,                   false, ]
    [ [],                     true,  ]
    [ {},                     false, ]
    [ ( new Set() ),          true,  ]
    [ ( new Set().keys() ),   true,  ]
    [ "whatever",             false,  ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      resolve TABULATOR.types.isa.vgt_iterable_no_text probe
  return done()


############################################################################################################
if module is require.main then do =>
  # test @
  # test @[ "tabulate() can use subtables 2" ]
  # test @[ "vgt_iterable_no_text()" ]
  # @[ "tabulate() 2" ]()
  # test @[ "tabulate() 2" ]
  test @[ "`inner_html()`, `outer_html()` can hide lines" ]
  # test @[ "`query`, `table` are disallowed" ]
  # test @[ "tabulate() can use iterator for `rows`" ]
  # test @[ "tabulate() can use `rows`" ]
  # @[ "tabulate() 1" ]()
  # test @[ "tabulate() 1" ]
  # echo x for x from [ 1, 2, 3, ]
  # echo x for x from { a: 4, b: 5, c: 6, }
  # echo x for x from ( new Set [ 18,9,10,] )
  # echo x for x from ( new Set [ 18,9,10,] ).keys()

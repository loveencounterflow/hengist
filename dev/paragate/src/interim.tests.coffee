
'use strict'
# coffeelint: disable=max_line_length

############################################################################################################
CND                       = require 'cnd'
badge                     = 'PARAGATE/INTERIM-TESTS'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
{ jr, }                   = CND
#...........................................................................................................
test                      = require 'guy-test'
INTERTEXT                 = require 'intertext'
{ rpr }                   = INTERTEXT.export()
{ isa
  type_of }               = INTERTEXT.types
{ lets }                  = ( require 'datom' ).export()

#-----------------------------------------------------------------------------------------------------------
as_text = ( x ) ->
  return rpr x
  switch type_of x
    when 'text'   then return x
    when 'object' then return jr x
    when 'list'   then return jr x
  return x.toString()

#-----------------------------------------------------------------------------------------------------------
condense_token = ( token ) ->
  keys    = ( Object.keys token ).sort()
  keys    = keys.filter ( x ) -> x not in [ 'message', '$', ]
  values  = ( ( k + '=' + as_text token[ k ] ) for k in keys )
  return values.join ','
  # return as_text values

#-----------------------------------------------------------------------------------------------------------
condense_tokens = ( tokens ) ->
  R = []
  for t in tokens
    continue if t.$key in [ '<document', '>document', ]
    R.push condense_token t
  return R.join '#'

#-----------------------------------------------------------------------------------------------------------
delete_refs = ( ds ) ->
  R = []
  for d in ds
    R.push lets d, ( d ) -> delete d.$
  return R

# #-----------------------------------------------------------------------------------------------------------
# @show_condensed_tokens = ( tokens ) ->
#   for token in tokens
#     help @condense_token token
#   info @condense_tokens tokens
#   return null


#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
# @[ "API" ] = ( T, done ) ->
#   grammar       = require './grammar'
#   grammar  = require './../paragate/lib/htmlish.grammar'
#   debug '^34334^', rpr ( k for k of grammar )
#   debug '^34334^', rpr ( k for k of grammar )
#   # urge grammar.parse """<title>Helo Worlds</title>"""
#   return done()

#-----------------------------------------------------------------------------------------------------------
@[ "HTML: parse (1)" ] = ( T, done ) ->
  grammar = require './../paragate/lib/htmlish.grammar'
  probes_and_matchers = [
    [ '<!DOCTYPE html>',    [ { '$key': '<document', start: 0, stop: 0, source: '<!DOCTYPE html>', errors: [], '$vnr': [ -Infinity ] }, { '$key': '^doctype', start: 0, stop: 15, text: '<!DOCTYPE html>', '$vnr': [ 1, 1 ] }, { '$key': '>document', start: 15, stop: 15, '$vnr': [ Infinity ] } ], null ]
    [ '<!DOCTYPE obvious>', [ { '$key': '<document', start: 0, stop: 0, source: '<!DOCTYPE obvious>', errors: [], '$vnr': [ -Infinity ] }, { '$key': '^doctype', start: 0, stop: 18, text: '<!DOCTYPE obvious>', '$vnr': [ 1, 1 ] }, { '$key': '>document', start: 18, stop: 18, '$vnr': [ Infinity ] } ], null ]
    [ '<title>Helo Worlds</title>', [ { '$key': '<document', start: 0, stop: 0, source: '<title>Helo Worlds</title>', errors: [], '$vnr': [ -Infinity ] }, { '$key': '<tag', name: 'title', type: 'otag', text: '<title>', start: 0, stop: 7, '$vnr': [ 1, 1 ] }, { '$key': '^text', start: 7, stop: 18, text: 'Helo Worlds', '$vnr': [ 1, 8 ] }, { '$key': '>tag', name: 'title', type: 'ctag', text: '</title>', start: 18, stop: 26, '$vnr': [ 1, 19 ] }, { '$key': '>document', start: 26, stop: 26, '$vnr': [ Infinity ] } ], null ]
    [ '<img width=200>', [ { '$key': '<document', start: 0, stop: 0, source: '<img width=200>', errors: [], '$vnr': [ -Infinity ] }, { '$key': '<tag', name: 'img', type: 'otag', text: '<img width=200>', start: 0, stop: 15, atrs: { width: '200' }, '$vnr': [ 1, 1 ] }, { '$key': '>document', start: 15, stop: 15, '$vnr': [ Infinity ] } ], null ]
    [ '<foo/>', [ { '$key': '<document', start: 0, stop: 0, source: '<foo/>', errors: [], '$vnr': [ -Infinity ] }, { '$key': '^tag', name: 'foo', type: 'stag', text: '<foo/>', start: 0, stop: 6, '$vnr': [ 1, 1 ] }, { '$key': '>document', start: 6, stop: 6, '$vnr': [ Infinity ] } ], null ]
    [ '<foo></foo>', [ { '$key': '<document', start: 0, stop: 0, source: '<foo></foo>', errors: [], '$vnr': [ -Infinity ] }, { '$key': '<tag', name: 'foo', type: 'otag', text: '<foo>', start: 0, stop: 5, '$vnr': [ 1, 1 ] }, { '$key': '>tag', name: 'foo', type: 'ctag', text: '</foo>', start: 5, stop: 11, '$vnr': [ 1, 6 ] }, { '$key': '>document', start: 11, stop: 11, '$vnr': [ Infinity ] } ], null ]
    [ '<p>here and<br></br>there</p>', [ { '$key': '<document', start: 0, stop: 0, source: '<p>here and<br></br>there</p>', errors: [], '$vnr': [ -Infinity ] }, { '$key': '<tag', name: 'p', type: 'otag', text: '<p>', start: 0, stop: 3, '$vnr': [ 1, 1 ] }, { '$key': '^text', start: 3, stop: 11, text: 'here and', '$vnr': [ 1, 4 ] }, { '$key': '<tag', name: 'br', type: 'otag', text: '<br>', start: 11, stop: 15, '$vnr': [ 1, 12 ] }, { '$key': '>tag', name: 'br', type: 'ctag', text: '</br>', start: 15, stop: 20, '$vnr': [ 1, 16 ] }, { '$key': '^text', start: 20, stop: 25, text: 'there', '$vnr': [ 1, 21 ] }, { '$key': '>tag', name: 'p', type: 'ctag', text: '</p>', start: 25, stop: 29, '$vnr': [ 1, 26 ] }, { '$key': '>document', start: 29, stop: 29, '$vnr': [ Infinity ] } ], null ]
    [ '<p>here and<br>there', [ { '$key': '<document', start: 0, stop: 0, source: '<p>here and<br>there', errors: [], '$vnr': [ -Infinity ] }, { '$key': '<tag', name: 'p', type: 'otag', text: '<p>', start: 0, stop: 3, '$vnr': [ 1, 1 ] }, { '$key': '^text', start: 3, stop: 11, text: 'here and', '$vnr': [ 1, 4 ] }, { '$key': '<tag', name: 'br', type: 'otag', text: '<br>', start: 11, stop: 15, '$vnr': [ 1, 12 ] }, { '$key': '^text', start: 15, stop: 20, text: 'there', '$vnr': [ 1, 16 ] }, { '$key': '>document', start: 20, stop: 20, '$vnr': [ Infinity ] } ], null ]
    [ '<p>here and<br>there</p>', [ { '$key': '<document', start: 0, stop: 0, source: '<p>here and<br>there</p>', errors: [], '$vnr': [ -Infinity ] }, { '$key': '<tag', name: 'p', type: 'otag', text: '<p>', start: 0, stop: 3, '$vnr': [ 1, 1 ] }, { '$key': '^text', start: 3, stop: 11, text: 'here and', '$vnr': [ 1, 4 ] }, { '$key': '<tag', name: 'br', type: 'otag', text: '<br>', start: 11, stop: 15, '$vnr': [ 1, 12 ] }, { '$key': '^text', start: 15, stop: 20, text: 'there', '$vnr': [ 1, 16 ] }, { '$key': '>tag', name: 'p', type: 'ctag', text: '</p>', start: 20, stop: 24, '$vnr': [ 1, 21 ] }, { '$key': '>document', start: 24, stop: 24, '$vnr': [ Infinity ] } ], null ]
    [ '<p>here and<br x=42/>there</p>', [ { '$key': '<document', start: 0, stop: 0, source: '<p>here and<br x=42/>there</p>', errors: [], '$vnr': [ -Infinity ] }, { '$key': '<tag', name: 'p', type: 'otag', text: '<p>', start: 0, stop: 3, '$vnr': [ 1, 1 ] }, { '$key': '^text', start: 3, stop: 11, text: 'here and', '$vnr': [ 1, 4 ] }, { '$key': '^tag', name: 'br', type: 'stag', text: '<br x=42/>', start: 11, stop: 21, atrs: { x: '42' }, '$vnr': [ 1, 12 ] }, { '$key': '^text', start: 21, stop: 26, text: 'there', '$vnr': [ 1, 22 ] }, { '$key': '>tag', name: 'p', type: 'ctag', text: '</p>', start: 26, stop: 30, '$vnr': [ 1, 27 ] }, { '$key': '>document', start: 30, stop: 30, '$vnr': [ Infinity ] } ], null ]
    [ '<p>here and<br/>there</p>', [ { '$key': '<document', start: 0, stop: 0, source: '<p>here and<br/>there</p>', errors: [], '$vnr': [ -Infinity ] }, { '$key': '<tag', name: 'p', type: 'otag', text: '<p>', start: 0, stop: 3, '$vnr': [ 1, 1 ] }, { '$key': '^text', start: 3, stop: 11, text: 'here and', '$vnr': [ 1, 4 ] }, { '$key': '^tag', name: 'br', type: 'stag', text: '<br/>', start: 11, stop: 16, '$vnr': [ 1, 12 ] }, { '$key': '^text', start: 16, stop: 21, text: 'there', '$vnr': [ 1, 17 ] }, { '$key': '>tag', name: 'p', type: 'ctag', text: '</p>', start: 21, stop: 25, '$vnr': [ 1, 22 ] }, { '$key': '>document', start: 25, stop: 25, '$vnr': [ Infinity ] } ], null ]
    [ 'just some plain text', [ { '$key': '<document', start: 0, stop: 0, source: 'just some plain text', errors: [], '$vnr': [ -Infinity ] }, { '$key': '^text', start: 0, stop: 20, text: 'just some plain text', '$vnr': [ 1, 1 ] }, { '$key': '>document', start: 20, stop: 20, '$vnr': [ Infinity ] } ], null ]
    [ '<p>one<p>two', [ { '$key': '<document', start: 0, stop: 0, source: '<p>one<p>two', errors: [], '$vnr': [ -Infinity ] }, { '$key': '<tag', name: 'p', type: 'otag', text: '<p>', start: 0, stop: 3, '$vnr': [ 1, 1 ] }, { '$key': '^text', start: 3, stop: 6, text: 'one', '$vnr': [ 1, 4 ] }, { '$key': '<tag', name: 'p', type: 'otag', text: '<p>', start: 6, stop: 9, '$vnr': [ 1, 7 ] }, { '$key': '^text', start: 9, stop: 12, text: 'two', '$vnr': [ 1, 10 ] }, { '$key': '>document', start: 12, stop: 12, '$vnr': [ Infinity ] } ], null ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      resolve delete_refs grammar.parse probe
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "HTML: parse (1a)" ] = ( T, done ) ->
  grammar = require './../paragate/lib/htmlish.grammar'
  probes_and_matchers = [
    [ '<!DOCTYPE html>', "$key='^doctype',$vnr=[ 1, 1 ],start=0,stop=15,text='<!DOCTYPE html>'", null ]
    [ '<!DOCTYPE obvious>', "$key='^doctype',$vnr=[ 1, 1 ],start=0,stop=18,text='<!DOCTYPE obvious>'", null ]
    [ '<title>Helo Worlds</title>', "$key='<tag',$vnr=[ 1, 1 ],name='title',start=0,stop=7,text='<title>',type='otag'#$key='^text',$vnr=[ 1, 8 ],start=7,stop=18,text='Helo Worlds'#$key='>tag',$vnr=[ 1, 19 ],name='title',start=18,stop=26,text='</title>',type='ctag'", null ]
    [ '<img width=200>', "$key='<tag',$vnr=[ 1, 1 ],atrs={ width: '200' },name='img',start=0,stop=15,text='<img width=200>',type='otag'", null ]
    [ '<foo/>', "$key='^tag',$vnr=[ 1, 1 ],name='foo',start=0,stop=6,text='<foo/>',type='stag'", null ]
    [ '<foo></foo>', "$key='<tag',$vnr=[ 1, 1 ],name='foo',start=0,stop=5,text='<foo>',type='otag'#$key='>tag',$vnr=[ 1, 6 ],name='foo',start=5,stop=11,text='</foo>',type='ctag'", null ]
    [ '<p>here and<br></br>there</p>', "$key='<tag',$vnr=[ 1, 1 ],name='p',start=0,stop=3,text='<p>',type='otag'#$key='^text',$vnr=[ 1, 4 ],start=3,stop=11,text='here and'#$key='<tag',$vnr=[ 1, 12 ],name='br',start=11,stop=15,text='<br>',type='otag'#$key='>tag',$vnr=[ 1, 16 ],name='br',start=15,stop=20,text='</br>',type='ctag'#$key='^text',$vnr=[ 1, 21 ],start=20,stop=25,text='there'#$key='>tag',$vnr=[ 1, 26 ],name='p',start=25,stop=29,text='</p>',type='ctag'", null ]
    [ '<p>here and<br>there', "$key='<tag',$vnr=[ 1, 1 ],name='p',start=0,stop=3,text='<p>',type='otag'#$key='^text',$vnr=[ 1, 4 ],start=3,stop=11,text='here and'#$key='<tag',$vnr=[ 1, 12 ],name='br',start=11,stop=15,text='<br>',type='otag'#$key='^text',$vnr=[ 1, 16 ],start=15,stop=20,text='there'", null ]
    [ '<p>here and<br>there</p>', "$key='<tag',$vnr=[ 1, 1 ],name='p',start=0,stop=3,text='<p>',type='otag'#$key='^text',$vnr=[ 1, 4 ],start=3,stop=11,text='here and'#$key='<tag',$vnr=[ 1, 12 ],name='br',start=11,stop=15,text='<br>',type='otag'#$key='^text',$vnr=[ 1, 16 ],start=15,stop=20,text='there'#$key='>tag',$vnr=[ 1, 21 ],name='p',start=20,stop=24,text='</p>',type='ctag'", null ]
    [ '<p>here and<br x=42/>there</p>', "$key='<tag',$vnr=[ 1, 1 ],name='p',start=0,stop=3,text='<p>',type='otag'#$key='^text',$vnr=[ 1, 4 ],start=3,stop=11,text='here and'#$key='^tag',$vnr=[ 1, 12 ],atrs={ x: '42' },name='br',start=11,stop=21,text='<br x=42/>',type='stag'#$key='^text',$vnr=[ 1, 22 ],start=21,stop=26,text='there'#$key='>tag',$vnr=[ 1, 27 ],name='p',start=26,stop=30,text='</p>',type='ctag'", null ]
    [ '<p>here and<br/>there</p>', "$key='<tag',$vnr=[ 1, 1 ],name='p',start=0,stop=3,text='<p>',type='otag'#$key='^text',$vnr=[ 1, 4 ],start=3,stop=11,text='here and'#$key='^tag',$vnr=[ 1, 12 ],name='br',start=11,stop=16,text='<br/>',type='stag'#$key='^text',$vnr=[ 1, 17 ],start=16,stop=21,text='there'#$key='>tag',$vnr=[ 1, 22 ],name='p',start=21,stop=25,text='</p>',type='ctag'", null ]
    [ 'just some plain text', "$key='^text',$vnr=[ 1, 1 ],start=0,stop=20,text='just some plain text'", null ]
    [ '<p>one<p>two', "$key='<tag',$vnr=[ 1, 1 ],name='p',start=0,stop=3,text='<p>',type='otag'#$key='^text',$vnr=[ 1, 4 ],start=3,stop=6,text='one'#$key='<tag',$vnr=[ 1, 7 ],name='p',start=6,stop=9,text='<p>',type='otag'#$key='^text',$vnr=[ 1, 10 ],start=9,stop=12,text='two'", null ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      resolve condense_tokens grammar.parse probe
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "HTML: parse (dubious)" ] = ( T, done ) ->
  grammar = require './../paragate/lib/htmlish.grammar'
  probes_and_matchers = [
    [ '< >', "$key='<tag',$vnr=[ 1, 1 ],start=0,stop=3,text='< >',type='otag'#$key='^error',$vnr=[ 1, 3 ],chvtname='MismatchedTokenException',code='mismatch',origin='parser',start=2,stop=3,text='>'", null ]
    [ '< x >', "$key='<tag',$vnr=[ 1, 1 ],name='x',start=0,stop=5,text='< x >',type='otag'", null ]
    [ '<>', "$key='<tag',$vnr=[ 1, 1 ],start=0,stop=2,text='<>',type='otag'#$key='^error',$vnr=[ 1, 2 ],chvtname='MismatchedTokenException',code='mismatch',origin='parser',start=1,stop=2,text='>'", null ]
    [ '<', "$key='^error',$vnr=[ 1, 1 ],chvtname='MismatchedTokenException',code='mismatch',origin='parser',start=0,stop=1,text='<'", null ]
    [ '<tag', "$key='<tag',$vnr=[ 1, 1 ],name='tag',start=0,stop=4,text='<tag'#$key='^error',$vnr=[ 1, 2 ],chvtname='NoViableAltException',code='missing',origin='parser',start=1,stop=4,text='tag'", null ]
    [ 'if <math> a > b </math> then', "$key='^text',$vnr=[ 1, 1 ],start=0,stop=3,text='if '#$key='<tag',$vnr=[ 1, 4 ],name='math',start=3,stop=9,text='<math>',type='otag'#$key='^text',$vnr=[ 1, 10 ],start=9,stop=16,text=' a > b '#$key='>tag',$vnr=[ 1, 17 ],name='math',start=16,stop=23,text='</math>',type='ctag'#$key='^text',$vnr=[ 1, 24 ],start=23,stop=28,text=' then'", null ]
    [ '>', "$key='^text',$vnr=[ 1, 1 ],start=0,stop=1,text='>'", null ]
    [ '&', "$key='^text',$vnr=[ 1, 1 ],start=0,stop=1,text='&'", null ]
    [ '&amp;', "$key='^text',$vnr=[ 1, 1 ],start=0,stop=5,text='&amp;'", null ]
    [ "<tag a='<'>", """$key='<tag',$vnr=[ 1, 1 ],atrs={ a: "'<'" },name='tag',start=0,stop=11,text="<tag a='<'>",type='otag'""", null ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      resolve condense_tokens grammar.parse probe
  #.........................................................................................................
  done()
  return null

# #-----------------------------------------------------------------------------------------------------------
# @[ "HTML.$datoms_from_html" ] = ( T, done ) ->
#   INTERTEXT                 = require '../..'
#   { HTML, }                 = INTERTEXT
#   SP                        = require 'steampipes'
#   # SP                        = require '../../apps/steampipes'
#   { $
#     $async
#     $drain
#     $watch
#     $show  }                = SP.export()
#   #.........................................................................................................
#   probe         = """
#     <p>A <em>concise</em> introduction to the things discussed below.</p>
#     """
#   matcher = [{"$key":"<p"},{"text":"A ","$key":"^text"},{"$key":"<em"},{"text":"concise","$key":"^text"},{"$key":">em"},{"text":" introduction to the things discussed below.","$key":"^text"},{"$key":">p"}]
#   #.........................................................................................................
#   pipeline      = []
#   pipeline.push [ ( Buffer.from probe ), ]
#   pipeline.push SP.$split()
#   pipeline.push HTML.$datoms_from_html()
#   pipeline.push $show()
#   pipeline.push $drain ( result ) =>
#     help jr result
#     T.eq result, matcher
#     done()
#   SP.pull pipeline...
#   #.........................................................................................................
#   return null


#-----------------------------------------------------------------------------------------------------------
@[ "_INDENTATION: parse (1)" ] = ( T, done ) ->
  grammar = ( require './indentation.grammar' ).indentation_grammar
  probes_and_matchers = [
    ["if 42:\n    43\nelse:\n  44",[{"$key":"<node","name":"document","start":0,"stop":24,"text":"if 42:\n    43\nelse:\n  44"},{"$key":"^token","name":"line","text":"if 42:","start":0,"stop":6},{"$key":"^token","name":"indent","text":"    ","start":7,"stop":11},{"$key":"^token","name":"line","text":"43","start":11,"stop":13},{"$key":"^token","name":"line","text":"else:","start":14,"stop":19},{"$key":"^token","name":"dedent","text":"","start":14,"stop":14},{"$key":"^token","name":"indent","text":"  ","start":20,"stop":22},{"$key":"^token","name":"line","text":"44","start":22,"stop":24},{"$key":"^token","name":"dedent","start":24,"stop":24,"text":""},{"$key":">node","name":"document","start":24,"stop":24}],null]
    ["   x = 42",[{"$key":"<node","name":"document","start":0,"stop":9,"text":"   x = 42"},{"$key":"^token","name":"indent","text":"   ","start":0,"stop":3},{"$key":"^token","name":"line","text":"x = 42","start":3,"stop":9},{"$key":"^token","name":"dedent","start":9,"stop":9,"text":""},{"$key":">node","name":"document","start":9,"stop":9}],null]
    ["   <!-- xx -->",[{"$key":"<node","name":"document","start":0,"stop":14,"text":"   <!-- xx -->"},{"$key":"^token","name":"indent","text":"   ","start":0,"stop":3},{"$key":"^token","name":"line","text":"<!-- xx -->","start":3,"stop":14},{"$key":"^token","name":"dedent","start":14,"stop":14,"text":""},{"$key":">node","name":"document","start":14,"stop":14}],null]
    ["L0\n  L1\n    L2\n      L3",[{"$key":"<node","name":"document","start":0,"stop":23,"text":"L0\n  L1\n    L2\n      L3"},{"$key":"^token","name":"line","text":"L0","start":0,"stop":2},{"$key":"^token","name":"indent","text":"  ","start":3,"stop":5},{"$key":"^token","name":"line","text":"L1","start":5,"stop":7},{"$key":"^token","name":"indent","text":"    ","start":8,"stop":12},{"$key":"^token","name":"line","text":"L2","start":12,"stop":14},{"$key":"^token","name":"indent","text":"      ","start":15,"stop":21},{"$key":"^token","name":"line","text":"L3","start":21,"stop":23},{"$key":"^token","name":"dedent","start":23,"stop":23,"text":""},{"$key":"^token","name":"dedent","start":23,"stop":23,"text":""},{"$key":"^token","name":"dedent","start":23,"stop":23,"text":""},{"$key":">node","name":"document","start":23,"stop":23}],null]
    ["L0\n  L1\n    L2\n  L1",[{"$key":"<node","name":"document","start":0,"stop":19,"text":"L0\n  L1\n    L2\n  L1"},{"$key":"^token","name":"line","text":"L0","start":0,"stop":2},{"$key":"^token","name":"indent","text":"  ","start":3,"stop":5},{"$key":"^token","name":"line","text":"L1","start":5,"stop":7},{"$key":"^token","name":"indent","text":"    ","start":8,"stop":12},{"$key":"^token","name":"line","text":"L2","start":12,"stop":14},{"$key":"^token","name":"dedent","text":"  ","start":15,"stop":17},{"$key":"^token","name":"line","text":"L1","start":17,"stop":19},{"$key":"^token","name":"dedent","start":19,"stop":19,"text":""},{"$key":">node","name":"document","start":19,"stop":19}],null]
    ["\n  \n\nL0\n  L1\n\n    \nOK\n",[{"$key":"<node","name":"document","start":1,"stop":21,"text":"  \n\nL0\n  L1\n\n    \nOK"},{"$key":"^token","name":"indent","text":"  ","start":1,"stop":3},{"$key":"^token","name":"line","text":"L0","start":5,"stop":7},{"$key":"^token","name":"dedent","text":"","start":5,"stop":5},{"$key":"^token","name":"indent","text":"  ","start":8,"stop":10},{"$key":"^token","name":"line","text":"L1","start":10,"stop":12},{"$key":"^token","name":"indent","text":"    ","start":14,"stop":18},{"$key":"^token","name":"line","text":"OK","start":19,"stop":21},{"$key":"^token","name":"dedent","text":"","start":19,"stop":19},{"$key":"^token","name":"dedent","text":"","start":19,"stop":19},{"$key":">node","name":"document","start":21,"stop":21}],null]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      resolve grammar.parse probe
  #.........................................................................................................
  done()
  return null


############################################################################################################
if module is require.main then do => # await do =>
  # debug ( k for k of ( require '../..' ).HTML ).sort().join ' '
  # await @_demo()
  test @
  # test @[ "API" ]
  # test @[ "HTML: parse (1)" ]
  # test @[ "HTML: parse (1a)" ]
  # test @[ "HTML: parse (dubious)" ]
  # test @[ "INDENTATION: parse (1)" ]
  # test @[ "HTML: parse (2)" ]
  # test @[ "HTML.html_from_datoms (singular tags)" ]
  # test @[ "HTML Cupofhtml (1)" ]
  # test @[ "HTML Cupofhtml (2)" ]
  # test @[ "HTML._parse_compact_tagname" ]

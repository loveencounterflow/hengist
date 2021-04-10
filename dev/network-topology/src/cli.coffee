
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'NETWORK-TOPOLOGY'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype()
{ isa
  validate
  validate_optional }     = types.export()
MIXA                      = require 'mixa'
SL                        = require 'intertext-splitlines'
{ freeze, }               = Object
SP                        = require './steampipes-extras'
{ $
  $watch
  $drain
  $split_lines
  $show
  $sample
  $batch }                = SP.export()
JFEE                      = require 'jfee'
{ spawn }                 = require 'child_process'


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
types.declare 'sql_insert_target_encoding', ( x ) -> x in [ 'binary', 'text', ]

#-----------------------------------------------------------------------------------------------------------
$echo_channels = ->
  return $watch ( d ) =>
    switch d.$key
      when '^stdout' then echo CND.yellow d.$value
      when '^stderr' then echo CND.red d.$value
      else debug d #.$value
    return null

#-----------------------------------------------------------------------------------------------------------
$process_nmap_output = ->
  blank_re              = /^\s*$/
  first_re              = /^Nmap scan report for (?<name>.*)\s+\((?<ip>[0-9a-f.]+)\)/
  first_noname_re       = /^Nmap scan report for (?<ip>[0-9a-f.]+)$/
  latency_re            = /^Host is up \((?<latency>\S+) latency\)\.$/
  mac_re                = /^MAC Address: (?<mac>[0-9A-F:]+) \((?<info>.*)\)$/
  entry                 = null
  return $ ( d, send ) ->
    return send d if d.$key in [ '<cp', '>cp', ]
    if d.$key isnt '^stdout'
      echo CND.red d.$value ? d
      return
    #.......................................................................................................
    line = d.$value
    return if ( line.match blank_re )?
    return if line.startsWith 'Starting Nmap '
    if line.startsWith 'Nmap done: '
      send freeze entry if entry?
      entry = null
    else if ( match = line.match first_re )?
      send freeze entry if entry?
      entry = { match.groups..., }
    else if ( match = line.match first_noname_re )?
      send freeze entry if entry?
      entry = { match.groups..., }
    else if line is 'Host is up.'
      entry.status = 'up'
    else if ( match = line.match latency_re )?
      entry.latency = match.groups.latency
      entry.status = 'up'
    else if ( match = line.match mac_re )?
      entry.mac   = match.groups.mac
      entry.info  = match.groups.info if match.groups.info? and ( match.groups.info isnt 'Unknown' )
    else
      echo CND.red '???', rpr line
    # echo CND.grey d
    return null

#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
show_hosts = -> new Promise ( resolve, reject ) =>
  source      = SP.new_push_source()
  pipeline    = []
  pipeline.push source
  pipeline.push SP.$split_channels()
  pipeline.push $process_nmap_output()
  pipeline.push $watch ( d ) ->
    return if d.$key in [ '<cp', '>cp', ]
    # echo CND.steel d
    echo CND.yellow ( d.ip ? '?' ), ( d.name ? '?' ), ( '(' + ( d.info ? '?' ) + ')' )
  # pipeline.push $show()
  pipeline.push $drain -> resolve()
  SP.pull pipeline...
  cp = spawn 'sudo', [ 'nmap', '-sn', '192.168.190.0/24', ]
  source.send x for await x from JFEE.Receiver.from_child_process cp
  source.end()
  #.........................................................................................................
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
cli = -> new Promise ( done ) =>
  #.........................................................................................................
  jobdefs =
    commands:
      #-----------------------------------------------------------------------------------------------------
      'show-hosts':
        description:  "create DB `tessera`"
        runner: ( d ) =>
          await show_hosts()
          done()
      # #-----------------------------------------------------------------------------------------------------
      # 'copy-data':
      #   description:  "copy data into DB; specify individual DSKs or 'all'"
      #   flags:
      #     'input':
      #       alias:        'i'
      #       type:         String
      #       positional:   true
      #       multiple:     'greedy'
      #       description:  "input file(s)"
      #   runner: ( d ) =>
      #     unless ( dsks = d.verdict.parameters.input )?
      #       warn "need at least one DSK; use 'all' to copy data from all files"
      #     debug '^33344^', { dsks, }
      #     await copy_data dsks
      #     done()
      # #-----------------------------------------------------------------------------------------------------
      # 'locate':
      #   description:  "given a DSK, locate file(s) in datasources"
      #   flags:
      #     'input':
      #       alias:        'i'
      #       type:         String
      #       positional:   true
      #       multiple:     'greedy'
      #       description:  "input file(s)"
      #   runner: ( d ) =>
      #     unless ( dsks = d.verdict.parameters.input )?
      #       warn "need at least one DSK; use 'all' for all files"
      #     await locate dsks
      #     done()
      # #-----------------------------------------------------------------------------------------------------
      # 'as-sql-insert':
      #   description:  "turn lines in text file into SQL insert statements"
      #   flags:
      #     'encode-to':
      #       alias:        't'
      #       type:         String
      #       fallback:     'binary'
      #       description:  "target encoding (text, binary)"
      #     'dsk':
      #       alias:        'd'
      #       type:         String
      #       fallback:     'UNKNOWN'
      #       description:  "Data Source Key (DSK) that identfies source"
      #     'batchsize':
      #       alias:        's'
      #       type:         Number
      #       fallback:     10000
      #       description:  "number of rows per insert statement (default 10'000)"
      #     'input':
      #       alias:        'i'
      #       positional:   true
      #       type:         String
      #       description:  "data source file"
      #   runner: ( d ) =>
      #     debug '^77665^', d.verdict
      #     input_path  = PATH.resolve process.cwd(), d.verdict.parameters.input
      #     encode_to   = d.verdict.parameters[ 'encode-to' ]
      #     dsk         = d.verdict.parameters.dsk
      #     batchsize   = d.verdict.parameters.batchsize
      #     await file_as_sql_inserts dsk, input_path, encode_to, batchsize
      #     done()
      # #-----------------------------------------------------------------------------------------------------
      # 'write':
      #   description:  "write challenging test data"
      #   flags:
      #     'input':
      #       alias:        'i'
      #       type:         String
      #       fallback:     'demo-data/challenging.template.txt'
      #       description:  "template to use"
      #     'output':
      #       alias:        'o'
      #       type:         String
      #       fallback:     'demo-data/challenging.txt'
      #       description:  "file to write data to"
      #   runner: ( d ) =>
      #     # write_challenging_data d.verdict.parameters.input, d.verdict.parameters.output
      #     input_path  = PATH.resolve process.cwd(), d.verdict.parameters.input
      #     output_path = PATH.resolve process.cwd(), d.verdict.parameters.output
      #     debug '^33442^', { input_path, output_path, }
      #     await write_challenging_data input_path, output_path
      #     done()
      # #-----------------------------------------------------------------------------------------------------
      # 'show-lines':
      #   description:  "show lines of file in hex with context"
      #   flags:
      #     'line':
      #       alias:        'l'
      #       type:         Number
      #       fallback:     null
      #       description:  "line nr to show"
      #     'input':
      #       alias:        'i'
      #       type:         String
      #       positional:   true
      #       fallback:     'demo-data/challenging.txt'
      #       description:  "path to file"
      #   runner: ( d ) =>
      #     line_nr     = d.verdict.parameters.line
      #     input_path  = PATH.resolve process.cwd(), d.verdict.parameters.input
      #     debug '^33442^', { line_nr, input_path, }
      #     await show_lines line_nr, input_path
      #     done()
      # #-----------------------------------------------------------------------------------------------------
      # 'detect-encoding':
      #   description:  "detect encoding of given file"
      #   flags:
      #     'input':
      #       alias:        'i'
      #       type:         String
      #       positional:   true
      #       fallback:     'demo-data/challenging.txt'
      #       description:  "path to file"
      #   runner: ( d ) =>
      #     input_path  = PATH.resolve process.cwd(), d.verdict.parameters.input
      #     await detect_encoding input_path
      #     done()
      # #-----------------------------------------------------------------------------------------------------
      # 'show-encodings':
      #   description:  "show encodings of given file"
      #   flags:
      #     'input':
      #       alias:        'i'
      #       type:         String
      #       positional:   true
      #       fallback:     'demo-data/strange-encodings.txt'
      #       description:  "path to file"
      #     'from':
      #       alias:        'f'
      #       type:         Number
      #       fallback:     1
      #       description:  "first line number"
      #     'to':
      #       alias:        't'
      #       type:         Number
      #       fallback:     Infinity
      #       description:  "last line number"
      #   runner: ( d ) =>
      #     first_lnr   = d.verdict.parameters.from
      #     last_lnr    = d.verdict.parameters.to
      #     input_path  = PATH.resolve process.cwd(), d.verdict.parameters.input
      #     debug '^2369^', { input_path, first_lnr, last_lnr, }
      #     await show_encodings input_path, first_lnr, last_lnr
      #     done()
      # #-----------------------------------------------------------------------------------------------------
      # 'test-utf8-byte-pattern':
      #   description:  "test utf-8 byte pattern contained in _utf8-byte-pattern.sh"
      #   runner: ( d ) =>
      #     await test_utf8_byte_pattern()
      #     done()
      # #-----------------------------------------------------------------------------------------------------
      # 'add-indexes':
      #   description:  "add indexes to DB"
      #   runner: ( d ) =>
      #     await add_indexes()
      #     done()
  #.........................................................................................................
  MIXA.run jobdefs, process.argv
  return null


############################################################################################################
if module is require.main then do =>
  # await demo_receiver()
  await cli()


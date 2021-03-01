

###

**Note** 'FRP' here is 'Functional *Relational* Programming' whereas it's most often used for 'Functional
*Reactive* Programming' these days, so maybe better call it **FunRelPro** or something like that.


> In FRP all *essential state* takes the form of relations, and the *essential logic* is expressed using
> relational algebra extended with (pure) user defined functions.—

> https://softwareengineering.stackexchange.com/a/170566/281585

[*A Relational Database Machine Based on Functional Programming Concepts* by Yasushi KIYOKI, Kazuhiko KATO
and Takashi MASUDA, University of Tsukuba, ca.
1985—1995](https://thelackthereof.org/docs/library/cs/database/KIYOKI,%20Yasushi%20et%20al:%20A%20Relational%20Database%20Machine%20Based%20on%20Functional%20Programming%20Concepts.pdf)

###

'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'FRP'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
FS                        = require 'fs'
RBW                       = require '../../../apps/rustybuzz-wasm/demo-nodejs-using-wasm'
ICQL                      = require '../../../apps/icql'
connector                 = require 'better-sqlite3'
icql_path                 = PATH.resolve PATH.join __dirname, '../demo-frp.icql'
db_path                   = ':memory:'


#-----------------------------------------------------------------------------------------------------------
@new_db = ( cfg ) ->
  db = ICQL.bind { connector, db_path, icql_path, }
  # db.pragma 'cache_size = 32000'
  # db.pragma 'synchronous = OFF' # makes file-based DBs much faster
  return db

#-----------------------------------------------------------------------------------------------------------
@create_tables = ( cfg ) ->
  cfg.db.create_table_text()

#-----------------------------------------------------------------------------------------------------------
@insert_text = ( cfg ) ->
  linenr = 0
  for line in cfg.text.split /\n/
    linenr++
    cfg.db.insert_line { linenr, line, }
  return linenr

#-----------------------------------------------------------------------------------------------------------
@demo_frp = ( cfg ) ->
  cfg    ?= {}
  cfg.db  = @new_db cfg
  @create_tables  cfg
  @insert_text    cfg
  debug '^3334^', d for d from cfg.db.sqlite_index_infos()
  #.........................................................................................................
  for row from cfg.db.get_all_texts()
    info row
  cfg.db.$.close()
  return null

#-----------------------------------------------------------------------------------------------------------
@bettersqlite3_memory = ( cfg ) => @_bettersqlite3 cfg, ':memory:'
@bettersqlite3_backup = ( cfg ) => @_bettersqlite3 cfg, ':memory:', true
@bettersqlite3_file   = ( cfg ) => @_bettersqlite3 cfg, '/tmp/hengist-in-memory-sql.benchmarks.db'



############################################################################################################
if require.main is module then do =>
  cfg =
    db_path:  ':memory:'
    text:     """Knuth–Liang hyphenation operates at the level of individual words, but there can be
      ambiguity as to what constitutes a word. All hyphenation dictionaries handle the expected set of
      word-forming graphemes"""


  await @demo_frp cfg


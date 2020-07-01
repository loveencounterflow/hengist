
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'SNIPPETS/PSQL'
debug                     = CND.get_logger 'debug',     badge
alert                     = CND.get_logger 'alert',     badge
whisper                   = CND.get_logger 'whisper',   badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
FS                        = require 'fs'
PATH                      = require 'path'
CP                        = require 'child_process'

#-----------------------------------------------------------------------------------------------------------
@demo = ->
  debug 'before'
  # command = """psql -U interplot -d interplot -c "select * from U.variables where key ~ 'harfb' order by key" """
  command   = """psql -U interplot -d interplot -f "/home/flow/jzr/interplot/db/100-harfbuzz.sql" """
  settings  =
    # cwd:
    serialization:  'json'
    # serialization:  'advanced'
    shell:          true
    stdio: ['inherit', 'inherit', 'inherit', ]
  cp        = CP.spawn command, null, settings
  # cp.stdout.on 'data', ( data ) ->
  #   data = data.toString 'utf-8'
  #   help rpr data
  # cp.stdout.on 'error', ( error ) -> warn "stdout.on 'error'  ", rpr error
  # cp.stderr.on 'data',  ( data )  -> warn "stderr.on 'data'   ", rpr data.toString 'utf-8'
  # cp.stderr.on 'error', ( error ) -> warn "stderr.on 'error'  ", rpr error
  debug 'after'
  debug cp.channel

@d = ->
  ```
  const { spawn } = require('child_process');
  const ls = spawn('ls', ['-lh', '/usr']);

  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
  ```
  debug 'after'


############################################################################################################
if module is require.main then do =>
  @demo()
  # @d()



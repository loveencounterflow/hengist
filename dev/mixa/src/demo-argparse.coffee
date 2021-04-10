

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/MIXA/DEMO'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require 'guy-test'
# PATH                      = require 'path'
# FS                        = require 'fs'
_strip_ansi               = require 'strip-ansi'
types                     = new ( require 'intertype' ).Intertype()
{ freeze
  lets }                  = require 'letsfreezethat'


# debug ( k for k of require 'argparse' )
AP = require 'argparse'
version = '1.2.3'

# Formatter with support of `\n` in Help texts.
class HelpFormatter extends AP.RawDescriptionHelpFormatter
  # executes parent _split_lines for each line of the help, then flattens the result
  _split_lines: ( text, width ) ->
    return [].concat ( ( text.split '\n' ).map ( line ) => super._split_lines line, width )...

configuration =
  description:      'Argparse example',
  add_help:         true,
  formatter_class:  HelpFormatter

parser = new AP.ArgumentParser configuration;


parser.add_argument '-v', '--version',  { action: 'version', version, }
parser.add_argument '-f', '--foo',      { help: 'foo bar',            }
parser.add_argument '-b', '--bar',      { help: 'bar foo',            }
parser.add_argument '--baz',            { help: 'baz bar',            }



help parser.parse_args()

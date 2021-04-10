

'use strict'


############################################################################################################
CND                       = require 'cnd'
badge                     = 'GITCOLLECTOR'
debug                     = CND.get_logger 'debug',     badge
alert                     = CND.get_logger 'alert',     badge
whisper                   = CND.get_logger 'whisper',   badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
echo                      = CND.echo.bind CND
INTERTEXT                 = require 'intertext'
{ rpr }                   = INTERTEXT.export()
gitlog                    = ( require 'gitlog' ).gitlogPromise


############################################################################################################
if module is require.main then do =>
  d =
    repo:     '.'
    number:   1e6
    all:      true
  for entry in await gitlog d
    { abbrevHash
      subject
      authorDate
      files
      status  } = entry
    date        = authorDate
    status      = "#{files.length} #{status.join ''}"
    id          = abbrevHash
    subject     = subject[ ... 50 ].padEnd 50
    echo [ id, date, subject, status, ].join ' '
  return null









############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'GUY/TESTS'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
# GUY                       = require 'guy'
require 'deasync'

# #-----------------------------------------------------------------------------------------------------------
# print_later       = -> GUY.async.after 0.1, -> help "f got called"
# print_later_sync  = GUY.nowait.for_awaitable print_later

# info '^764-1^'
# print_later()
# info '^764-2^'
# print_later_sync()
# info '^764-3^'



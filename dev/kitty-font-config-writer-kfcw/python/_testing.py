#-----------------------------------------------------------------------------------------------------------
# from _testing import C
# from _testing import debug
# from _testing import urge
# from _testing import help
# from typing import NamedTuple
# from typing import Union
# from typing import Tuple
# from typing import Iterable
# from typing import List
# from functools import total_ordering
# from typing import NewType
from typing import Any


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
class C:
  ### thx to https://www.geeksforgeeks.org/print-colors-python-terminal/ ###
  reset         = '\033[0m'
  bold          = '\033[01m'
  disable       = '\033[02m'
  underline     = '\033[04m'
  reverse       = '\033[07m'
  strikethrough = '\033[09m'
  invisible     = '\033[08m'
  class fg:
    black       = '\033[30m'
    red         = '\033[31m'
    green       = '\033[32m'
    orange      = '\033[33m'
    blue        = '\033[34m'
    purple      = '\033[35m'
    cyan        = '\033[36m'
    grey        = '\033[37m'
    darkgrey    = '\033[90m'
    lightred    = '\033[91m'
    lightgreen  = '\033[92m'
    yellow      = '\033[93m'
    lightblue   = '\033[94m'
    pink        = '\033[95m'
    lightcyan   = '\033[96m'
  class bg:
    black       = '\033[40m'
    red         = '\033[41m'
    green       = '\033[42m'
    orange      = '\033[43m'
    blue        = '\033[44m'
    purple      = '\033[45m'
    cyan        = '\033[46m'
    grey        = '\033[47m'

#-----------------------------------------------------------------------------------------------------------
def debug(  *P: Any ) -> None: print( C.fg.purple, end = '' ); print( *P, end = '' ); print( C.reset )
def urge(   *P: Any ) -> None: print( C.fg.orange, end = '' ); print( *P, end = '' ); print( C.reset )
def help(   *P: Any ) -> None: print( C.fg.green,  end = '' ); print( *P, end = '' ); print( C.reset )


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
class Testing:

  #-----------------------------------------------------------------------------------------------------------
  def __init__( me ) -> None:
    me.passes = 0
    me.fails  = 0

  #-----------------------------------------------------------------------------------------------------------
  def ok( me, ref: str, result: Any ) -> None:
    if result == True:
      me.passes += +1
    else:
      me.fails += +1
      print( f"{C.bg.red}ref {ref}: fail: not true: {result}{C.reset}" )

  #-----------------------------------------------------------------------------------------------------------
  def eq( me, ref: str, result: Any, matcher: Any ) -> None:
    if result == matcher:
      me.passes += +1
    else:
      me.fails += +1
      print( f"ref {ref}: fail: received {C.fg.red}{result}{C.reset}, expected {C.fg.orange}{matcher}{C.reset}" )

  #-----------------------------------------------------------------------------------------------------------
  def ne( me, ref: str, result: Any, matcher: Any ) -> None:
    if result != matcher:
      me.passes += +1
    else:
      me.fails += +1
      print( f"{C.bg.red}ref {ref}: fail: received {result}{C.reset}"   )
      print( f"{C.bg.red}ref {ref}: fail: expected {matcher}{C.reset}"  )

  #-----------------------------------------------------------------------------------------------------------
  def fail( me, ref: str, message: str ) -> None:
    me.fails += +1
    print( f"{C.bg.red}ref {ref}: fail: {message}{C.reset}" )

  #-----------------------------------------------------------------------------------------------------------
  def report( me ) -> None:
    print( f"{C.fg.lightblue}{C.bold}Test Report{C.reset}" )
    if me.fails == 0:
      print( f"{C.fg.grey   }fails:   {me.fails}{C.reset}"  )
      print( f"{C.fg.green  }passes:  {me.passes}{C.reset}"   )
    else:
      print( f"{C.fg.red    }fails:   {me.fails}{C.reset}"  )
      print( f"{C.fg.grey   }passes:  {me.passes}{C.reset}"   )


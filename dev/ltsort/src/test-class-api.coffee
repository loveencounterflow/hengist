
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
  whisper }               = GUY.trm.get_loggers 'INTERTEXT-LEXER/TESTS/TOPOSORT'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
# FS                        = require 'fs'
types                     = new ( require '../../../apps/intertype' ).Intertype
{ isa
  equals
  type_of
  validate }              = types
SQL                       = String.raw
guy                       = require '../../../apps/guy'
H                         = require '../../../lib/helpers'
{ DATOM }                 = require '../../../apps/datom'
{ new_datom
  lets
  stamp     }             = DATOM


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
show = ( topograph ) ->
  LTSORT                    = require '../../../apps/ltsort'
  try dependencies = LTSORT.group topograph catch error
    throw error unless ( error.message.match /detected cycle involving node/ )?
    warn GUY.trm.reverse error.message
    warn '^08-1^', GUY.trm.reverse error.message
    # throw new DBay_sqlm_circular_references_error '^dbay/dbm@4^', name, ref_name
  info '^08-2^', dependencies
  try ordering = LTSORT.linearize topograph catch error
    throw error unless ( error.message.match /detected cycle involving node/ )?
    warn '^08-3^', GUY.trm.reverse error.message
    # throw new DBay_sqlm_circular_references_error '^dbay/dbm@4^', name, ref_name
  table = []
  for [ name, precedents, ] from topograph.precedents.entries()
    precedents = precedents.join ', '
    table.push { name, precedents, }
  H.tabulate "topograph", table
  info '^08-4^', ( GUY.trm.yellow x for x in ordering ).join GUY.trm.grey ' => '
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@instantiation = ( T, done ) ->
  { Ltsort }  = require '../../../apps/ltsort'
  g           = new Ltsort()
  debug '^40-1^', g
  T?.eq ( rpr g ), "Ltsort { cfg: { loners: true } }"
  T?.eq g.cfg.loners, true
  T?.eq g.linearize(), []
  T?.eq ( g.linearize { groups: true, } ), [[]]
  done?()

#-----------------------------------------------------------------------------------------------------------
@add_nodes = ( T, done ) ->
  { Ltsort }  = require '../../../apps/ltsort'
  g           = new Ltsort()
  T?.eq ( type_of g.add ), 'function'
  #.........................................................................................................
  g.add { name: 'first', }
  g.add { name: 'second', }
  g.add { name: 'third', }
  #.........................................................................................................
  do ->
    result      = g.linearize()
    T?.eq result, [ 'first', 'second', 'third', ]
  #.........................................................................................................
  do ->
    result      = g.linearize { groups: true, }
    T?.eq result, [ [ 'first', 'second', 'third' ] ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@use_relatives = ( T, done ) ->
  { Ltsort }  = require '../../../apps/ltsort'
  g           = new Ltsort()
  #.........................................................................................................
  g.add { name: 'getup',                                    }
  g.add { name: 'brushteeth',                               }
  g.add { name: 'shop',                                     }
  g.add { name: 'cook',                   before: 'eat',    }
  g.add { name: 'serve',  after: 'cook',  before: 'eat',    }
  g.add { name: 'dishes', after: 'eat',   before: 'sleep',  }
  g.add { name: 'loner1',                                   }
  g.add { name: 'loner2',                                   }
  g.add { name: 'loner3',                                   }
  g.add { name: 'sleep',                                    }
  g.add { name: 'eat',    after: [ 'cook', 'shop', ],       }
  #.........................................................................................................
  do ->
    result      = g.linearize()
    T?.eq result, [ 'getup', 'brushteeth', 'shop', 'cook', 'serve', 'eat', 'dishes', 'sleep', 'loner1', 'loner2', 'loner3' ]
  #.........................................................................................................
  do ->
    result      = g.linearize { groups: true, }
    T?.eq result, [ [ 'getup', 'brushteeth', 'loner1', 'loner2', 'loner3' ], [ 'shop', 'cook' ], [ 'serve' ], [ 'eat' ], [ 'dishes' ], [ 'sleep' ] ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@use_global_relatives = ( T, done ) ->
  { Ltsort }  = require '../../../apps/ltsort'
  g           = new Ltsort()
  #.........................................................................................................
  g.add { name: 'cook',                       before: 'eat',  }
  g.add { name: 'serve',      after: 'cook',  before: 'eat',  }
  g.add { name: 'eat',        after: [ 'cook', 'shop', ],     }
  g.add { name: 'shop',                       before: '*',    }
  g.add { name: 'brushteeth',                 before: '*',    }
  g.add { name: 'getup',                      before: '*',    }
  g.add { name: 'dishes',     after: '*',                     }
  g.add { name: 'sleep',      after: '*',                     }
  g.add { name: 'loner1',                                     }
  g.add { name: 'loner2',                                     }
  g.add { name: 'loner3',                                     }
  #.........................................................................................................
  do ->
    result      = g.linearize()
    T?.eq result, [ 'getup', 'brushteeth', 'shop', 'cook', 'serve', 'eat', 'dishes', 'sleep', 'loner1', 'loner2', 'loner3' ]
  #.........................................................................................................
  do ->
    result      = g.linearize { groups: true, }
    T?.eq result, [ [ 'loner1', 'loner2', 'loner3' ], [ 'getup' ], [ 'brushteeth' ], [ 'shop' ], [ 'cook' ], [ 'serve' ], [ 'eat' ], [ 'dishes' ], [ 'sleep' ] ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@before_and_after_with_antecedents_and_subsequents_1 = ( T, done ) ->
  { Ltsort }  = require '../../../apps/ltsort'
  #.........................................................................................................
  g           = new Ltsort()
  g.add { name: 't1',   before: '*',    }
  g.add { name: 't2',   before: '*',    }
  g.add { name: 't3',   before: '*',    }
  g.add { name: 'middle',               }
  T?.eq g.linearize(),  [ 't3', 't2', 't1', 'middle' ]
  g.add { name: 'bully-t3-before', before: 't3',  }
  g.add { name: 'bully-t3-after', after: 't3',  }
  debug '^23-1^', g.precedents
  T?.eq ( g.linearize() ), [ 'bully-t3-before', 't3', 't2', 't1', 'bully-t3-after', 'middle' ]
  #.........................................................................................................
  done?()


#-----------------------------------------------------------------------------------------------------------
@before_and_after_with_antecedents_and_subsequents_2 = ( T, done ) ->
  { Ltsort }  = require '../../../apps/ltsort'
  #.........................................................................................................
  g           = new Ltsort()
  g.add { name: 't3',   after: '*',    }
  g.add { name: 't2',   after: '*',    }
  g.add { name: 't1',   after: '*',    }
  g.add { name: 'middle',               }
  T?.eq ( g.linearize() ), [ 't3', 't2', 't1', 'middle', ]
  g.add { name: 'middle', after: 't3', before: 't2', }
  T?.eq ( g.linearize() ), [ 't3', 'middle', 't2', 't1', ]
  g.add { name: 'bully-t1-after', after: 't1',  }
  g.add { name: 'bully-t1-before', before: 't1',  }
  T?.eq ( g.linearize() ), [ 't3', 'middle', 't2', 'bully-t1-before', 't1', 'bully-t1-after' ]
  #.........................................................................................................
  done?()


#-----------------------------------------------------------------------------------------------------------
@before_and_after_with_antecedents_and_subsequents_3 = ( T, done ) ->
  { Ltsort }  = require '../../../apps/ltsort'
  #.........................................................................................................
  g           = new Ltsort()
  g.add { name: 'top3',     before: '*',  }
  g.add { name: 'top2',     before: '*',  }
  g.add { name: 'top1',     before: '*',  }
  g.add { name: 'bottom3',  after: '*',   }
  g.add { name: 'bottom2',  after: '*',   }
  g.add { name: 'bottom1',  after: '*',   }
  g.add { name: 'middle',   after: 'top3', before: 'bottom3', }
  T?.eq g.linearize(),  [ 'top1', 'top2', 'top3', 'middle', 'bottom3', 'bottom2', 'bottom1' ]
  #.........................................................................................................
  done?()



############################################################################################################
if require.main is module then do =>
  # @_toposort()
  test @
  # @instantiation()
  # test @instantiation
  # test @add_nodes
  # @use_global_relatives()
  # test @use_global_relatives
  # test @before_and_after_with_antecedents_and_subsequents_3


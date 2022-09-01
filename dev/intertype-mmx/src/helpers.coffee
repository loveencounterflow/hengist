
'use strict'


@deep_copy                  = structuredClone
# @equals                     = require '../deps/jkroso-equals'
@nameit                     = ( name, f ) -> Object.defineProperty f, 'name', { value: name, }
class @Intertype_abc




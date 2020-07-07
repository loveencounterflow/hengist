

demo = ->
  intertype = new Intertype()
  { isa
    validate
    type_of
    types_of
    size_of
    declare
    all_keys_of } = intertype.export()
  urge size_of '𣁬𡉜𠑹𠅁', 'codepoints'

  intertype.declare 'point',
    size:   2
    tests:
      '? is an object':   ( x ) -> @isa.object x
      '?.x is set':       ( x ) -> @has_key    x, 'x'
      '?.y is set':       ( x ) -> @has_key    x, 'y'
      '?.x is a float':   ( x ) -> @isa.float  x.x
      '?.y is a float':   ( x ) -> @isa.float  x.x
  intertype.declare 'vector',
    size:   2
    tests:
      '? is a list':        ( x ) -> @isa.list   x
      'size of ? is 2':     ( x ) -> ( @size_of x ) is 2
      '?[ 0 ] is a float':  ( x ) -> @isa.float x[ 0 ]
      '?[ 1 ] is a float':  ( x ) -> @isa.float x[ 1 ]
  info isa.point 42
  info isa.point { x: 42, y: 108, }
  info isa.point { x: Infinity, y: 108, }

  tests = [
    [ 1,  ( -> validate.float    42                         ), ]
    [ 1,  ( -> validate.float     42                         ), ]
    [ 2,  ( -> validate.integer   42                         ), ]
    [ 3,  ( -> validate.even      42                         ), ]
    [ 4,  ( -> validate.float    42.5                       ), ]
    [ 4,  ( -> validate.float     42.5                       ), ]
    [ 5,  ( -> validate.integer   42.5                       ), ]
    [ 6,  ( -> validate.even      42.5                       ), ]
    [ 7,  ( -> validate.point     42                         ), ]
    [ 8,  ( -> validate.point     { x: 42, y: 108, }         ), ]
    [ 9,  ( -> validate.point     { y: 108, }                ), ]
    [ 10, ( -> validate.point     { x: Infinity, y: 108, }  ), ]
    [ 11, ( -> validate.vector    null                      ), ]
    [ 12, ( -> validate.vector    [ 2, ]                    ), ]
    [ 13, ( -> validate.vector    [ 2, 3, ]                 ), ]
    [ 14, ( -> validate.regex     [ 2, 3, ]                 ), ]
    [ 15, ( -> validate.regex     /x/                       ), ]
    [ 16, ( -> validate.regex     /^x$/g                    ), ]
    [ 17, ( -> isa.regex          /x/                       ), ]
    [ 18, ( -> isa.regex          /^x$/g                    ), ]
    ]
  for [ nr, test, ] in tests
    try
      result = test()
    catch error
      warn nr, error.message
      # throw error
      continue
    info nr, result

  help isa.float 42
  help isa.float new Number 42
  help types_of 42
  help types_of new Number 42
  debug 'µ12233', types_of []



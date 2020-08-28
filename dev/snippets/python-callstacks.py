
import traceback



def h():
  print( '^h^', len( traceback.extract_stack() ) )

def g():
  print( '^g^', len( traceback.extract_stack() ) )
  h()

def f():
  print( '^f^', len( traceback.extract_stack() ) )
  g()

f()


def nats( n ):
  if n > 5:
    return
  print( f"^nats@{n}^", len( traceback.extract_stack() ) )
  yield n
  yield from nats( n + 1 )

i = nats( 1 )
print( next( i ) )
print( next( i ) )
print( next( i ) )
print( next( i ) )




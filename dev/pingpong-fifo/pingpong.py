# import mmap
# import os

# mm = mmap.mmap(-1, 13)
# mm.write(b"Hello world!")

# pid = os.fork()
# print( "^3476^", f"pid: {pid}" )

# if pid == 0:  # In a child process
#   mm.seek(0)
  # print( "^8777^", mm.readline())
#   print( "^8777^", mm.readline())
#   print( "^8777^", mm.readline())
#   print( "^8777^", mm.readline())

#   mm.close()

# import tailer # import Tailer
# path  = 'communication.txt'
# file  = open( path )
# lines = tailer.tail( file )

# for line in lines:
#   print( "^7764^", repr( line ) )

# for line in tailer.follow( file ):

import sys
import os
import json
my_pid = os.getpid()

# #-----------------------------------------------------------------------------------------------------------
# class AttributeDict(dict):
#   def __getattr__(self, attr):
#     return self[attr]
#   def __setattr__(self, attr, value):
#     self[attr] = value

# #-----------------------------------------------------------------------------------------------------------
# def get_pingpong_path():
#   with open( '/tmp/intershop-pingpong.pid' ) as pidfile:
#     pingpong_pid  = int( pidfile.readline() )
#     return "/proc/{}/fd/1".format( pingpong_pid )
# pingpong_path = get_pingpong_path()

#-----------------------------------------------------------------------------------------------------------
# with open( pingpong_path, 'w' ) as pingpong_file:
input_path    = '/tmp/intershop-fifo-to-python'
output_path   = '/tmp/intershop-fifo-to-nodejs'
nr            = 0
for nr in range( 1, 10 ):
  with open( output_path, 'w' ) as pingpong_file:
    # nr   += 1
    d             = { '$key': '^rpc', '$pid': my_pid, 'module': 'intertext', 'method': 'get_fortytwo', }
    d[ '$value' ] = [ nr, ]
    d[ '$id' ]    = "c{}".format( nr )
    d_txt         = json.dumps( d )
    line          = "json:{}:\n".format( d_txt )
    print( '<<<<', repr( line ) )
    pingpong_file.write( line )
  #-----------------------------------------------------------------------------------------------------------
  with open( input_path, 'r' ) as pingpong_file:
    for line in pingpong_file:
      print( ">>>>", repr( line ) )
      break








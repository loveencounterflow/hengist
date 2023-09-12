

'use strict'
{ log } = console

for i in [ 1 .. 3 ]
  `foo:`
  for j in [ 1 .. 3 ]
    `break foo` if i is j
    log i, j


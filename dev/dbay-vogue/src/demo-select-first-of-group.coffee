
'use strict'



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-VOGUE/DEMO-OBJECT-CREATION'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
types                     = new ( require 'intertype' ).Intertype()
H                         = require '../../../lib/helpers'


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  { Vogue } = require '../../../apps/dbay-vogue'
  vogue     = new Vogue()
  db        = vogue.vdb.db
  SQL       = db.constructor.SQL
  #---------------------------------------------------------------------------------------------------------
  db SQL"""create table product_sales(
        product     text  not null,
        order_date  date  not null,
        sale        int   not null );"""
  #---------------------------------------------------------------------------------------------------------
  db SQL"""create view _product_sales_ordered as select
        row_number() over w as nr,
        *
      from product_sales
      window w as (
        partition by product
        order by order_date desc )
      order by product;"""
  #---------------------------------------------------------------------------------------------------------
  db SQL"""create view latest_product_sales as select
        *
      from _product_sales_ordered
      where nr = 1
      order by product;"""
  #---------------------------------------------------------------------------------------------------------
  db SQL"""create view latest_product_sales_2 as select
        product           as product,
        max( order_date ) as order_date,
        sale              as sale
      from product_sales
      group by product
      order by product;"""
  #---------------------------------------------------------------------------------------------------------
  db SQL"""
    insert into product_sales(product,order_date, sale)
         values('A','2020-05-01',250),
         ('B','2020-05-01',350),
         ('C','2020-05-01',1250),
         -- ................................................................................................
         ('A','2020-05-02',450),
         ('B','2020-05-02',650),
         ('C','2020-05-02',1050),
         -- ................................................................................................
         ('A','2020-05-03',150),
         ('B','2020-05-03',250),
         ('C','2020-05-03',1850);"""
  #---------------------------------------------------------------------------------------------------------
  H.tabulate "_product_sales_ordered", db SQL"""select * from _product_sales_ordered;"""
  H.tabulate "latest_product_sales",   db SQL"""select * from latest_product_sales;"""
  H.tabulate "latest_product_sales_2", db SQL"""select * from latest_product_sales_2;"""
  #---------------------------------------------------------------------------------------------------------
  return null


############################################################################################################
if module is require.main then do =>
  await demo_1()


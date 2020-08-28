

-- \set ECHO queries

/* ###################################################################################################### */
\ir './_trm.sql'
-- \ir './set-signal-color.sql'
-- \ir './test-begin.sql'
-- \pset pager off
\timing off
-- ---------------------------------------------------------------------------------------------------------
begin transaction;

-- \ir '../080-intertext.sql'
-- \set filename interplot/db/tests/080-intertext.sql
\set filename intershop-lazy-functions-with-multiple-return-fields.sql
\set signal :red

-- ---------------------------------------------------------------------------------------------------------
\echo :signal ———{ :filename 1 }———:reset
drop schema if exists X cascade; create schema X;




-- =========================================================================================================
--
-- ---------------------------------------------------------------------------------------------------------


/* ###################################################################################################### */
\echo :signal ———{ :filename 15 }———:reset

-- ---------------------------------------------------------------------------------------------------------
\echo :signal ———{ :filename 20 }———:reset
create table X.cache (
  a           float,
  b           float,
  quotient    integer,
  remainder   integer,
  remark      text,
  primary key ( a, b ) );

insert into X.cache values
  ( 7, 3, 2, 1, 'another division' );

-- ---------------------------------------------------------------------------------------------------------
\echo :signal ———{ :filename 20 }———:reset
create function X.divide_lazy( in ¶a float, in ¶b float, out quotient integer, out remainder integer, out remark text )
  volatile strict language plpgsql as $$
  declare
    ok boolean;
  begin
    select
        true,
        c.quotient,
        c.remainder,
        c.remark
      from X.cache as c where c.a = ¶a and c.b = ¶b
      into ok, quotient, remainder, remark;
    if ok then
      raise notice using message = format( '^376^ X.divide_lazy( %L, %L ) -> ... from cache', ¶a, ¶b );
      return; end if;
    raise notice using message = format( '^376^ X.divide_lazy( %L, %L ) -> ... computed', ¶a, ¶b );
    if ¶a = 13 then
      quotient  := null;
      remainder := null;
      remark    := 'no luck here';
    else
      quotient  := ¶a::integer / ¶b::integer;
      remainder := ¶a - ¶b * quotient;
      remark    := 'a fresh result';
      end if;
    insert into X.cache ( a, b, quotient, remainder, remark )
      values ( ¶a, ¶b, quotient, remainder, remark );
    return;
    end; $$;


-- ---------------------------------------------------------------------------------------------------------
\echo :signal ———{ :filename 16 }———:reset
select * from X.divide_lazy( 7, 3 )  union all
select * from X.divide_lazy( 7, 3 )  union all
select * from X.divide_lazy( 7, 4 )  union all
select * from X.divide_lazy( 13, 4 ) union all
select * from X.divide_lazy( 13, 4 );
select * from X.cache;


/* ###################################################################################################### */
\echo :red ———{ :filename 7 }———:reset
\quit




-- do $$ begin perform INVARIANTS.validate(); end; $$;

-- -- instead.









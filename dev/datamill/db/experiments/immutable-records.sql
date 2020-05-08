

/*

see https://github.com/loveencounterflow/gaps-and-islands#immutable-columns-in-sql

# Immutable Columns with SQL

In the generic table `datoms`, created below, we want to have a field `stamped`, default `false` that may be
set to `true` to indicate the datom is outdated and is no longer in use; apart from that, we want to
prohibit any other update to any row, including setting `stamped` to `false` again (and thereby
re-activating the record).

We achieve that in Solution A by adding a `before update` trigger on the table; for convenience, we have
excluded all calls to `update datoms` by adding a clause `when ( old is distinct from new )` *to the `create
trigger` statement*; in other words, the trigger function will only be called when the conditions in the
`when` clause are met.

Using this technique, it is possible to shift *all* of the logic from the trigger function to the trigger
declaration, as we have done in Solution B. The first two conditions,

```sql
  for each row when (
    old is distinct from new and (
      ( old.stamped = true and new.stamped = false ) or
```

do look readable enough, however, the third one,

```sql
      ( array_length( akeys( hstore( new ) - hstore( old ) - array[ 'stamped' ] ), 1 ) > 0 ) ) )
```

is much harder to understand; maybe translating it to a function call could help.



*/

-- \set ECHO queries

/* ###################################################################################################### */
\ir './_trm.sql'
-- \ir './set-signal-color.sql'
-- \ir './test-begin.sql'
-- \pset pager on
\timing off
\set filename datamill/000-first.sql
\set signal :green

-- ---------------------------------------------------------------------------------------------------------
\echo :signal ———{ :filename 1 }———:reset
drop schema if exists IMMUTABLE cascade; create schema IMMUTABLE;

set role dba;
create extension if not exists hstore;
reset role;


-- #########################################################################################################
-- SOLUTION A
-- #########################################################################################################
begin transaction;

-- ---------------------------------------------------------------------------------------------------------
\echo :signal ———{ :filename 2 }———:reset
create table IMMUTABLE.datoms (
  vnr         integer[],
  key         text,
  value       jsonb,
  stamped     boolean default false,
  primary key ( vnr ) );

-- ---------------------------------------------------------------------------------------------------------
\echo :signal ———{ :filename 3 }———:reset
create function IMMUTABLE.on_before_update_datoms() returns trigger language plpgsql as $$
  /* thx to https://stackoverflow.com/a/23792079/7568091 for the hstore thing */
  declare
    ¶changes text[];
  begin
    -- .....................................................................................................
    if old.stamped = true and new.stamped = false then
      raise sqlstate 'IMM01' using message = format(
        'illegal to set field %s of record %s to %s', 'stamped', old, true );
      end if;
    -- .....................................................................................................
    ¶changes := akeys( hstore( new ) - hstore( old ) - array[ 'stamped' ] );
    if array_length( ¶changes, 1 ) > 0 then
      raise sqlstate 'IMM02' using message = format(
        'illegal to update fields %s of record %s', ¶changes, old );
      end if;
    return new; end; $$;
    -- perform log( '^IMMUTABLE@44644^', old::text, '->', new::text );
    -- select column_name as name from information_schema.columns
    -- where table_schema = tg_table_schema and table_name = tg_table_name;

-- ---------------------------------------------------------------------------------------------------------
\echo :signal ———{ :filename 4 }———:reset
create trigger on_before_update_datoms before update on IMMUTABLE.datoms
  for each row when ( old is distinct from new ) execute procedure IMMUTABLE.on_before_update_datoms();

-- ---------------------------------------------------------------------------------------------------------
\echo :signal ———{ :filename 5 }———:reset
insert into IMMUTABLE.datoms ( vnr, key, value ) values
  ( '{1}', '^foo', '{"$value":42}' ),
  ( '{2}', '^foo', '{"$value":42}' ),
  ( '{3}', '^foo', '{"$value":42}' ),
  ( '{4}', '^foo', '{"$value":42}' );

-- ---------------------------------------------------------------------------------------------------------
\echo :signal ———{ :filename 5 }———:reset
-- select * from IMMUTABLE.datoms order by vnr;
do $$ begin
  begin update IMMUTABLE.datoms set key     = '^other'       where vnr = '{3}'; exception when others then raise notice '*error* (%) %', sqlstate, sqlerrm; end;
  begin update IMMUTABLE.datoms set value   = '{"foo":true}' where vnr = '{3}'; exception when others then raise notice '*error* (%) %', sqlstate, sqlerrm; end;
  begin update IMMUTABLE.datoms set stamped = true           where vnr = '{4}'; exception when others then raise notice '*error* (%) %', sqlstate, sqlerrm; end;
  begin update IMMUTABLE.datoms set stamped = false          where vnr = '{3}'; exception when others then raise notice '*error* (%) %', sqlstate, sqlerrm; end;
  begin update IMMUTABLE.datoms set stamped = false          where vnr = '{4}'; exception when others then raise notice '*error* (%) %', sqlstate, sqlerrm; end;
  end; $$;

-- select * from IMMUTABLE.datoms order by vnr;

rollback;

-- #########################################################################################################
-- SOLUTION B
-- #########################################################################################################
begin transaction;


-- ---------------------------------------------------------------------------------------------------------
\echo :signal ———{ :filename 2 }———:reset
create table IMMUTABLE.datoms (
  vnr         integer[],
  key         text,
  value       jsonb,
  stamped     boolean default false,
  primary key ( vnr ) );

-- ---------------------------------------------------------------------------------------------------------
\echo :signal ———{ :filename 3 }———:reset
create function IMMUTABLE.on_before_update_datoms() returns trigger language plpgsql as $$ begin
  raise sqlstate 'IMM04' using message = format( 'illegal to update record %s', old );
    end; $$;

-- ---------------------------------------------------------------------------------------------------------
/* thx to https://stackoverflow.com/a/23792079/7568091 for the hstore thing */
\echo :signal ———{ :filename 4 }———:reset
create trigger on_before_update_datoms before update on IMMUTABLE.datoms
  for each row when (
    old is distinct from new and (
      ( old.stamped = true and new.stamped = false ) or
      ( array_length( akeys( hstore( new ) - hstore( old ) - array[ 'stamped' ] ), 1 ) > 0 ) ) )
  execute procedure IMMUTABLE.on_before_update_datoms();

-- ---------------------------------------------------------------------------------------------------------
\echo :signal ———{ :filename 5 }———:reset
insert into IMMUTABLE.datoms ( vnr, key, value ) values
  ( '{1}', '^foo', '{"$value":42}' ),
  ( '{2}', '^foo', '{"$value":42}' ),
  ( '{3}', '^foo', '{"$value":42}' ),
  ( '{4}', '^foo', '{"$value":42}' );

-- ---------------------------------------------------------------------------------------------------------
\echo :signal ———{ :filename 5 }———:reset
-- select * from IMMUTABLE.datoms order by vnr;
do $$ begin
  begin update IMMUTABLE.datoms set key     = '^other'       where vnr = '{3}'; exception when others then raise notice '*error* (%) %', sqlstate, sqlerrm; end;
  begin update IMMUTABLE.datoms set value   = '{"foo":true}' where vnr = '{3}'; exception when others then raise notice '*error* (%) %', sqlstate, sqlerrm; end;
  begin update IMMUTABLE.datoms set stamped = true           where vnr = '{4}'; exception when others then raise notice '*error* (%) %', sqlstate, sqlerrm; end;
  begin update IMMUTABLE.datoms set stamped = false          where vnr = '{3}'; exception when others then raise notice '*error* (%) %', sqlstate, sqlerrm; end;
  begin update IMMUTABLE.datoms set stamped = false          where vnr = '{4}'; exception when others then raise notice '*error* (%) %', sqlstate, sqlerrm; end;
  end; $$;

select * from IMMUTABLE.datoms order by vnr;


rollback;
/* ###################################################################################################### */
\echo :red ———{ :filename 15 }———:reset
\quit








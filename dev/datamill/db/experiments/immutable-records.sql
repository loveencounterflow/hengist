

/*

# Immutable Columns with SQL

In the generic table `datoms`, created below, we want to have a field `stamped`, default `false` that may be
set to `true` to indicate the datom is outdated and is no longer in use; apart from that, we want to
prohibit any other update to any row, including setting `stamped` to `false` again (and thereby
re-activating the record).


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


-- ---------------------------------------------------------------------------------------------------------
\echo :signal ———{ :filename 2 }———:reset
create table IMMUTABLE.datoms (
	vnr 				integer[],
	key 				text,
	value		  	jsonb,
	stamped	  	boolean default false,
  primary key ( vnr ) );

-- ---------------------------------------------------------------------------------------------------------
\echo :signal ———{ :filename 3 }———:reset
create function IMMUTABLE.on_before_update_datoms() returns trigger language plpgsql as $$
  /* thx to https://stackoverflow.com/a/23792079/7568091 for the hstore thing */
	declare
		¶changes text[];
  begin
    -- .....................................................................................................
  	if new.stamped = true then
      raise exception 'IMMUTABLE ^00431^ not allowed to set field % of record % to %', 'stamped', old::text, true;
      end if;
    -- .....................................................................................................
    ¶changes := akeys( hstore( new ) - hstore( old ) - array[ 'stamped' ] );
    if array_length( ¶changes, 1 ) > 0 then
      raise exception 'IMMUTABLE ^00432^ not allowed to update fields % of record %', ¶changes, old::text;
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
select * from IMMUTABLE.datoms order by vnr;
-- update IMMUTABLE.datoms set key = '^other' where vnr = '{3}';
-- update IMMUTABLE.datoms set value = '{"foo":true}' where vnr = '{3}';
update IMMUTABLE.datoms set stamped = true where vnr = '{4}';
update IMMUTABLE.datoms set stamped = false where vnr = '{3}';
update IMMUTABLE.datoms set stamped = false where vnr = '{4}';
select * from IMMUTABLE.datoms order by vnr;

select column_name from information_schema.columns
where table_schema = 'immutable' and table_name = 'datoms';

/* ###################################################################################################### */
\echo :red ———{ :filename 15 }———:reset
\quit








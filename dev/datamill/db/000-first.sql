

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
drop schema if exists DEMO cascade; create schema DEMO;

-- =========================================================================================================
--
-- ---------------------------------------------------------------------------------------------------------
\echo :signal ———{ :filename 3 }———:reset
create table DEMO.datoms (
  -- doc         integer     not null references
  -- dsk
  -- dsnr
  vnr         VNR.vnr     not null,
  key         text        not null,
  atr         jsonb,      -- consider to use hstore
  stamped     boolean     not null default false,
  _vnr0       VNR.vnr     unique generated always as ( VNR.push( vnr, 0 ) ) stored,
  primary key ( vnr ) );

-- ---------------------------------------------------------------------------------------------------------
\echo :signal ———{ :filename 5 }———:reset
create function DEMO.on_before_update_datoms() returns trigger language plpgsql as $$ begin
  if ( old is not distinct from new ) then return new; end if;
  if ( old.stamped = true and new.stamped = false )
      or IMMUTABLE.record_has_changed( old, new, '{stamped,_vnr0}' ) then
    raise sqlstate 'IMM04' using message = format( 'illegal to update record %s -> %s', old, new );
    end if; return new; end; $$;

create trigger on_before_update_datoms
  before update on DEMO.datoms for each row execute procedure DEMO.on_before_update_datoms();

-- select * from MIRAGE.mirror where dsk = 'proposal' order by linenr;

/* ###################################################################################################### */
\echo :red ———{ :filename 15 }———:reset
\quit




-- =========================================================================================================
--
-- ---------------------------------------------------------------------------------------------------------
select * from CATALOG.catalog where schema = 'demo';





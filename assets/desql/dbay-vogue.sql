CREATE TABLE vogue_datasources (
    dsk     text not null,
    url     text not null,
  primary key ( dsk ) );
CREATE TABLE vogue_sessions (
    sid     integer not null,
    dsk     text    not null,
    ts      dt      not null,
  primary key ( sid ),
  foreign key ( dsk ) references vogue_datasources );
CREATE TABLE vogue_posts (
    sid     integer not null,
    pid     text    not null,
    rank    integer not null,
    details json    not null,
  primary key ( sid, pid ),
  foreign key ( sid ) references vogue_sessions );
CREATE TABLE vogue_tags (
    tag     text    not null,
  primary key ( tag ) );
CREATE TABLE vogue_tagged_posts (
    pid     text    not null,
    tag     text    not null,
  primary key ( pid, tag ),
  -- foreign key ( pid ) references vogue_posts,
  foreign key ( tag ) references vogue_tags );
CREATE TABLE vogue_trends_html (
    sid             integer not null,
    pid             integer not null,
    sparkline_data  text    not null,
    html            text    not null,
  primary key ( sid, pid ),
  foreign key ( sid, pid ) references vogue_posts );
CREATE VIEW vogue_XXX_ranks as select
    sid                                         as sid,
    pid                                         as pid,
    rank                                        as rank,
    coalesce( pid != lag(  pid ) over w, true ) as first,
    coalesce( pid != lead( pid ) over w, true ) as last
  from vogue_posts
  window w as (
    partition by pid
    order by sid )
  order by sid, pid;
CREATE VIEW vogue_XXX_grouped_ranks as select distinct
    pid                                     as pid,
    json_group_array( json_object(
      'sid',    sid,
      'rank',   rank,
      'first',  first,
      'last',   last ) ) over w               as xxx_trend
  from vogue_XXX_ranks
  window w as (
    partition by pid
    order by sid
    range between unbounded preceding and unbounded following )
  order by pid;
CREATE VIEW vogue_minmax_sids as select
    sessions.dsk      as dsk,
    min( sid ) over w as sid_min,
    max( sid ) over w as sid_max
  from vogue_posts    as posts
  join vogue_sessions as sessions using ( sid )
  window w as ( partition by dsk );
CREATE VIEW _vogue_trends_01 as
  select distinct
    sid                                                     as sid,
    pid                                                     as pid,
    json_group_array( json_array( sid, rank ) ) over w      as raw_trend
  from vogue_posts
  -- join vogue_minmax_sids using ( sid )
  window w as (
    partition by ( pid )
    order by rank
    range between unbounded preceding and current row )
;
CREATE VIEW vogue_trends as select
    sessions.dsk                                        as dsk,
    sessions.sid                                        as sid,
    sessions.ts                                         as ts,
    posts.pid                                           as pid,
    posts.rank                                          as rank,
    trends.raw_trend                                    as raw_trend,
    posts.details                                       as details
  from vogue_posts        as posts
  join vogue_sessions     as sessions     using ( sid )
  join _vogue_trends_01   as trends       using ( sid, pid )
  order by
    sid   desc,
    rank  asc;
CREATE VIEW vogue_ordered_trends as select
    row_number() over w as rnr, -- 'reverse number' b/c most recent appearances get to be number one
    dsk                 as dsk,
    sid                 as sid,
    ts                  as ts,
    pid                 as pid,
    rank                as rank,
    raw_trend           as raw_trend,
    details             as details
  from vogue_trends
  window w as ( partition by pid order by sid desc )
  order by
    sid   desc,
    rank  asc,
    rnr   asc
;
CREATE VIEW vogue_latest_trends as select
    rnr,
    dsk,
    sid,
    ts,
    pid,
    rank,
    raw_trend,
    details
  from vogue_ordered_trends
  where rnr = 1
  order by
    sid   desc,
    rank  asc,
    rnr   asc;
CREATE VIEW vogue_latest_trends_html as select
    *
  from vogue_trends_html as trends_html
  join vogue_latest_trends using ( sid, pid )
  order by
    sid   desc,
    rank  asc;
CREATE VIEW vogue_latest_trends_html as select
    *
  from vogue_trends_html  /* block comment demo */ as trends_html
  join vogue_latest_trends using ( sid, pid )
  order by
    sid   desc,
    rank  asc;

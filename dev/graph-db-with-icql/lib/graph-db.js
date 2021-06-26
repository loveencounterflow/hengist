(function() {
  'use strict';
  var CND, Dba, I, L, SQL, X, badge, debug, def, echo, help, info, jr, rpr, types, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'GRAPHDB';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  ({Dba} = require('../../../apps/icql-dba'));

  def = Object.defineProperty;

  types = require('./types');

  ({SQL, I, L, X} = new (require('../../../apps/icql-dba/lib/sql')).Sql());

  jr = JSON.stringify;

  //===========================================================================================================
  this.Graphdb = class Graphdb {
    //---------------------------------------------------------------------------------------------------------
    constructor(cfg) {
      var dba_cfg, path, ram, schema;
      // super()
      def(this, 'types', {
        enumerable: false,
        value: types
      });
      this.types.validate.gdb_constructor_cfg((cfg = {...this.types.defaults.gdb_constructor_cfg, ...cfg}));
      this.cfg = cfg;
      ({schema, ram, path} = this.cfg);
      def(this, 'dba', {
        enumerable: false,
        value: new Dba()
      });
      dba_cfg = {};
      if (schema != null) {
        dba_cfg.schema = schema;
      }
      if (ram != null) {
        dba_cfg.ram = ram;
      }
      if (path != null) {
        dba_cfg.path = path;
      }
      this.dba.open(dba_cfg);
      this.init_db();
      this.NG_init_db();
      return void 0;
    }

    //=========================================================================================================
    // SCHEMA
    //---------------------------------------------------------------------------------------------------------
    init_db() {
      /* TAINT edges are modelled as uniquely given by `( node_id_a, node_id_b )` with arbitrary data
         attached, but could conceivably link two given nodes with any number of edges */
      var sql;
      sql = SQL`create table if not exists ${I(this.cfg.schema)}.nodes (
    body json,
    id   text generated always as ( json_extract( body, '$.id' ) ) virtual not null unique
  );
-- ...................................................................................................
create table if not exists ${I(this.cfg.schema)}.edges (
    source     text,
    target     text,
    properties json,
  primary key ( source, target )
  foreign key( source ) references nodes( id ),
  foreign key( target ) references nodes( id )
  );
-- ...................................................................................................
create index if not exists ${I(this.cfg.schema)}.id_idx on nodes(id);
create index if not exists ${I(this.cfg.schema)}.source_idx on edges(source);
create index if not exists ${I(this.cfg.schema)}.target_idx on edges(target);`;
      this.dba.execute(sql);
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    NG_init_db() {
      var sql;
      sql = SQL`-- ...................................................................................................
create table if not exists ${I(this.cfg.schema)}.predicates (
    p             text not null,
    is_transitive boolean not null,
  primary key ( p ) );
-- ...................................................................................................
create table if not exists ${I(this.cfg.schema)}.phrases (
    s       text not null,
    p       text not null,
    o       text not null,
    a       json,
    nr      integer not null,
    vnr     json    not null,
    lck     boolean not null default false,
  primary key ( s, p, o ),
  foreign key ( p ) references predicates ( p ) );`;
      this.dba.execute(sql);
      //.......................................................................................................
      this.dba.function('vnr_as_hollerith', {
        deterministic: true,
        varargs: false
      }, (vnr_json) => {
        return this.vnr_as_hollerith(JSON.parse(vnr_json));
      });
      this.dba.function('vnr_deepen', {
        deterministic: true,
        varargs: true
      }, (vnr_json, extra = 0) => {
        // debug '^8776^', [ vnr_json, extra, ]
        return JSON.stringify(this.vnr_deepen(JSON.parse(vnr_json), extra));
      });
      //.......................................................................................................
      return null;
    }

    //=========================================================================================================
    // VNRs
    //---------------------------------------------------------------------------------------------------------
    vnr_as_hollerith(vnr) {
      var R, i, idx, nr_max, nr_min, offset, ref, ref1, ref2, sign_delta, u32_width, vnr_width;
      sign_delta = 0x80000000/* used to lift negative numbers to non-negative */
      u32_width = 4/* bytes per element */
      vnr_width = 5/* maximum elements in VNR vector */
      nr_min = -0x80000000/* smallest possible VNR element */
      nr_max = +0x7fffffff/* largest possible VNR element */
      if (!((0 < (ref = vnr.length) && ref <= vnr_width))) {
        throw new Error(`^44798^ expected VNR to be between 1 and ${vnr_width} elements long, got length ${vnr.length}`);
      }
      R = Buffer.alloc(vnr_width * u32_width, 0x00);
      offset = -u32_width;
      for (idx = i = 0, ref1 = vnr_width; (0 <= ref1 ? i < ref1 : i > ref1); idx = 0 <= ref1 ? ++i : --i) {
        R.writeUInt32BE(((ref2 = vnr[idx]) != null ? ref2 : 0) + sign_delta, (offset += u32_width));
      }
      return R;
    }

    //---------------------------------------------------------------------------------------------------------
    vnr_deepen(vnr, extra = 0) {
      return [...vnr, extra];
    }

    //=========================================================================================================
    // INSERT, UPDATE, DELETE
    //---------------------------------------------------------------------------------------------------------
    delete_edges(source = null, target = null) {
      var sql;
      if (source === null) {
        if (target === null) {
          sql = SQL`delete from edges;`;
        } else {
          sql = SQL`delete from edges where target is $target;`;
        }
      } else {
        if (target === null) {
          sql = SQL`delete from edges where source = $source;`;
        } else {
          sql = SQL`delete from edges where source = $source and target = $target;`;
        }
      }
      return this.dba.run(sql, {source, target});
    }

    //=========================================================================================================
    insert_edge(source, target, properties) {
      var sql;
      sql = SQL`insert into edges ( source, target, properties ) values ( ?, ?, ? )`;
      return this.dba.run(sql, [source, target, jr(properties)]);
    }

    //---------------------------------------------------------------------------------------------------------
    upsert_edge(source, target, properties) {
      var sql;
      this.types.validate.gdb_edge_properties(properties);
      sql = SQL`insert into edges ( source, target, properties )
  values ( $source, $target, $properties )
  on conflict ( source, target ) do update set properties = $properties;`;
      return this.dba.run(sql, {
        source,
        target,
        properties: jr(properties)
      });
    }

    //---------------------------------------------------------------------------------------------------------
    upmerge_edge(source, target, properties) {
      var sql;
      this.types.validate.gdb_edge_properties(properties);
      sql = SQL`insert into edges as e ( source, target, properties )
  values ( $source, $target, $properties )
  on conflict ( source, target ) do update set properties = json_patch( e.properties, $properties );`;
      return this.dba.run(sql, {
        source,
        target,
        properties: jr(properties)
      });
    }

    //---------------------------------------------------------------------------------------------------------
    update_edge(source, target, properties) {
      var sql;
      this.types.validate.gdb_edge_properties(properties);
      sql = SQL`update edges set properties = json( $properties ) where source = $source and target = $target;`;
      return this.dba.run(sql, {
        source,
        target,
        properties: jr(properties)
      });
    }

    //=========================================================================================================
    insert_node(body) {
      var sql;
      this.types.validate.gdb_node_body(body);
      sql = SQL`insert into nodes ( body ) values ( ? )`;
      return this.dba.run(sql, [jr(body)]);
    }

    //---------------------------------------------------------------------------------------------------------
    upsert_node(body) {
      var sql;
      /* Inserts or updates a node with a given `body`, replacing all existing atrs. */
      this.types.validate.gdb_node_body(body);
      sql = SQL`insert into nodes ( body )
  values ( $body )
  on conflict ( id ) do update set body = $body;`;
      return this.dba.run(sql, {
        body: jr(body)
      });
    }

    //---------------------------------------------------------------------------------------------------------
    upmerge_node(body) {
      var sql;
      /* Inserts or merges a node with a given `body`, using [SQLite `json_patch()`
         function](https://www.sqlite.org/json1.html#jpatch) which is an implementation of [the RFC-7396
         MergePatch algorithm](https://tools.ietf.org/html/rfc7396). */
      this.types.validate.gdb_node_body(body);
      sql = SQL`insert into nodes as n ( body )
  values ( $body )
  on conflict ( id ) do update set body = json_patch( n.body, $body );`;
      return this.dba.run(sql, {
        body: jr(body)
      });
    }

    //---------------------------------------------------------------------------------------------------------
    update_node(body) {
      var sql;
      sql = SQL`update nodes set body = json( $body ) where id = $id;`;
      return this.dba.run(sql, {
        body: jr(body),
        id: body.id
      });
    }

    //---------------------------------------------------------------------------------------------------------
    delete_node(id) {
      var sql;
      throw new Error("not yet implemented");
      return sql = SQL`delete from nodes where id = $id`;
    }

    //=========================================================================================================
    search_edges_inbound() {
      var sql;
      throw new Error("not yet implemented");
      return sql = SQL`select * from edges where source = ?`;
    }

    //---------------------------------------------------------------------------------------------------------
    search_edges_outbound() {
      var sql;
      throw new Error("not yet implemented");
      return sql = SQL`select * from edges where target = ?`;
    }

    //=========================================================================================================
    // SEARCH
    //---------------------------------------------------------------------------------------------------------
    search_edges() {
      var sql;
      throw new Error("not yet implemented");
      return sql = SQL`select * from edges where source = ?
union
select * from edges where target = ?`;
    }

    //---------------------------------------------------------------------------------------------------------
    search_node_by_id() {
      /* TAINT instead of 'json_extract(body, '$.id')', use virtual field(?) */
      var sql;
      throw new Error("not yet implemented");
      return sql = SQL`select body from nodes where json_extract(body, '$.id') = ?`;
    }

    //---------------------------------------------------------------------------------------------------------
    search_node() {
      var sql;
      throw new Error("not yet implemented");
      return sql = SQL`select body from nodes where`;
    }

    //=========================================================================================================
    // TRAVERSE
    //---------------------------------------------------------------------------------------------------------
    traverse_inbound() {
      var sql;
      throw new Error("not yet implemented");
      return sql = SQL`with recursive traverse(id) as (
  select ?
  union
  select source from edges join traverse on target = id
) select id from traverse;`;
    }

    //---------------------------------------------------------------------------------------------------------
    traverse_outbound() {
      var sql;
      throw new Error("not yet implemented");
      return sql = SQL`with recursive traverse(id) as (
  select ?
  union
  select target from edges join traverse on source = id
) select id from traverse;`;
    }

    //---------------------------------------------------------------------------------------------------------
    traverse() {
      var sql;
      throw new Error("not yet implemented");
      return sql = SQL`with recursive traverse(id) as (
  select ?
  union
  select source from edges join traverse on target = id
  union
  select target from edges join traverse on source = id
) select id from traverse;`;
    }

    //---------------------------------------------------------------------------------------------------------
    traverse_with_bodies_inbound() {
      var sql;
      throw new Error("not yet implemented");
      return sql = SQL`with recursive traverse(x, y, obj) as (
  select ?, ?, ?
  union
  select id, '()', body from nodes join traverse on id = x
  union
  select source, '<-', properties from edges join traverse on target = x
) select x, y, obj from traverse;`;
    }

    //---------------------------------------------------------------------------------------------------------
    traverse_with_bodies_outbound() {
      var sql;
      throw new Error("not yet implemented");
      return sql = SQL`with recursive traverse(x, y, obj) as (
  select ?, ?, ?
  union
  select id, '()', body from nodes join traverse on id = x
  union
  select target, '->', properties from edges join traverse on source = x
) select x, y, obj from traverse;`;
    }

    //---------------------------------------------------------------------------------------------------------
    traverse_with_bodies() {
      var sql;
      throw new Error("not yet implemented");
      return sql = SQL`with recursive traverse(x, y, obj) as (
  select ?, ?, ?
  union
  select id, '()', body from nodes join traverse on id = x
  union
  select source, '<-', properties from edges join traverse on target = x
  union
  select target, '->', properties from edges join traverse on source = x
) select x, y, obj from traverse;`;
    }

  };

}).call(this);

//# sourceMappingURL=graph-db.js.map
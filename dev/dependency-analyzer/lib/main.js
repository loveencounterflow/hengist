(function() {
  'use strict';
  var CND, Dba, Dpan, PATH, SQL, badge, debug, def, demo, echo, freeze, glob, help, info, isa, lets, rpr, type_of, types, urge, validate, validate_list_of, warn, whisper;

  /* NOTE consider to refactor this to [SCDA](https://github.com/loveencounterflow/scda) */
  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DEPENDENCY-ANALYZER';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  // { to_width }              = require 'to-width'
  SQL = String.raw;

  ({lets, freeze} = require('letsfreezethat'));

  ({Dba} = require('icql-dba'));

  def = Object.defineProperty;

  glob = require('glob');

  PATH = require('path');

  //===========================================================================================================
  types.declare('dpan_constructor_cfg', {
    tests: {
      '@isa.object x': function(x) {
        return this.isa.object(x);
      },
      'x.prefix is a prefix': function(x) {
        if (!this.isa.text(x.prefix)) {
          return false;
        }
        if (x.prefix === '') {
          return true;
        }
        return /^[_a-z][_a-z0-9]*$/.test(x.prefix);
      },
      '@isa.boolean x.recreate': function(x) {
        return this.isa.boolean(x.recreate);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  types.defaults = {
    dpan_constructor_cfg: {
      dba: null,
      prefix: 'dpan_',
      db_path: PATH.resolve(PATH.join(__dirname, '../dpan.sqlite')),
      recreate: false
    }
  };

  //===========================================================================================================
  Dpan = class Dpan {
    //---------------------------------------------------------------------------------------------------------
    constructor(cfg) {
      var dba;
      validate.dpan_constructor_cfg(this.cfg = {...types.defaults.dpan_constructor_cfg, ...cfg});
      debug('^4877^', this.cfg);
      //.......................................................................................................
      dba = this.cfg.dba != null ? this.cfg.dba : new Dba();
      def(this, 'dba', {
        enumerable: false,
        value: dba
      });
      delete this.cfg.dba;
      this.cfg = freeze(this.cfg);
      //.......................................................................................................
      if (this.cfg.db_path != null) {
        this.dba.open({
          path: this.cfg.db_path
        });
      }
      if (this.cfg.recreate) {
        //.......................................................................................................
        this._clear_db();
      }
      this._create_db_structure();
      this._compile_sql();
      // @_create_sql_functions()
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    _create_db_structure() {
      var prefix;
      prefix = this.cfg.prefix;
      this.dba.execute(SQL`create table if not exists ${prefix}packages (
    name        text    not null,
    version     text    not null,
    vname       text    generated always as ( name || '@' || version ) virtual not null unique,
  primary key ( name, version ) );
create unique index if not exists ${prefix}packages_vname_idx on ${prefix}packages ( vname );
create table if not exists ${prefix}dependencies (
    package     text    not null references ${prefix}packages ( vname ),
    depends_on  text    not null references ${prefix}packages ( vname ),
  primary key ( package, depends_on ) );`);
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    _clear_db() {
      /* TAINT should be a method of ICQL/DB */
      var prefix;
      prefix = this.cfg.prefix;
      this.dba.execute(SQL`drop index if exists ${prefix}packages_vname_idx;
drop table if exists ${prefix}dependencies;
drop table if exists ${prefix}packages;`);
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    _compile_sql() {
      var prefix;
      prefix = this.cfg.prefix;
      // sql =
      //   get: SQL"""
      //     select value from #{prefix}variables
      //       where key = $key
      //       limit 1;"""
      //   set: SQL"""
      //     insert into #{prefix}variables ( key, value )
      //       values ( $key, $value )
      //       on conflict do update set value = $value;"""
      // def @, 'sql', { enumerable: false, value: sql, }
      return null;
    }

    // #---------------------------------------------------------------------------------------------------------
    // _create_sql_functions: ->

      //=========================================================================================================
    // RETRIEVE CANONICAL PACKAGE URL
    //---------------------------------------------------------------------------------------------------------
    _url_from_vpackage_d_homepage(vpackage_d) {
      var R, ref;
      if ((R = (ref = vpackage_d.homepage) != null ? ref : null) != null) {
        return R.replace(/#readme$/, '');
      }
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    _url_from_vpackage_d_repository(vpackage_d) {
      var R, ref, ref1;
      if ((R = (ref = (ref1 = vpackage_d.repository) != null ? ref1.url : void 0) != null ? ref : null) != null) {
        return R.replace(/^(git\+)?(.+?)(\.git)?$/, '$2');
      }
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    _url_from_vpackage_d_bugs(vpackage_d) {
      var R, ref, ref1;
      if ((R = (ref = (ref1 = vpackage_d.bugs) != null ? ref1.url : void 0) != null ? ref : null) != null) {
        return R.replace(/\/issues$/, '');
      }
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    get_package_url(package_d, version) {
      var R, ref, ref1, vpackage_d;
      if ((vpackage_d = (ref = (ref1 = package_d.versions) != null ? ref1[version] : void 0) != null ? ref : null) == null) {
        throw new Error(`^37596^ unknown version: ${rpr(version)}`);
      }
      if ((R = this._url_from_vpackage_d_homepage(vpackage_d)) != null) {
        return R;
      }
      if ((R = this._url_from_vpackage_d_repository(vpackage_d)) != null) {
        return R;
      }
      if ((R = this._url_from_vpackage_d_bugs(vpackage_d)) != null) {
        return R;
      }
      return null;
    }

    //=========================================================================================================

    //---------------------------------------------------------------------------------------------------------
    * walk_dependencies() {
      var dep_json, dep_jsonb_path, dep_name, dep_version, error, home_path, i, idx, j, len, len1, package_json, project_deps, project_deps_names, project_name, project_path, project_path_pattern, project_version, ref, ref1;
      home_path = PATH.resolve(PATH.join(__dirname, '..'));
      project_path_pattern = PATH.join(home_path, '../../../*/package.json');
      // pattern   = PATH.join home_path, '../../../*/node_modules/*'
      // pattern   = PATH.join home_path, '../../../*/node_modules/*/package.json'
      debug('^488^', project_path_pattern);
      ref = glob.sync(project_path_pattern);
      for (i = 0, len = ref.length; i < len; i++) {
        project_path = ref[i];
        package_json = require(project_path);
        project_version = package_json.version;
        project_path = PATH.dirname(project_path);
        project_name = PATH.basename(project_path);
        project_deps = (ref1 = package_json.dependencies) != null ? ref1 : {};
        project_deps_names = Object.keys(project_deps);
        if (project_name !== 'icql-dba-tags' && project_name !== 'icql-dba-vars') {
          continue;
        }
        debug(CND.grey(project_path), CND.gold(project_name), CND.lime(project_version));
        //.....................................................................................................
        if (project_deps_names.length === 0) {
          yield ({
            project_name,
            project_version,
            dep_name,
            dep_version,
            is_new_project: true
          });
          continue;
        }
//.....................................................................................................
/* TAINT issue one datom in case no dependencies found */
        for (idx = j = 0, len1 = project_deps_names.length; j < len1; idx = ++j) {
          dep_name = project_deps_names[idx];
          dep_jsonb_path = PATH.join(project_path, 'node_modules', dep_name, 'package.json');
          try {
            dep_json = require(dep_jsonb_path);
          } catch (error1) {
            error = error1;
            throw error;
          }
          // debug dep_path
          dep_version = dep_json.version;
          if (idx === 0) {
            yield ({
              project_name,
              project_version,
              dep_name,
              dep_version,
              is_new_project: true
            });
          } else {
            yield ({project_name, project_version, dep_name, dep_version});
          }
          debug(' ', CND.gold(dep_name), CND.lime(dep_version));
        }
      }
      // debug ( CND.grey dep_path ), ( CND.gold dep_name ), ( CND.lime dep_version )
      return null;
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var d, dep_vname, dpan, package_vname, prefix, ref;
    dpan = new Dpan({
      recreate: true
    });
    debug('^332^', dpan);
    prefix = dpan.cfg.prefix;
    ref = dpan.walk_dependencies();
    for (d of ref) {
      debug('^684^', d);
      // if d.is_new_project
      /* TAINT code duplication, same logic in SQL */
      package_vname = `${d.project_name}@${d.project_version}`;
      dep_vname = `${d.dep_name}@${d.dep_version}`;
      dpan.dba.run(SQL`insert into ${prefix}packages ( name, version )
values ( $name, $version )
on conflict do nothing;`, {
        name: d.project_name,
        version: d.project_version
      });
      dpan.dba.run(SQL`insert into ${prefix}packages ( name, version )
values ( $name, $version )
on conflict do nothing;`, {
        name: d.dep_name,
        version: d.dep_version
      });
      dpan.dba.run(SQL`insert into ${prefix}dependencies ( package, depends_on )
values ( $package, $depends_on )
on conflict do nothing;`, {
        package: package_vname,
        depends_on: dep_vname
      });
    }
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      var CP, cfg, got, k, package_name, rq_url, rsp;
      // demo()
      CP = require('child_process');
      // debug '^33442^', CP.execSync "npm view icql-dba@^6 dependencies", { encoding: 'utf-8', }
      // debug '^33442^', CP.execSync "npm view icql-dba dependencies", { encoding: 'utf-8', }
      cfg = {
        registry_url: 'https://registry.npmjs.org/'
      };
      debug('^446^', cfg);
      package_name = 'icql-dba-vars';
      package_name = 'icql-dba-tags';
      rq_url = (cfg.registry_url.replace(/\/$/, '')) + '/' + package_name;
      debug('^2334^', rq_url);
      got = require('got');
      debug('^443^', rsp = (await (got(rq_url)).json()));
      debug('^443^', (function() {
        var results;
        results = [];
        for (k in rsp) {
          results.push(k);
        }
        return results;
      })());
      debug('^443^', (function() {
        var results;
        results = [];
        for (k in rsp.versions) {
          results.push(k);
        }
        return results;
      })());
      urge('^443^', (function() {
        var results;
        results = [];
        for (k in rsp.versions['0.2.1']) {
          results.push(k);
        }
        return results;
      })());
      debug('^443^', (function() {
        var results;
        results = [];
        for (k in rsp.versions['0.2.1'].dependencies) {
          results.push(k);
        }
        return results;
      })());
      info('^443^', rsp.versions['0.2.1'].description);
      get_package_url(rsp, '0.2.1');
      return info('^443^', rsp.versions['0.2.1'].dependencies);
    })();
  }

  // debug '^2334^', fetch rq_url
// request.get( xxx, {json: true}, function (err, res, obj) {
//   if (err || (res.statusCode < 200 || res.statusCode >= 400)) {
//     var message = res ? 'status = ' + res.statusCode : 'error = ' + err.message
//     _this.logger.log(
//       'could not load ' + name + '@' + task.version + ' ' + message

}).call(this);

//# sourceMappingURL=main.js.map
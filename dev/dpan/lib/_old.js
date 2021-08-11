(function() {
  var X, f;

  f = function() {
    return {
      //=========================================================================================================

      //---------------------------------------------------------------------------------------------------------
      walk_dependencies: function*() {
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
  };

  X = class X {
    //=========================================================================================================

    //---------------------------------------------------------------------------------------------------------
    _npm_api_url_from_package_name(pkg_name) {
      return (this.cfg.registry_url.replace(/\/$/, '')) + '/' + pkg_name;
    }

    //---------------------------------------------------------------------------------------------------------
    async _fetch_package_d_from_package_name(pkg_name) {
      var rq_url;
      rq_url = this._npm_api_url_from_package_name(pkg_name);
      return (await (got(rq_url)).json());
    }

    //---------------------------------------------------------------------------------------------------------
    _package_infos_from_package_d_and_version(package_d, version) {
      var R, k, ref, ref1, ref2, ref3;
      R = {};
      R.pkg_name = package_d.name;
      R.pkg_version = version;
      R.versions = (function() {
        var ref, results;
        results = [];
        for (k in (ref = package_d.versions) != null ? ref : []) {
          results.push(k);
        }
        return results;
      })();
      R.url = this.get_package_url(package_d, version);
      R.description = (ref = (ref1 = package_d.versions[version]) != null ? ref1.description : void 0) != null ? ref : null;
      R.dependencies = (ref2 = (ref3 = package_d.versions[version]) != null ? ref3.dependencies : void 0) != null ? ref2 : null;
      R.fspath = null;
      return R;
    }

    //---------------------------------------------------------------------------------------------------------
    async fetch_package_infos(pkg_name, version) {
      var package_d;
      package_d = (await this._fetch_package_d_from_package_name(pkg_name));
      // debug '^443^', ( k for k of package_d )
      // debug '^443^', ( k for k of package_d.versions )
      // urge '^443^', ( k for k of package_d.versions[ '0.2.1' ] )
      // debug '^443^', ( k for k of package_d.versions[ '0.2.1' ].dependencies )
      return this._package_infos_from_package_d_and_version(package_d, version);
    }

  };

  f = async function() {
    var dpan, k, package_d, package_info, pkg_name;
    dpan = new Dpan();
    pkg_name = 'icql-dba-vars';
    pkg_name = 'icql-dba-tags';
    package_d = (await dpan._fetch_package_d_from_package_name(pkg_name));
    debug('^443^', (function() {
      var results;
      results = [];
      for (k in package_d) {
        results.push(k);
      }
      return results;
    })());
    debug('^443^', (function() {
      var results;
      results = [];
      for (k in package_d.versions) {
        results.push(k);
      }
      return results;
    })());
    urge('^443^', (function() {
      var results;
      results = [];
      for (k in package_d.versions['0.2.1']) {
        results.push(k);
      }
      return results;
    })());
    debug('^443^', (function() {
      var results;
      results = [];
      for (k in package_d.versions['0.2.1'].dependencies) {
        results.push(k);
      }
      return results;
    })());
    package_info = dpan._package_infos_from_package_d_and_version(package_d, '0.2.1');
    return info('^677^', JSON.stringify(package_info, null, '  '));
  };

  f = function() {
    /* TAINT code duplication, same logic in SQL */
    var d, dep_vname, pkg_vname, ref;
    ref = dpan.walk_dependencies();
    //.........................................................................................................
    for (d of ref) {
      debug('^684^', d);
      pkg_vname = `${d.project_name}@${d.project_version}`;
      dep_vname = `${d.dep_name}@${d.dep_version}`;
      // if d.is_new_project
      dpan.dba.run(SQL`insert into ${prefix}pkgs ( name, version )
values ( $name, $version )
on conflict do nothing;`, {
        name: d.project_name,
        version: d.project_version
      });
      dpan.dba.run(SQL`insert into ${prefix}pkgs ( name, version )
values ( $name, $version )
on conflict do nothing;`, {
        name: d.dep_name,
        version: d.dep_version
      });
      dpan.dba.run(SQL`insert into ${prefix}dependencies ( package, depends_on )
values ( $package, $depends_on )
on conflict do nothing;`, {
        package: pkg_vname,
        depends_on: dep_vname
      });
    }
    //.........................................................................................................
    return null;
  };

}).call(this);

//# sourceMappingURL=_old.js.map
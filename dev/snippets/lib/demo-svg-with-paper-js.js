(function() {
  'use strict';
  var CND, FS, PAPER, PATH, badge, debug, demo_import_export, demo_union, echo, help, info, isa, rpr, type_of, types, unite_path_data, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DEMO-SVG-WITH-PAPER-JS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  PAPER = require('paper-jsdom');

  PATH = require('path');

  FS = require('fs');

  types = new (require('intertype')).Intertype();

  ({validate, type_of, isa} = types.export());

  // # stops   = [ ( new PAPER.Color 1, 1, 0, 0 ), 'red', 'black', ]
  // radius  = PAPER.view.bounds.width * 0.4
  // from_pt = new PAPER.Point PAPER.view.center.x, 300
  // to_pt   = from_pt.add radius, 0

  // circle = new PAPER.Path.Circle
  //   center:       from_pt
  //   radius:       radius * 0.7
  //   fillColor:    'red'
  //   strokeColor:  'black'

  // rectangle = new PAPER.Path.Rectangle
  //   from:         PAPER.view.bounds.leftCenter
  //   to:           PAPER.view.bounds.bottomRight
  //   fillColor:    'red',
  //   strokeColor:  'black'

  // debug ( ( circle.exportSVG    { asString: false, } ) ).getAttribute 'd'
  // debug ( ( rectangle.exportSVG { asString: false, } ) ).getAttribute 'd'

  // p1_pth    = PAPER.PathItem.create 'M66,300c0,-46.39192 37.60808,-84 84,-84c46.39192,0 84,37.60808 84,84c0,46.39192 -37.60808,84 -84,84c-46.39192,0 -84,-37.60808 -84,-84z'
  // rectangle = PAPER.PathItem.create 'M0,600v-300h300v300z'
  // p2_pth.rotate(45).scale(0.7)
  // console.log(svg)
  // fs.writeFileSync( '/tmp/paper1.svg', svg )
  // svg = PAPER.project.exportSVG { asString: true, precision: 0, }
  // info svg
  // FS.writeFileSync '/tmp/paper2.svg', svg

  // dom = PAPER.project.exportSVG { asString: false, precision: 0, }
  // # debug '^445645^', ( k for k of dom )
  // help '^5345348^', ( dom.getElementsByTagName 'path' )[ 0 ].getAttribute 'd'

  //-----------------------------------------------------------------------------------------------------------
  demo_import_export = function() {
    var dom, g_dom, i, id, j, k, len, len1, len2, name, path, path_dom, pd, pds, project, ref, ref1, ref2, seen;
    path = PATH.resolve(PATH.join(__dirname, '../../../apps-typesetting/html+svg-demos/symbols-for-special-chrs.svg'));
    project = new PAPER.Project();
    project.importSVG(FS.readFileSync(path, {
      encoding: 'utf-8'
    }));
    dom = project.exportSVG();
    seen = new Set();
    ref = dom.querySelectorAll('g');
    //.........................................................................................................
    for (i = 0, len = ref.length; i < len; i++) {
      g_dom = ref[i];
      id = g_dom.getAttribute('id');
      if (!((id != null) && id.startsWith('sym-'))) {
        continue;
      }
      name = g_dom.tagName;
      info('^432^', "group", rpr(id));
      pds = [];
      ref1 = g_dom.querySelectorAll('path');
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        path_dom = ref1[j];
        if (seen.has(path_dom)) {
          continue;
        }
        seen.add(path_dom);
        pds.push(path_dom.getAttribute('d'));
      }
      urge('^432^', pds);
      urge('^432^', unite_path_data(pds));
    }
    ref2 = dom.querySelectorAll('path');
    //.........................................................................................................
    for (k = 0, len2 = ref2.length; k < len2; k++) {
      path_dom = ref2[k];
      if (seen.has(path_dom)) {
        continue;
      }
      id = path_dom.getAttribute('id');
      if (!((id != null) && id.startsWith('sym-'))) {
        continue;
      }
      name = path_dom.tagName;
      info('^432^', "single path", rpr(id));
      urge('^432^', pd = path_dom.getAttribute('d'));
    }
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  unite_path_data = function(pds) {
    var i, idx, p0_pth, ref;
    PAPER.setup(new PAPER.Size(1000, 1000));
    validate.list(pds);
    if (pds.length === 0) {
      throw new Error("^45648^ expected path data, got none");
    }
    if (pds.length === 1) {
      return pds[0];
    }
    p0_pth = PAPER.PathItem.create(pds[0]);
    for (idx = i = 1, ref = pds.length; (1 <= ref ? i < ref : i > ref); idx = 1 <= ref ? ++i : --i) {
      p0_pth = p0_pth.unite(PAPER.PathItem.create(pds[idx]));
    }
    return (p0_pth.exportSVG({
      asString: false,
      precision: 0
    })).getAttribute('d');
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_union = function() {
    var p1_pth, p2_pth, union_pth;
    PAPER.setup(new PAPER.Size(300, 600));
    p1_pth = PAPER.PathItem.create('M 40.49 201.605 L 60.313 201.605 L 60.313 403.212 L 40.49 403.212 L 40.49 201.605 Z');
    p2_pth = PAPER.PathItem.create('M 0 371.912 L 100.803 371.912 L 100.803 403.212 L 0 403.212 L 0 371.912 Z');
    union_pth = p2_pth.unite(p1_pth);
    p2_pth.remove();
    p1_pth.remove();
    // debug '^35345^', ( k for k of p1_pth )
    debug('^35345^', p1_pth.exportSVG({
      asString: true
    }));
    urge('^35345^', (union_pth.exportSVG({
      asString: false,
      precision: 0
    })).getAttribute('d'));
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // demo_union()
      return demo_import_export();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-svg-with-paper-js.js.map
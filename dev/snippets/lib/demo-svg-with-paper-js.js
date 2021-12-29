(function() {
  'use strict';
  var CND, FS, PAPER, badge, circle, debug, echo, from_pt, help, info, radius, rectangle, rpr, svg, to_pt, union_pth, urge, warn, whisper;

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

  FS = require('fs');

  PAPER.setup(new PAPER.Size(300, 600));

  // stops   = [ ( new PAPER.Color 1, 1, 0, 0 ), 'red', 'black', ]
  radius = PAPER.view.bounds.width * 0.4;

  from_pt = new PAPER.Point(PAPER.view.center.x, 300);

  to_pt = from_pt.add(radius, 0);

  circle = new PAPER.Path.Circle({
    center: from_pt,
    radius: radius * 0.7,
    fillColor: 'red',
    strokeColor: 'black'
  });

  rectangle = new PAPER.Path.Rectangle({
    from: PAPER.view.bounds.leftCenter,
    to: PAPER.view.bounds.bottomRight,
    fillColor: 'red',
    strokeColor: 'black'
  });

  rectangle.rotate(45).scale(0.7);

  // svg = PAPER.project.exportSVG { asString: true, }
  // console.log(svg)
  // fs.writeFileSync( '/tmp/paper1.svg', svg )
  union_pth = rectangle.unite(circle);

  rectangle.remove();

  circle.remove();

  // debug '^35345^', ( k for k of circle )
  debug('^35345^', circle.exportSVG({
    asString: true
  }));

  urge('^35345^', union_pth.exportSVG({
    asString: true
  }));

  svg = PAPER.project.exportSVG({
    asString: true
  });

  info(svg);

  FS.writeFileSync('/tmp/paper2.svg', svg);

}).call(this);

//# sourceMappingURL=demo-svg-with-paper-js.js.map
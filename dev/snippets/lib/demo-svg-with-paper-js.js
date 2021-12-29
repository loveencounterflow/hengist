(function() {
  

// Please note: When loading paper as a normal module installed in node_modules,
// you would use this instead:
var paper = require('paper-jsdom');
// var paper = require('../../dist/paper-core.js');
var path = require('path');
var fs = require('fs');

// with (paper) {
    paper.setup( new paper.Size(300, 600));
    var stops = [new paper.Color(1, 1, 0, 0), 'red', 'black'];

    var radius = paper.view.bounds.width * 0.4,
        from = new paper.Point( paper.view.center.x),
        to = from.add(radius, 0);

    var circle = new paper.Path.Circle({
        center: from,
        radius: radius * 2,
        fillColor: 'red',
        strokeColor: 'black'
    });

    var from = paper.view.bounds.leftCenter,
        to = paper.view.bounds.bottomRight;

    var rect = new paper.Path.Rectangle({
        from: from,
        to: to,
        fillColor: 'red',
        strokeColor: 'black'
    });

    rect.rotate(45).scale(0.7);
    var svg = paper.project.exportSVG({ asString: true });
    console.log(svg);
    fs.writeFileSync( '/tmp/paper1.svg', svg );
    rect.unite(circle);
    rect.remove();
    circle.remove();
    var svg = paper.project.exportSVG({ asString: true });
    console.log(svg);
    fs.writeFileSync( '/tmp/paper2.svg', svg );

    // fs.writeFile(path.resolve('./out.svg'), svg, function (err) {
    //     if (err) throw err;
    //     // console.log('Saved!');
    // });
// }
;


}).call(this);

//# sourceMappingURL=demo-svg-with-paper-js.js.map
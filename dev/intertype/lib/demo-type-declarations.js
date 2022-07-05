(function() {
  'use strict';
  var declare, isa, log, types;

  types = new (require('../../../apps/intertype')).Intertype();

  ({isa, declare} = types);

  log = console.log;

  declare('xy_quantity', {
    test: [
      function(x) {
        return this.isa.object(x);
      },
      function(x) {
        return this.isa.float(x.value);
      },
      function(x) {
        return this.isa.nonempty.text(x.unit);
      }
    ]
  });

  log('^1-1^', isa.xy_quantity(null));

  log('^1-1^', isa.xy_quantity(42));

  log('^1-1^', isa.xy_quantity({
    value: 42,
    unit: 'm'
  }));

}).call(this);

//# sourceMappingURL=demo-type-declarations.js.map
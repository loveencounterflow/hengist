(function() {
  var Foo, f;

  Foo = class Foo {
    constructor(a, b) {
      this.a = a;
      this.b = b;
    }

  };

  f = new Foo(42, 'helo');

  console.log(f);

  // <__main__.Foo object at 0x7fdb3ba7cd00>

}).call(this);

//# sourceMappingURL=foo-class-instance-literal.js.map
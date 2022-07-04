(function() {
  'use strict';
  var CND, H, alert, badge, convert_to_plain_objects, debug, demo_acorn_walk, demo_parse_use_and_fallback, demo_return_clauses, echo, equals, help, info, isa, log, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'GUY/TESTS/SRC';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  // PATH                      = require 'path'
  // FS                        = require 'fs'
  // { freeze }                = require 'letsfreezethat'
  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of, equals} = types.export());

  //-----------------------------------------------------------------------------------------------------------
  convert_to_plain_objects = function(ast) {
    var R, i, idx, key, len, value;
    if (types.isa.object(ast)) {
      R = {...ast};
      for (key in R) {
        value = R[key];
        R[key] = convert_to_plain_objects(value);
      }
      return R;
    }
    if (types.isa.list(ast)) {
      R = [...ast];
      for (idx = i = 0, len = R.length; i < len; idx = ++i) {
        value = R[idx];
        R[idx] = convert_to_plain_objects(value);
      }
      return R;
    }
    return ast;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["guy.src.parse()"] = function(T, done) {
    var GUY;
    // T?.halt_on_error()
    GUY = require(H.guy_path);
    (() => {
      var result;
      result = convert_to_plain_objects(GUY.src.parse({
        text: "42"
      }));
      debug('^975-1^', result);
      return T != null ? T.eq(result, {
        type: 'Program',
        start: 0,
        end: 2,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 2,
            expression: {
              type: 'Literal',
              start: 0,
              end: 2,
              value: 42,
              raw: '42'
            }
          }
        ],
        sourceType: 'script'
      }) : void 0;
    })();
    (() => {
      var result;
      result = convert_to_plain_objects(GUY.src.parse({
        text: "var x = 'helo world';"
      }));
      debug('^975-2^', result);
      return T != null ? T.eq(result, {
        type: 'Program',
        start: 0,
        end: 21,
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 21,
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 20,
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  name: 'x'
                },
                init: {
                  type: 'Literal',
                  start: 8,
                  end: 20,
                  value: 'helo world',
                  raw: "'helo world'"
                }
              }
            ]
          }
        ],
        sourceType: 'script'
      }) : void 0;
    })();
    (() => {
      var f, result;
      f = function(x) {
        return 42;
      };
      debug('^975-3^', f.toString());
      result = convert_to_plain_objects(GUY.src.parse({
        function: f,
        use: 'loose'
      }));
      debug('^975-3^', result);
      return T != null ? T.eq(result, {
        type: 'Program',
        start: 0,
        end: 40,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 40,
            id: {
              type: 'Identifier',
              start: 8,
              end: 8,
              name: '✖'
            },
            params: [
              {
                type: 'Identifier',
                start: 9,
                end: 10,
                name: 'x'
              }
            ],
            generator: false,
            expression: false,
            async: false,
            body: {
              type: 'BlockStatement',
              start: 12,
              end: 40,
              body: [
                {
                  type: 'ReturnStatement',
                  start: 22,
                  end: 32,
                  argument: {
                    type: 'Literal',
                    start: 29,
                    end: 31,
                    value: 42,
                    raw: '42'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["guy.src.parse() accepts `fallback` argument, otherwise errors where appropriate"] = async function(T, done) {
    var GUY, error, i, len, matcher, probe, probes_and_matchers;
    // T?.halt_on_error()
    GUY = require(H.guy_path);
    probes_and_matchers = [
      [
        {
          text: "let x = 1 + 1;"
        },
        {
          type: 'Program',
          start: 0,
          end: 14,
          body: [
            {
              type: 'VariableDeclaration',
              start: 0,
              end: 14,
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 4,
                  end: 13,
                  id: {
                    type: 'Identifier',
                    start: 4,
                    end: 5,
                    name: 'x'
                  },
                  init: {
                    type: 'BinaryExpression',
                    start: 8,
                    end: 13,
                    left: {
                      type: 'Literal',
                      start: 8,
                      end: 9,
                      value: 1,
                      raw: '1'
                    },
                    operator: '+',
                    right: {
                      type: 'Literal',
                      start: 12,
                      end: 13,
                      value: 1,
                      raw: '1'
                    }
                  }
                }
              ]
            }
          ],
          sourceType: 'script'
        }
      ],
      [
        {
          text: "let x = 1 ^^^^^ 1;",
          use: 'strict'
        },
        null,
        'Unexpected token'
      ],
      [
        {
          text: "let x = 1 ^^^^^ 1;",
          use: 'strict,loose'
        },
        {
          type: 'Program',
          start: 0,
          end: 18,
          body: [
            {
              type: 'VariableDeclaration',
              start: 0,
              end: 18,
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 4,
                  end: 17,
                  id: {
                    type: 'Identifier',
                    start: 4,
                    end: 5,
                    name: 'x'
                  },
                  init: {
                    type: 'BinaryExpression',
                    start: 8,
                    end: 17,
                    left: {
                      type: 'BinaryExpression',
                      start: 8,
                      end: 14,
                      left: {
                        type: 'BinaryExpression',
                        start: 8,
                        end: 13,
                        left: {
                          type: 'BinaryExpression',
                          start: 8,
                          end: 12,
                          left: {
                            type: 'BinaryExpression',
                            start: 8,
                            end: 11,
                            left: {
                              type: 'Literal',
                              start: 8,
                              end: 9,
                              value: 1,
                              raw: '1'
                            },
                            operator: '^',
                            right: {
                              type: 'Identifier',
                              start: 11,
                              end: 11,
                              name: '✖'
                            }
                          },
                          operator: '^',
                          right: {
                            type: 'Identifier',
                            start: 12,
                            end: 12,
                            name: '✖'
                          }
                        },
                        operator: '^',
                        right: {
                          type: 'Identifier',
                          start: 13,
                          end: 13,
                          name: '✖'
                        }
                      },
                      operator: '^',
                      right: {
                        type: 'Identifier',
                        start: 14,
                        end: 14,
                        name: '✖'
                      }
                    },
                    operator: '^',
                    right: {
                      type: 'Literal',
                      start: 16,
                      end: 17,
                      value: 1,
                      raw: '1'
                    }
                  }
                }
              ]
            }
          ],
          sourceType: 'script'
        }
      ],
      [
        {
          text: "let x = 1 ^^^^^ 1;",
          use: 'loose'
        },
        {
          type: 'Program',
          start: 0,
          end: 18,
          body: [
            {
              type: 'VariableDeclaration',
              start: 0,
              end: 18,
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 4,
                  end: 17,
                  id: {
                    type: 'Identifier',
                    start: 4,
                    end: 5,
                    name: 'x'
                  },
                  init: {
                    type: 'BinaryExpression',
                    start: 8,
                    end: 17,
                    left: {
                      type: 'BinaryExpression',
                      start: 8,
                      end: 14,
                      left: {
                        type: 'BinaryExpression',
                        start: 8,
                        end: 13,
                        left: {
                          type: 'BinaryExpression',
                          start: 8,
                          end: 12,
                          left: {
                            type: 'BinaryExpression',
                            start: 8,
                            end: 11,
                            left: {
                              type: 'Literal',
                              start: 8,
                              end: 9,
                              value: 1,
                              raw: '1'
                            },
                            operator: '^',
                            right: {
                              type: 'Identifier',
                              start: 11,
                              end: 11,
                              name: '✖'
                            }
                          },
                          operator: '^',
                          right: {
                            type: 'Identifier',
                            start: 12,
                            end: 12,
                            name: '✖'
                          }
                        },
                        operator: '^',
                        right: {
                          type: 'Identifier',
                          start: 13,
                          end: 13,
                          name: '✖'
                        }
                      },
                      operator: '^',
                      right: {
                        type: 'Identifier',
                        start: 14,
                        end: 14,
                        name: '✖'
                      }
                    },
                    operator: '^',
                    right: {
                      type: 'Literal',
                      start: 16,
                      end: 17,
                      value: 1,
                      raw: '1'
                    }
                  }
                }
              ]
            }
          ],
          sourceType: 'script'
        }
      ],
      [
        {
          text: "let x = 1 ^^^^^ 1;",
          use: 'strict',
          fallback: null
        },
        null
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result;
          result = GUY.src.parse(probe);
          // debug '^34234^', GUY.src._generate result
          result = convert_to_plain_objects(result);
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["guy.src.get_first_return_clause()"] = function(T, done) {
    var GUY;
    // T?.halt_on_error()
    GUY = require(H.guy_path);
    (() => {
      var result;
      result = convert_to_plain_objects(GUY.src.get_first_return_clause_node(function(x) {
        return 42;
      }));
      debug('^975-1^', result);
      return T != null ? T.eq(result, {
        type: 'ReturnStatement',
        start: 22,
        end: 32,
        argument: {
          type: 'Literal',
          start: 29,
          end: 31,
          value: 42,
          raw: '42'
        }
      }) : void 0;
    })();
    (() => {
      var result;
      result = GUY.src.get_first_return_clause_text(function(x) {
        return 42;
      });
      debug('^975-1^', result);
      return T != null ? T.eq(result, "return 42;") : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_return_clauses = function() {
    var GUY, ast, f, functions, i, len;
    GUY = require(H.guy_path);
    functions = [
      function(x) {
        return 42;
      },
      function(x) {
        return g(42);
      },
      function(x) {
        if (x > 0) {
          return g(42);
        } else {
          return g(108);
        }
      }
    ];
    for (i = 0, len = functions.length; i < len; i++) {
      f = functions[i];
      ast = GUY.src.get_first_return_clause_node(f);
      info(convert_to_plain_objects(ast));
      urge(GUY.src.ASTRING.generate(ast));
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_acorn_walk = function() {
    /* Count return statements; if more than one, return first BlockStatement, otherwise `argument` property
     of first and only ReturnStatement */
    var GUY, acorn, ast, walk;
    GUY = require(H.guy_path);
    acorn = require('acorn');
    walk = require('acorn-walk');
    // ast     = acorn.parse "let x = 10;", { ecmaVersion: '2022', }
    // ast     = GUY.src.parse function: ( x ) -> if x? then true else false
    ast = GUY.src.parse({
      function: function(x) {
        return (x == null) || (this.isa.object(x)) || (this.isa.nonempty.text(x));
      }
    });
    // debug '^24324^', ast
    walk.simple(ast, {
      Literal: function(node) {
        var source;
        source = GUY.src.ASTRING.generate(node);
        return info(`Found a literal: ${source}`);
      },
      ReturnStatement: function(node) {
        var source;
        source = GUY.src.ASTRING.generate(node);
        return urge(`Found a return statement: ${source}`);
      },
      BlockStatement: function(node) {
        var source;
        // debug node
        source = GUY.src.ASTRING.generate(node);
        source = source.trim().replace(/\s*\n\s*/g, ' ');
        return info(`Found a block statement: ${source}`);
      }
    });
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_acorn_walk = function() {
    /* Count return statements; if more than one, return first BlockStatement, otherwise `argument` property
     of first and only ReturnStatement */
    var GUY, acorn, ast, cfg, collector, source, walk;
    GUY = require(H.guy_path);
    acorn = require('acorn');
    walk = require('acorn-walk');
    // ast     = acorn.parse "let x = 10;", { ecmaVersion: '2022', }
    cfg = {
      function: function(x) {
        if (x != null) {
          return true;
        } else {
          return false;
        }
      }
    };
    // cfg       = function: ( x ) -> ( not x? ) or ( @isa.object x ) or ( @isa.nonempty.text x )
    ast = GUY.src.parse(cfg);
    collector = {
      rtn: [],
      blk: []
    };
    walk.simple(ast, {
      ReturnStatement: function(node) {
        return collector.rtn.push(node);
      },
      BlockStatement: function(node) {
        return collector.blk.push(node);
      }
    });
    // FunctionDeclaration:  ( node ) -> collector.fnd ?= node
    debug('^234^', ast);
    debug('^234^', collector.rtn.length);
    debug('^234^', collector.blk.length);
    source = null;
    if (collector.rtn.length === 1) {
      source = GUY.src._generate(collector.rtn[0]);
      source = source.trim().replace(/\s*\n\s*/g, ' ');
      source = source.replace(/^return\s*/, '');
      source = source.replace(/;$/, '');
    } else if (collector.blk.length > 0) {
      source = GUY.src._generate(collector.blk.at(-1));
      source = source.trim().replace(/\s*\n\s*/g, ' ');
      source = source.replace(/^\{\s*(.*?)\s*\}$/, '$1');
    }
    debug('^5345^', rpr(source));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_parse_use_and_fallback = function() {
    var GUY, error_literal, result;
    GUY = require(H.guy_path);
    error_literal = {
      type: 'Literal',
      start: 0,
      end: 7,
      value: 'ERROR',
      raw: "'ERROR'"
    };
    debug('^334^', GUY.src.parse({
      use: 'strict',
      text: "'ERROR'"
    }));
    debug('^334^', result = GUY.src.parse({
      use: 'strict',
      text: 'let x = 1;',
      fallback: error_literal
    }));
    info(rpr(GUY.src._generate(result)));
    debug('^334^', result = GUY.src.parse({
      use: 'strict,loose',
      text: 'let x = 1;',
      fallback: error_literal
    }));
    info(rpr(GUY.src._generate(result)));
    debug('^334^', result = GUY.src.parse({
      use: 'loose',
      text: 'let x = 1;',
      fallback: error_literal
    }));
    info(rpr(GUY.src._generate(result)));
    debug('^334^', result = GUY.src.parse({
      use: 'strict',
      text: 'let x ^^^ 1;',
      fallback: error_literal
    }));
    info(rpr(GUY.src._generate(result)));
    debug('^334^', result = GUY.src.parse({
      use: 'strict,loose',
      text: 'let x ^^^ 1;',
      fallback: error_literal
    }));
    info(rpr(GUY.src._generate(result)));
    debug('^334^', result = GUY.src.parse({
      use: 'loose',
      text: 'let x ^^^ 1;',
      fallback: error_literal
    }));
    info(rpr(GUY.src._generate(result)));
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // @[ "guy.str.SQL tag function" ]()
      // demo_return_clauses()
      // demo_acorn_walk()
      // test @[ "guy.src.parse() accepts `fallback` argument, otherwise errors where appropriate" ]
      // @[ "guy.src.parse()" ]()
      // test @[ "guy.src.parse()" ]
      // demo_parse_use_and_fallback()
      return demo_acorn_walk();
    })();
  }

}).call(this);

//# sourceMappingURL=src.tests.js.map
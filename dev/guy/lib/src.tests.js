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
  this["GUY.src.parse()"] = function(T, done) {
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
  this["GUY.src.parse() accepts `fallback` argument, otherwise errors where appropriate"] = async function(T, done) {
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
  this["GUY.src.slug_node_from_simple_function()"] = async function(T, done) {
    var GUY, error, f3, i, len, matcher, probe, probes_and_matchers;
    // T?.halt_on_error()
    GUY = require(H.guy_path);
    f3 = function(x) {
      if (x > 0) {
        return true;
      }
      if (x < 0) {
        return false;
      }
      return null;
    };
    probes_and_matchers = [
      [
        {
          function: (function() {})
        },
        {
          type: 'BlockStatement',
          start: 11,
          end: 13,
          body: []
        }
      ],
      [
        {
          function: (function(x) {
            return 42;
          })
        },
        {
          type: 'ReturnStatement',
          start: 26,
          end: 36,
          argument: {
            type: 'Literal',
            start: 33,
            end: 35,
            value: 42,
            raw: '42'
          }
        }
      ],
      [
        {
          function: (function(x) {
            return (x == null) || (this.isa.object(x)) || (this.isa.nonempty.text(x));
          })
        },
        {
          type: 'ReturnStatement',
          start: 26,
          end: 100,
          argument: {
            type: 'LogicalExpression',
            start: 33,
            end: 99,
            left: {
              type: 'LogicalExpression',
              start: 33,
              end: 68,
              left: {
                type: 'BinaryExpression',
                start: 34,
                end: 43,
                left: {
                  type: 'Identifier',
                  start: 34,
                  end: 35,
                  name: 'x'
                },
                operator: '==',
                right: {
                  type: 'Literal',
                  start: 39,
                  end: 43,
                  value: null,
                  raw: 'null'
                }
              },
              operator: '||',
              right: {
                type: 'CallExpression',
                start: 49,
                end: 67,
                callee: {
                  type: 'MemberExpression',
                  start: 49,
                  end: 64,
                  object: {
                    type: 'MemberExpression',
                    start: 49,
                    end: 57,
                    object: {
                      type: 'ThisExpression',
                      start: 49,
                      end: 53
                    },
                    property: {
                      type: 'Identifier',
                      start: 54,
                      end: 57,
                      name: 'isa'
                    },
                    computed: false,
                    optional: false
                  },
                  property: {
                    type: 'Identifier',
                    start: 58,
                    end: 64,
                    name: 'object'
                  },
                  computed: false,
                  optional: false
                },
                arguments: [
                  {
                    type: 'Identifier',
                    start: 65,
                    end: 66,
                    name: 'x'
                  }
                ],
                optional: false
              }
            },
            operator: '||',
            right: {
              type: 'CallExpression',
              start: 73,
              end: 98,
              callee: {
                type: 'MemberExpression',
                start: 73,
                end: 95,
                object: {
                  type: 'MemberExpression',
                  start: 73,
                  end: 90,
                  object: {
                    type: 'MemberExpression',
                    start: 73,
                    end: 81,
                    object: {
                      type: 'ThisExpression',
                      start: 73,
                      end: 77
                    },
                    property: {
                      type: 'Identifier',
                      start: 78,
                      end: 81,
                      name: 'isa'
                    },
                    computed: false,
                    optional: false
                  },
                  property: {
                    type: 'Identifier',
                    start: 82,
                    end: 90,
                    name: 'nonempty'
                  },
                  computed: false,
                  optional: false
                },
                property: {
                  type: 'Identifier',
                  start: 91,
                  end: 95,
                  name: 'text'
                },
                computed: false,
                optional: false
              },
              arguments: [
                {
                  type: 'Identifier',
                  start: 96,
                  end: 97,
                  name: 'x'
                }
              ],
              optional: false
            }
          }
        }
      ],
      [
        {
          function: function ( x ) { 42; }
        },
        {
          type: 'BlockStatement',
          start: 15,
          end: 22,
          body: [
            {
              type: 'ExpressionStatement',
              start: 17,
              end: 20,
              expression: {
                type: 'Literal',
                start: 17,
                end: 19,
                value: 42,
                raw: '42'
              }
            }
          ]
        }
      ],
      [
        {
          function: function ( x ) { return 42; }
        },
        {
          type: 'ReturnStatement',
          start: 17,
          end: 27,
          argument: {
            type: 'Literal',
            start: 24,
            end: 26,
            value: 42,
            raw: '42'
          }
        }
      ],
      [
        {
          function: (function(x) {
            if (x != null) {
              return true;
            } else {
              return false;
            }
          })
        },
        {
          type: 'BlockStatement',
          start: 12,
          end: 144,
          body: [
            {
              type: 'IfStatement',
              start: 26,
              end: 132,
              test: {
                type: 'BinaryExpression',
                start: 30,
                end: 39,
                left: {
                  type: 'Identifier',
                  start: 30,
                  end: 31,
                  name: 'x'
                },
                operator: '!=',
                right: {
                  type: 'Literal',
                  start: 35,
                  end: 39,
                  value: null,
                  raw: 'null'
                }
              },
              consequent: {
                type: 'BlockStatement',
                start: 41,
                end: 83,
                body: [
                  {
                    type: 'ReturnStatement',
                    start: 57,
                    end: 69,
                    argument: {
                      type: 'Literal',
                      start: 64,
                      end: 68,
                      value: true,
                      raw: 'true'
                    }
                  }
                ]
              },
              alternate: {
                type: 'BlockStatement',
                start: 89,
                end: 132,
                body: [
                  {
                    type: 'ReturnStatement',
                    start: 105,
                    end: 118,
                    argument: {
                      type: 'Literal',
                      start: 112,
                      end: 117,
                      value: false,
                      raw: 'false'
                    }
                  }
                ]
              }
            }
          ]
        }
      ],
      [
        {
          function: (function(x) {
            return (x == null) || (this.isa.object(x)) || (this.isa.nonempty.text(x));
          })
        },
        {
          type: 'ReturnStatement',
          start: 26,
          end: 100,
          argument: {
            type: 'LogicalExpression',
            start: 33,
            end: 99,
            left: {
              type: 'LogicalExpression',
              start: 33,
              end: 68,
              left: {
                type: 'BinaryExpression',
                start: 34,
                end: 43,
                left: {
                  type: 'Identifier',
                  start: 34,
                  end: 35,
                  name: 'x'
                },
                operator: '==',
                right: {
                  type: 'Literal',
                  start: 39,
                  end: 43,
                  value: null,
                  raw: 'null'
                }
              },
              operator: '||',
              right: {
                type: 'CallExpression',
                start: 49,
                end: 67,
                callee: {
                  type: 'MemberExpression',
                  start: 49,
                  end: 64,
                  object: {
                    type: 'MemberExpression',
                    start: 49,
                    end: 57,
                    object: {
                      type: 'ThisExpression',
                      start: 49,
                      end: 53
                    },
                    property: {
                      type: 'Identifier',
                      start: 54,
                      end: 57,
                      name: 'isa'
                    },
                    computed: false,
                    optional: false
                  },
                  property: {
                    type: 'Identifier',
                    start: 58,
                    end: 64,
                    name: 'object'
                  },
                  computed: false,
                  optional: false
                },
                arguments: [
                  {
                    type: 'Identifier',
                    start: 65,
                    end: 66,
                    name: 'x'
                  }
                ],
                optional: false
              }
            },
            operator: '||',
            right: {
              type: 'CallExpression',
              start: 73,
              end: 98,
              callee: {
                type: 'MemberExpression',
                start: 73,
                end: 95,
                object: {
                  type: 'MemberExpression',
                  start: 73,
                  end: 90,
                  object: {
                    type: 'MemberExpression',
                    start: 73,
                    end: 81,
                    object: {
                      type: 'ThisExpression',
                      start: 73,
                      end: 77
                    },
                    property: {
                      type: 'Identifier',
                      start: 78,
                      end: 81,
                      name: 'isa'
                    },
                    computed: false,
                    optional: false
                  },
                  property: {
                    type: 'Identifier',
                    start: 82,
                    end: 90,
                    name: 'nonempty'
                  },
                  computed: false,
                  optional: false
                },
                property: {
                  type: 'Identifier',
                  start: 91,
                  end: 95,
                  name: 'text'
                },
                computed: false,
                optional: false
              },
              arguments: [
                {
                  type: 'Identifier',
                  start: 96,
                  end: 97,
                  name: 'x'
                }
              ],
              optional: false
            }
          }
        }
      ],
      [
        {
          function: f3
        },
        {
          type: 'BlockStatement',
          start: 12,
          end: 135,
          body: [
            {
              type: 'IfStatement',
              start: 20,
              end: 61,
              test: {
                type: 'BinaryExpression',
                start: 24,
                end: 29,
                left: {
                  type: 'Identifier',
                  start: 24,
                  end: 25,
                  name: 'x'
                },
                operator: '>',
                right: {
                  type: 'Literal',
                  start: 28,
                  end: 29,
                  value: 0,
                  raw: '0'
                }
              },
              consequent: {
                type: 'BlockStatement',
                start: 31,
                end: 61,
                body: [
                  {
                    type: 'ReturnStatement',
                    start: 41,
                    end: 53,
                    argument: {
                      type: 'Literal',
                      start: 48,
                      end: 52,
                      value: true,
                      raw: 'true'
                    }
                  }
                ]
              },
              alternate: null
            },
            {
              type: 'IfStatement',
              start: 68,
              end: 110,
              test: {
                type: 'BinaryExpression',
                start: 72,
                end: 77,
                left: {
                  type: 'Identifier',
                  start: 72,
                  end: 73,
                  name: 'x'
                },
                operator: '<',
                right: {
                  type: 'Literal',
                  start: 76,
                  end: 77,
                  value: 0,
                  raw: '0'
                }
              },
              consequent: {
                type: 'BlockStatement',
                start: 79,
                end: 110,
                body: [
                  {
                    type: 'ReturnStatement',
                    start: 89,
                    end: 102,
                    argument: {
                      type: 'Literal',
                      start: 96,
                      end: 101,
                      value: false,
                      raw: 'false'
                    }
                  }
                ]
              },
              alternate: null
            },
            {
              type: 'ReturnStatement',
              start: 117,
              end: 129,
              argument: {
                type: 'Literal',
                start: 124,
                end: 128,
                value: null,
                raw: 'null'
              }
            }
          ]
        }
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result;
          result = GUY.src.slug_node_from_simple_function(probe);
          result = convert_to_plain_objects(result);
          urge('^33424^', result);
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["GUY.src.slug_from_simple_function()"] = async function(T, done) {
    var GUY, error, f3, i, len, matcher, probe, probes_and_matchers;
    // T?.halt_on_error()
    GUY = require(H.guy_path);
    f3 = function(x) {
      if (x > 0) {
        return true;
      }
      if (x < 0) {
        return false;
      }
      return null;
    };
    probes_and_matchers = [
      [
        {
          function: (function() {})
        },
        ''
      ],
      [
        {
          function: (function(x) {
            return 42;
          })
        },
        '42'
      ],
      [
        {
          function: (function(x) {
            return (x == null) || (this.isa.object(x)) || (this.isa.nonempty.text(x));
          })
        },
        'x == null || this.isa.object(x) || this.isa.nonempty.text(x)'
      ],
      [
        {
          function: function ( x ) { 42; }
        },
        '42;'
      ],
      [
        {
          function: function ( x ) { return 42; }
        },
        '42'
      ],
      [
        {
          function: (function(x) {
            if (x != null) {
              return true;
            } else {
              return false;
            }
          })
        },
        'if (x != null) { return true; } else { return false; }'
      ],
      [
        {
          function: (function(x) {
            return (x == null) || (this.isa.object(x)) || (this.isa.nonempty.text(x));
          })
        },
        'x == null || this.isa.object(x) || this.isa.nonempty.text(x)'
      ],
      [
        {
          function: f3
        },
        'if (x > 0) { return true; } if (x < 0) { return false; } return null;'
      ],
      [
        {
          text: 'let x = 42;'
        },
        'let x = 42;',
        null
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result;
          result = GUY.src.slug_from_simple_function(probe);
          // urge '^33424^', rpr result
          return resolve(result);
        });
      });
    }
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
    var GUY, cfg, cfgs, f3, i, len, ref;
    GUY = require(H.guy_path);
    f3 = function(x) {
      if (x > 0) {
        return true;
      }
      if (x < 0) {
        return false;
      }
      return null;
    };
    cfgs = [
      {
        // { function: ( `function ( x ) { 42; }` ), }
        // { function: ( `function ( x ) { return 42; }` ), }
        // { function: ( ( x ) -> if x? then true else false ), }
        // { function: ( ( x ) -> ( not x? ) or ( @isa.object x ) or ( @isa.nonempty.text x ) ), }
        // { function: f3, }
        text: 'let x ^^^ 42;',
        use: 'strict',
        fallback: 'NOTGOOD'
      },
      {
        // { text: 'let x ^^^ 42;', use: 'strict', }
        text: 'let x = 42;',
        use: 'strict'
      },
      {
        text: 'let x = 42;'
      }
    ];
    for (i = 0, len = cfgs.length; i < len; i++) {
      cfg = cfgs[i];
      whisper('————————————————————————————————————————————————————');
      urge('^5345^', ((ref = cfg.function) != null ? ref : cfg.text).toString());
      info('^5345^', rpr(GUY.src.slug_from_simple_function(cfg)));
    }
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
      return test(this);
    })();
  }

  // @[ "guy.str.SQL tag function" ]()
// demo_return_clauses()
// test @[ "GUY.src.parse() accepts `fallback` argument, otherwise errors where appropriate" ]
// @[ "GUY.src.parse()" ]()
// test @[ "GUY.src.parse()" ]
// demo_parse_use_and_fallback()
// demo_acorn_walk()
// test @[ "GUY.src.slug_node_from_simple_function()" ]
// test @[ "GUY.src.slug_from_simple_function()" ]

}).call(this);

//# sourceMappingURL=src.tests.js.map
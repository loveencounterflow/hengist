/* Generated by the Nim Compiler v1.4.6 */
var framePtr = null;
var excHandler = 0;
var lastJSError = null;
function toJSStr(s_1455096) {
                    var Tmp5;
            var Tmp7;

  var result_1455097 = null;

    var res_1455170 = newSeq_1455128((s_1455096).length);
    var i_1455172 = 0;
    var j_1455174 = 0;
    L1: do {
        L2: while (true) {
        if (!(i_1455172 < (s_1455096).length)) break L2;
          var c_1455175 = s_1455096[i_1455172];
          if ((c_1455175 < 128)) {
          res_1455170[j_1455174] = String.fromCharCode(c_1455175);
          i_1455172 += 1;
          }
          else {
            var helper_1455198 = newSeq_1455128(0);
            L3: do {
                L4: while (true) {
                if (!true) break L4;
                  var code_1455199 = c_1455175.toString(16);
                  if ((((code_1455199) == null ? 0 : (code_1455199).length) == 1)) {
                  helper_1455198.push("%0");;
                  }
                  else {
                  helper_1455198.push("%");;
                  }
                  
                  helper_1455198.push(code_1455199);;
                  i_1455172 += 1;
                    if (((s_1455096).length <= i_1455172)) Tmp5 = true; else {                      Tmp5 = (s_1455096[i_1455172] < 128);                    }                  if (Tmp5) {
                  break L3;
                  }
                  
                  c_1455175 = s_1455096[i_1455172];
                }
            } while(false);
++excHandler;
            Tmp7 = framePtr;
            try {
            res_1455170[j_1455174] = decodeURIComponent(helper_1455198.join(""));
--excHandler;
} catch (EXC) {
 var prevJSError = lastJSError;
 lastJSError = EXC;
 --excHandler;
            framePtr = Tmp7;
            res_1455170[j_1455174] = helper_1455198.join("");
            lastJSError = prevJSError;
            } finally {
            framePtr = Tmp7;
            }
          }
          
          j_1455174 += 1;
        }
    } while(false);
    if (res_1455170.length < j_1455174) { for (var i=res_1455170.length;i<j_1455174;++i) res_1455170.push(null); }
               else { res_1455170.length = j_1455174; };
    result_1455097 = res_1455170.join("");

  return result_1455097;

}
function rawEcho() {
          var buf = "";
      for (var i = 0; i < arguments.length; ++i) {
        buf += toJSStr(arguments[i]);
      }
      console.log(buf);
    

  
}
function makeNimstrLit(c_1455062) {
      var ln = c_1455062.length;
  var result = new Array(ln);
  for (var i = 0; i < ln; ++i) {
    result[i] = c_1455062.charCodeAt(i);
  }
  return result;
  

  
}
function newSeq_1455128(len_1455131) {
  var result_1455133 = [];

  var F={procname:"newSeq.newSeq",prev:framePtr,filename:"/home/flow/temp/nim-1.4.6/lib/system.nim",line:0};
  framePtr = F;
    F.line = 656;
    result_1455133 = new Array(len_1455131); for (var i=0;i<len_1455131;++i) {result_1455133[i]=null;}  framePtr = F.prev;

  return result_1455133;

}
var F={procname:"module greetings",prev:framePtr,filename:"/home/flow/jzr/hengist/dev/snippets/nim/greetings.nim",line:0};
framePtr = F;
F.line = 2;
rawEcho(makeNimstrLit("What\'s your name? "));
F.line = 4;
var name_1852006 = [makeNimstrLit("~flow")];
F.line = 5;
rawEcho(makeNimstrLit("Hi, "), name_1852006[0], makeNimstrLit("!"));
framePtr = F.prev;
var F={procname:"module greetings",prev:framePtr,filename:"/home/flow/jzr/hengist/dev/snippets/nim/greetings.nim",line:0};
framePtr = F;
framePtr = F.prev;
var F={procname:"module greetings",prev:framePtr,filename:"/home/flow/jzr/hengist/dev/snippets/nim/greetings.nim",line:0};
framePtr = F;
framePtr = F.prev;

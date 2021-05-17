// The entry file of your WebAssembly module.

export function add(a: i32, b: i32): i32 {
  return a + b;
}

// export const add2 = ( x: string ) => { return add( x, 42 ); }
export function add2( x: string ): i32 { return add( parseInt( x, 10 ) as i32, 42 ); }

// console.log( `^456564^, ${add( 123, 456 )}` );

export function concat(a: string, b: string): string {
  // thx to https://www.assemblyscript.org/loader.html#usage
  return a + b
}

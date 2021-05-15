// This script defines a function with two parameters

let a = 3;

fn addme(a, b) {
    a = 42;             // notice that 'a' is passed by value
    a * b;              // notice that the last value is returned even if terminated by a semicolon
}

// print( addme );
print(`addme(a, 4) should be 46: ${addme(a, 4)}`);
// print(`addme(a, 4) should be 46: ${addme(a, "helo")}`);

print(`a should still be 3: ${a}`);     // should print 3 - 'a' is never changed

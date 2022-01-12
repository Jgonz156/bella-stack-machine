![Logo](https://raw.githubusercontent.com/rtoal/bella/main/docs/bellalogo.png)

# Bella

A simple programming language, used for a compiler course. Here is a sample program:

```
let dozen = 12;
print(dozen % 3 ** 1);
function gcd(x, y) = return y == 0 ? x : gcd(y, x % y);
while (!dozen >= 3 || gcd(1, 10) != 5) {
  let y = 0;
  dozen = dozen - 2.75E+19 ** 1 ** 3;
}
```

## Language Specification

The language is specified at its [home page](http://localhost/~ray/notes/bella/).

## Building

Nodejs is required to build and run this project. Make sure you have a recent version of Node, since the source code uses a fair amount of very modern JavaScript.

Clone the repo, then run `npm install`.

You can then run `npm test`.

## Usage

You can run this on the command line or use this as a module in a larger program.

Command line syntax:

```
node bella.js <filename> <outputType>
```

The `outputType` indicates what you wish to print to standard output:

<table>
<tr><th>Option</th><th>Description</th></tr>
<tr><td>ast</td><td>The AST</td></tr>
<tr><td>analyzed</td><td>The decorated AST</td></tr>
<tr><td>optimized</td><td>The optimized decorated AST</td></tr>
<tr><td>llvm</td><td>The translation of the program to LLVM IR</td></tr>
<tr><td>c</td><td>The translation of the program to C</td></tr>
<tr><td>js</td><td>The translation of the program to JavaScript</td></tr>
</table>

To embed in another program:

```
import { compile } from astro

compile(programAsString, outputType)
```

where the `outputType` argument is as in the previous section.

## Contributing

I’m happy to take PRs. As usual, be nice when filing issues and contributing. Do remember the idea is to keep the language tiny; if you’d like to extend the language, you’re probably better forking into a new project. However, I would love to see any improvements you might have for the implementation or the pedagogy.

Make sure to run `npm test` before submitting the PR.

// CODE GENERATOR
//
// Invoke generate(program) with the program node to get back the JavaScript
// translation as a string.

import { instructionSet, standardLibrary } from "./core.js"

//The use of the stack machine instruction set is very
//numerous so an alias helps clean up the appearance

const is = instructionSet

export default function generateSM(program) {
  const output = []
  const stack = []
  let programCounter = 0

  // Variable names in JS will be suffixed with _1, _2, _3, etc. This is
  // because "for", for example, is a legal variable name in Bella, but
  // not in JS. So we want to generate something like "for_1". We handle
  // this by mapping each variable declaration to its suffix.
  const targetName = (mapping => {
    return entity => {
      if (!mapping.has(entity)) {
        mapping.set(entity, mapping.size + 1)
      }
      return `${entity.name}_${mapping.get(entity)}`
    }
  })(new Map())

  const binExpInstruction = op =>
    ({
      "||": is.OR,
      "&&": is.AND,
      "<=": is.LTE,
      "<": is.LT,
      "==": is.EQ,
      "!=": is.NEQ,
      ">": is.GT,
      ">=": is.GTE,
      "+": is.ADD,
      "-": is.SUB,
      "*": is.MUL,
      "/": is.DIV,
      "%": is.MOD,
      "**": is.EXP,
    }[op])

  const gen = node => generators[node.constructor.name](node)

  const stackPush = add => {
    stack.push(add)
    return [...stack].join(" ")
  }
  const stackPop = () => {
    stack.pop()
    return [...stack].join(" ")
  }

  const popUntil = marker => {
    while (stack.pop() != marker) continue
    return [...stack].join(" ")
  }
  const generators = {
    Program(p) {
      gen(p.statements)
    },
    VariableDeclaration(d) {
      //output.push(`let ${targetName(d.variable)} = ${gen(d.initializer)};`)
      //output.push(is.LOAD.setup(gen(d.initializer)))
      gen(d.initializer)
      output.push(is.STORE.setup(d.variable.name, stackPop()))
      programCounter++
    },
    Variable(v) {
      if (v === standardLibrary.π) {
        output.push(is.LOAD.setup("PI", stackPush("PI")))
        programCounter++
        return "PI"
      }
      output.push(is.LOAD.setup(v.name, stackPush(v.name)))
      programCounter++
      return v.name
    },
    FunctionDeclaration(d) {
      //const params = d.params.map(targetName).join(", ")
      //output.push(`function ${targetName(d.fun)}(${params}) {`)
      //output.push(`return ${gen(d.body)};`)
      //output.push("}")
      output.push(is.STFUNC.setup("", stackPush("STFUNC")))
      output.push(is.STPARM.setup("", stackPush("STPARM")))
      programCounter += 2
      d.params.map(gen)
      //d.params.map(gen).forEach(p => {
      //  output.push(is.LOAD.setup(p, stackPush(p)))
      //  programCounter++
      //})
      output.push(is.MKPARM.setup("", popUntil("STPARM")))

      output.push(is.STBODY.setup("", stackPush("STBODY")))
      programCounter += 2
      gen(d.body)
      output.push(is.MKBODY.setup("", popUntil("STBODY")))

      const name = gen(d.fun)
      output.push(is.LOAD.setup(name, stackPush(name)))
      output.push(is.MKFUNC.setup("", popUntil("STFUNC")))
      programCounter += 3
    },
    Function(f) {
      const standard = new Map([
        [standardLibrary.sqrt, "sqrt"],
        [standardLibrary.sin, "sin"],
        [standardLibrary.cos, "cos"],
        [standardLibrary.exp, "exp"],
        [standardLibrary.ln, "log"],
        [standardLibrary.hypot, "hypot"],
      ]).get(f)
      return standard ?? f.name
    },
    PrintStatement(s) {
      //const argument = gen(s.argument)
      //output.push(`console.log(${argument});`)
      gen(s.argument)
      output.push(is.CALL.setup("print", "CHOMP"))
      programCounter++
    },
    Assignment(s) {
      //output.push(`${targetName(s.target)} = ${gen(s.source)};`)
      //output.push(is.LOAD.setup(gen(s.source)))
      gen(s.source)
      output.push(is.STORE.setup(gen(s.target), stackPop()))
      programCounter++
    },
    WhileStatement(s) {
      //output.push(`while (${gen(s.test)}) {`)
      //gen(s.body)
      //output.push("}")
      let startOfTest = programCounter
      gen(s.test)
      let startForJumpF = programCounter
      gen(s.body)
      output.push(is.JUMP.setup(startOfTest, [...stack].join(" ")))
      programCounter++
      output.splice(startForJumpF, 0, is.JUMPF.setup(programCounter + 1, stackPop()))
    },
    Call(c) {
      //const args = gen(c.args)
      //const callee = gen(c.callee)
      //return `${callee}(${args.join(",")})`
      gen(c.args)
      output.push(is.CALL.setup(gen(c.callee), "CHOMP"))
      programCounter++
    },
    Conditional(e) {
      //return `((${gen(e.test)}) ? (${gen(e.consequent)}) : (${gen(e.alternate)}))`
      gen(e.test)
      let startForJumpF = programCounter
      gen(e.consequent)
      let startForJump = programCounter + 1
      gen(e.alternate)
      output.splice(startForJumpF, 0, is.JUMPF.setup(startForJump + 1, stackPop()))
      programCounter++
      output.splice(
        startForJump,
        0,
        is.JUMP.setup(programCounter + 2, [...stack].join(" "))
      )
    },
    BinaryExpression(e) {
      //return `(${gen(e.left)} ${e.op} ${gen(e.right)})`
      gen(e.left)
      gen(e.right)
      output.push(binExpInstruction(e.op).setup("", stackPop()))
      programCounter++
    },
    UnaryExpression(e) {
      //return `${e.op}(${gen(e.operand)})`
      gen(e.operand)
      output.push(is.NEG.setup("", stackPush("-")))
      programCounter++
    },
    Number(e) {
      output.push(is.LOAD.setup(e, stackPush(e)))
      programCounter++
      return e
    },
    Boolean(e) {
      output.push(is.LOAD.setup(e, stackPush(e)))
      programCounter++
      return e
    },
    Array(a) {
      return a.map(gen)
    },
  }

  gen(program)
  return output //.join("\n")
}

export class Program {
  constructor(statements) {
    this.statements = statements
  }
}

export class VariableDeclaration {
  constructor(variable, initializer) {
    Object.assign(this, { variable, initializer })
  }
}

export class FunctionDeclaration {
  constructor(fun, params, body) {
    Object.assign(this, { fun, params, body })
  }
}

export class Assignment {
  constructor(target, source) {
    Object.assign(this, { target, source })
  }
}

export class WhileStatement {
  constructor(test, body) {
    Object.assign(this, { test, body })
  }
}

export class PrintStatement {
  constructor(argument) {
    Object.assign(this, { argument })
  }
}

export class Call {
  constructor(callee, args) {
    Object.assign(this, { callee, args })
  }
}

export class Conditional {
  constructor(test, consequent, alternate) {
    Object.assign(this, { test, consequent, alternate })
  }
}

export class BinaryExpression {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right })
  }
}

export class UnaryExpression {
  constructor(op, operand) {
    Object.assign(this, { op, operand })
  }
}

export class Variable {
  constructor(name, readOnly) {
    Object.assign(this, { name, readOnly })
  }
}

export class Function {
  constructor(name, paramCount) {
    Object.assign(this, { name, paramCount })
  }
}

export const standardLibrary = Object.freeze({
  π: new Variable("π", true),
  sqrt: new Function("sqrt", 1),
  sin: new Function("sin", 1),
  cos: new Function("cos", 1),
  exp: new Function("exp", 1),
  ln: new Function("ln", 1),
  hypot: new Function("hypot", 2),
})

//Stack Machine Core

export class SMInstruction {
  constructor(OPNAME, OPARG = "", STACK = "") {
    Object.assign(this, { OPNAME, OPARG, STACK })
  }

  setup(OPARG, STACK) {
    Object.assign(this, { OPARG, STACK })
    return new SMInstruction(this.OPNAME, OPARG, STACK)
  }
}

export const instructionSet = Object.freeze({
  NOOP: new SMInstruction("NOOP"),
  LOAD: new SMInstruction("LOAD"),
  STORE: new SMInstruction("STORE"),
  POP: new SMInstruction("POP"),
  NEG: new SMInstruction("NEG"),
  OR: new SMInstruction("OR"),
  AND: new SMInstruction("AND"),
  LTE: new SMInstruction("LTE"),
  LT: new SMInstruction("LT"),
  EQ: new SMInstruction("EQ"),
  NEQ: new SMInstruction("NEQ"),
  GTE: new SMInstruction("GTE"),
  GT: new SMInstruction("GT"),
  ADD: new SMInstruction("ADD"),
  SUB: new SMInstruction("SUB"),
  MUL: new SMInstruction("MUL"),
  DIV: new SMInstruction("DIV"),
  MOD: new SMInstruction("MOD"),
  EXP: new SMInstruction("EXP"),
  CALL: new SMInstruction("CALL"),
  JUMP: new SMInstruction("JUMP"),
  JUMPF: new SMInstruction("JUMPF"),
  STFUNC: new SMInstruction("STFUNC"),
  MKFUNC: new SMInstruction("MKFUNC"),
  STPARM: new SMInstruction("STPARM"),
  MKPARM: new SMInstruction("MKPARM"),
  STBODY: new SMInstruction("STBODY"),
  MKBODY: new SMInstruction("MKBODY"),
})

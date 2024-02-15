import parse from "./parser.js"
import analyze from "./analyzer.js"
import optimize from "./optimizer.js"
import generateJS from "./generator-js.js"
import generateSM from "./generator-sm.js"

export default function compile(source, outputType) {
  if (!["parsed", "analyzed", "optimized", "js", "sm"].includes(outputType)) {
    throw new Error("Unknown output type")
  }
  const match = parse(source)
  if (outputType === "parsed") return "Syntax is ok"
  const analyzed = analyze(match)
  if (outputType === "analyzed") return analyzed
  const optimized = optimize(analyzed)
  if (outputType === "optimized") return optimized
  if (outputType === "js") return generateJS(optimized)
  return generateSM(optimized)
}

import demo from "./demo"

console.log(401)
const fn = (val: string) => {
  return val.toUpperCase() + ":" + demo()
}

// const city = "New York"
let firstName = "Alice"
firstName = fn(firstName)
console.log(firstName)

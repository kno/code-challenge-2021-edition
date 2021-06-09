import demo from "./demo"

describe("demo", () => {
  it("less return less than 10", () => {
    expect(demo()).toBe("less than 10")
  })

  it("should return equal to or greater than 10", () => {
    expect(demo(11)).toBe("equal to or greater than 10")
  })
})

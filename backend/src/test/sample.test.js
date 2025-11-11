// Sample test to verify Jest setup is working
describe("Sample Tests", () => {
  test("should pass - Jest is configured correctly", () => {
    expect(1 + 1).toBe(2);
  });

  test("should verify Node.js environment", () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});

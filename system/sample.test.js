import React from 'react';
describe("Sample System Test", () => {
  it("should pass this basic test", () => {
    expect(2 + 2).toBe(4); // Simple test to verify setup
  });

  it("should handle string comparison", () => {
    expect("healthy").toBe("healthy"); // Test for string equality
  });
});

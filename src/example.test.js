import { describe, it, expect } from 'vitest';

// Example test suite
describe('Example Test Suite', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should check string equality', () => {
    const greeting = 'Hello, World!';
    expect(greeting).toBe('Hello, World!');
  });

  it('should check array contains value', () => {
    const numbers = [1, 2, 3, 4, 5];
    expect(numbers).toContain(3);
  });

  it('should check object properties', () => {
    const user = {
      name: 'John',
      age: 30
    };
    expect(user).toHaveProperty('name');
    expect(user.name).toBe('John');
  });
});

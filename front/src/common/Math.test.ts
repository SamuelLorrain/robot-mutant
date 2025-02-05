import { range } from "./Math"

test("Range works with 1 argument", () => {
  const gen = range(5);
  expect(gen.next()).toStrictEqual({"done": false, value: 0});
  expect(gen.next()).toStrictEqual({"done": false, value: 1});
  expect(gen.next()).toStrictEqual({"done": false, value: 2});
  expect(gen.next()).toStrictEqual({"done": false, value: 3});
  expect(gen.next()).toStrictEqual({"done": false, value: 4});
  expect(gen.next()).toStrictEqual({"done": true, value: undefined});
})

test("Range works with 2 argument", () => {
  const gen = range(4, 9);
  expect(gen.next()).toStrictEqual({"done": false, value: 4});
  expect(gen.next()).toStrictEqual({"done": false, value: 5});
  expect(gen.next()).toStrictEqual({"done": false, value: 6});
  expect(gen.next()).toStrictEqual({"done": false, value: 7});
  expect(gen.next()).toStrictEqual({"done": false, value: 8});
  expect(gen.next()).toStrictEqual({"done": true, value: undefined});
})

test("Range works as an iterator", () => {
  let counter = 0;
  for(const i of range(5)) {
    expect(typeof i).toStrictEqual("number");
    counter++;
  }
  expect(counter).toBe(5);

  let counter2 = 0;
  for(const i of range(-5, 5)) {
    expect(typeof i).toStrictEqual("number");
    counter2++;
  }
  expect(counter2).toBe(10);
})

import { toChars, Atom, parseAtom, parseList, List } from "./main";
import { parse } from "path";

test("should return a array of caracters, given a string", () => {
  const actual = toChars("abc");
  const expected = ["a", "b", "c"];

  let result = true;

  for (let i = 0; i < expected.length; i++) {
    result = result && expected[i] == actual[i];
  }
  expect(result).toBe(true);
});

test("should return a number Atom, given a string containing a number", () => {
  const actual = parseAtom("1");
  const expected = <Atom>{ value: 1 };
  expect(expected.value).toBe(actual.value);
});

test("should return a symbol Atom, given a string containing a Name", () => {
  const actual = parseAtom("a");
  const expected = <Atom>{ value: "a" };
  expect(expected.value).toBe(actual.value);
});

test("should throw if the given string is invalid", () => {
  const actual = () => {
    parseAtom("");
  };
  expect(actual).toThrowError(Error("Invalid symbol"));
});

test("should throw if the given string is invalid", () => {
  const actual = () => {
    parseList("");
  };

  expect(actual).toThrowError(Error("Expected a valid string"));
});

test("should throw if starting ( is not given", () => {
  const actual = () => {
    parseList("12");
  };
  expect(actual).toThrowError(Error("Starting ( not found"));
});

test("should return an empty list for ()", () => {
  const actual = parseList("()");
  const expected = <List>{
    items: [],
  };
  expect(expected.items.length === actual.items.length).toBe(true);
});

test("should return a List with one number atom", () => {
  const actual = parseList("(1)");
  const expected = <List>{
    items: [<Atom>{ value: 1 }],
  };
  expect(expected.items.length === actual.items.length).toBe(true);
  expect(
    (<Atom>expected.items[0]).value === (<Atom>actual.items[0]).value
  ).toBe(true);
});

test("should return a List with 2 Atoms ", () => {
  const actual = parseList("(1 a)");
  const expected = <List>{
    items: [<Atom>{ value: 1 }, <Atom>{ value: "a" }],
  };

  expect(expected.items.length === actual.items.length).toBe(true);
  expect(
    (<Atom>expected.items[0]).value === (<Atom>actual.items[0]).value
  ).toBe(true);

  expect(
    (<Atom>expected.items[1]).value === (<Atom>actual.items[1]).value
  ).toBe(true);
});

test("should return a List, given a string with nested list", () => {
  const actual = parseList("(1 2 ())");
  const expected = <List>{
    items: [
      <Atom>{ value: 1 },
      <Atom>{ value: 2 },
      <List>{
        items: [],
      },
    ],
  };

  expect(expected.items.length === actual.items.length).toBe(true);
  expect(
    (<Atom>expected.items[0]).value === (<Atom>actual.items[0]).value
  ).toBe(true);

  expect(
    (<Atom>expected.items[1]).value === (<Atom>actual.items[1]).value
  ).toBe(true);

  expect((<List>expected.items[2]).items.length === 0).toBe(true);
});

test("Should return a list, given a string with symbol and numeric atoms", () => {
  const actual = parseList("(add 1 2)");
  const expected = <List>{
    items: [<Atom>{ value: "add" }, <Atom>{ value: 1 }, <Atom>{ value: 2 }],
  };

  expect(expected.items.length === actual.items.length).toBe(true);
  expect(
    (<Atom>expected.items[0]).value === (<Atom>actual.items[0]).value
  ).toBe(true);

  expect(
    (<Atom>expected.items[1]).value === (<Atom>actual.items[1]).value
  ).toBe(true);

  expect(
    (<Atom>expected.items[2]).value === (<Atom>actual.items[2]).value
  ).toBe(true);
});

test("should return a nested list given a string of arithmetic expression", () => {
  const actual = parseList("(+ 1 2 (* 3 4)");
  const expected = <List>{
    items: [
      <Atom>{ value: "+" },
      <Atom>{ value: 1 },
      <Atom>{ value: 2 },
      <List>{
        items: [
          <Atom>{ value: "*" },
          <Atom>{ value: 3 },
          <Atom>{ value: 4 },
        ],
      },
    ],
  };

  expect(expected.items.length === actual.items.length).toBe(true);
  expect(
    (<Atom>expected.items[0]).value === (<Atom>actual.items[0]).value
  ).toBe(true);

  expect(
    (<Atom>expected.items[1]).value === (<Atom>actual.items[1]).value
  ).toBe(true);

  expect(
    (<Atom>expected.items[2]).value === (<Atom>actual.items[2]).value
  ).toBe(true);

  const b = (<List>expected.items[3]).items;
  const c = (<List>actual.items[3]).items;
  expect(b.length === c.length).toBe(true);

  expect((<Atom>b[0]).value === (<Atom>c[0]).value).toBe(true);

  expect((<Atom>b[1]).value === (<Atom>c[1]).value).toBe(true);

  expect((<Atom>b[2]).value === (<Atom>c[2]).value).toBe(true);
});

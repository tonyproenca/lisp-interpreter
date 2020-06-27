//split the input into caracters
export function toChars(s: string): string[] {
  return Array.from(s);
}

/*
  Atom is the basic unit in Lisp
  it cloud be a number or a symbol
  Union types are handy here
*/
export interface Atom {
  value: number | string;
}

//Technically, it's called a Lexer
export function parseAtom(s: string): Atom {
  s = s.trim();
  if (s === "") throw new Error("Invalid symbol");
  const result = Number(s);
  return isNaN(result) ? <Atom>{ value: s } : <Atom>{ value: result };
}

//List is a sequence of Atoms or Lists
// example: (1 2 (3 4) 5 6)

export interface List {
  items: (Atom | List)[];
}

const listOpenDelimiter = "(";
const listCloseDelimiter = ")";
const listElementDelimiter = " ";

export function parseList(s: string): List {
  if (s.length == 0) throw new Error("Expected a valid string");

  s = s.trim();

  if (s[0] !== "(") throw new Error("Starting ( not found");

  const elements = toChars(s);
  const [l, m] = parseListActual(elements, 0);

  return <List>l.items[0];
}

function parseListActual(elements: string[], i: number): [List, number] {
  let result = <List>{ items: [] };
  let atomStart = -1;
  const addAtom = () => {
    if (atomStart != -1) {
      const term = elements.slice(atomStart, i);
      result.items.push(parseAtom(term.join("")));
    }
  };

  while (i < elements.length) {
    if (elements[i] === listCloseDelimiter) {
      addAtom();
      return [result, i + 1];
    }

    if (elements[i] === listOpenDelimiter) {
      const [r, k] = parseListActual(elements, i + 1);
      i = k;
      result.items.push(r);
    }

    /* 
      find the start of an atom
      If the atom's start had not already
      found and then we discover a non-space, 
      then this is the start of the atom
    */
    if (atomStart == -1 && elements[i] != listElementDelimiter) {
      atomStart = i;
    }

    /*
      find the end of an atom
      if we found a space then
      AddAtom <- only adds if atom was 
      already discovered
    */
    if (elements[i] === listElementDelimiter) {
      //found the whole of the atom
      addAtom();
      atomStart = -1;
    }
    i++;
  }
  return [result, i];
}

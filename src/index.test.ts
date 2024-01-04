import { describe, expect, it } from 'bun:test';
import { is } from 'evaluable';
import { CPF } from './index';

const digits = {
  empty: [],
  semi: [3, 1, 6, 7],
  invalid: [3, 1, 6, 7, 5, 7, 4, 5, 5, 1, 2],
  valid: [3, 1, 6, 7, 5, 7, 4, 5, 5, 0, 1],
};

const cpfs = {
  empty: new CPF(digits.empty),
  semi: new CPF(digits.semi),
  invalid: new CPF(digits.invalid),
  valid: new CPF(digits.valid),
};

describe('constructor tests', () => {
  it('should only use the integer part as digits', () => {
    const cpfA = new CPF([3.5, 1.0, 6.15, 7, 5.9, 7, 4, 5.5, 5, 1, 2.1]);
    const cpfB = new CPF([3.2, 1.1, 6.5, 7.14, 5, 7, 4, 5, 5.5, 1.0, 2.05]);
    expect(cpfA.equals(cpfB)).toBeTrue();
  });
  it('should only use the unit part as digits', () => {
    const a = [13.5, 11.0, 26, 77, 105, NaN, 7, 4, 5.5, 55, Infinity, 1, 2.1];
    const b = [3.2, 1.1, 6.5, 7, 5, Infinity, 7, 4, 45, 5.5, NaN, 11.0, 2.05];
    const cpfA = new CPF(a);
    const cpfB = new CPF(b);
    expect(cpfA.equals(cpfB)).toBeTrue();
  });
  it('should only use the first eleven digits', () => {
    const cpfA = new CPF([3, 1, 6, 7, 5, 7, 4, 5, 5, 0, 1, 0, 1, 2]);
    const cpfB = new CPF([3, 1, 6, 7, 5, 7, 4, 5, 5, 0, 1]);
    expect(cpfA.equals(cpfB)).toBeTrue();
  });
  it('returns nil instance for all empty CPFs', () => {
    const cpfA = new CPF([]);
    const cpfB = new CPF();
    expect(cpfA).toBe(CPF.Nil);
    expect(cpfB).toBe(CPF.Nil);
  });
});

describe('"CPF.prototype.equals" tests', () => {
  it('should return true when comparing itself', () => {
    expect(cpfs.empty.equals(cpfs.empty)).toBeTrue();
    expect(cpfs.semi.equals(cpfs.semi)).toBeTrue();
    expect(cpfs.invalid.equals(cpfs.invalid)).toBeTrue();
    expect(cpfs.valid.equals(cpfs.valid)).toBeTrue();
  });

  it('should return empty digits equal to CPF.Nil', () => {
    expect(cpfs.empty.equals(CPF.Nil)).toBeTrue();
    expect(CPF.Nil.equals(cpfs.empty)).toBeTrue();
  });

  it('should return true when having the same digits', () => {
    expect(cpfs.empty.equals(new CPF(digits.empty))).toBeTrue();
    expect(cpfs.semi.equals(new CPF(digits.semi))).toBeTrue();
    expect(cpfs.invalid.equals(new CPF(digits.invalid))).toBeTrue();
    expect(cpfs.valid.equals(new CPF(digits.valid))).toBeTrue();
  });

  it('should return false when not having the same digits', () => {
    expect(cpfs.empty.equals(cpfs.semi)).toBeFalse();
    expect(cpfs.empty.equals(cpfs.invalid)).toBeFalse();
    expect(cpfs.empty.equals(cpfs.valid)).toBeFalse();

    expect(cpfs.semi.equals(cpfs.empty)).toBeFalse();
    expect(cpfs.semi.equals(cpfs.invalid)).toBeFalse();
    expect(cpfs.semi.equals(cpfs.valid)).toBeFalse();

    expect(cpfs.invalid.equals(cpfs.empty)).toBeFalse();
    expect(cpfs.invalid.equals(cpfs.semi)).toBeFalse();
    expect(cpfs.invalid.equals(cpfs.valid)).toBeFalse();

    expect(cpfs.valid.equals(cpfs.empty)).toBeFalse();
    expect(cpfs.valid.equals(cpfs.semi)).toBeFalse();
    expect(cpfs.valid.equals(cpfs.invalid)).toBeFalse();
  });

  it('should be called when used in "is" function', () => {
    expect(is(cpfs.empty, cpfs.empty)).toBeTrue();
    expect(is(cpfs.semi, cpfs.semi)).toBeTrue();
    expect(is(cpfs.invalid, cpfs.invalid)).toBeTrue();
    expect(is(cpfs.valid, cpfs.valid)).toBeTrue();

    expect(is(cpfs.empty, CPF.Nil)).toBeTrue();
    expect(is(CPF.Nil, cpfs.empty)).toBeTrue();

    expect(is(cpfs.empty, new CPF(digits.empty))).toBeTrue();
    expect(is(cpfs.semi, new CPF(digits.semi))).toBeTrue();
    expect(is(cpfs.invalid, new CPF(digits.invalid))).toBeTrue();
    expect(is(cpfs.valid, new CPF(digits.valid))).toBeTrue();

    expect(is(cpfs.empty, cpfs.semi)).toBeFalse();
    expect(is(cpfs.empty, cpfs.invalid)).toBeFalse();
    expect(is(cpfs.empty, cpfs.valid)).toBeFalse();

    expect(is(cpfs.semi, cpfs.empty)).toBeFalse();
    expect(is(cpfs.semi, cpfs.invalid)).toBeFalse();
    expect(is(cpfs.semi, cpfs.valid)).toBeFalse();

    expect(is(cpfs.invalid, cpfs.empty)).toBeFalse();
    expect(is(cpfs.invalid, cpfs.semi)).toBeFalse();
    expect(is(cpfs.invalid, cpfs.valid)).toBeFalse();

    expect(is(cpfs.valid, cpfs.empty)).toBeFalse();
    expect(is(cpfs.valid, cpfs.semi)).toBeFalse();
    expect(is(cpfs.valid, cpfs.invalid)).toBeFalse();
  });
});

describe('"CPF.prototype.hashCode" tests', () => {
  it('should return the same hash for same digits.', () => {
    expect(cpfs.empty.hashCode()).toBe(new CPF(digits.empty).hashCode());
    expect(cpfs.semi.hashCode()).toBe(new CPF(digits.semi).hashCode());
    expect(cpfs.invalid.hashCode()).toBe(new CPF(digits.invalid).hashCode());
    expect(cpfs.valid.hashCode()).toBe(new CPF(digits.valid).hashCode());
  });
});

describe('"CPF.prototype.at" tests', () => {
  it('should return the digit in the given index.', () => {
    expect(cpfs.semi.at(0)).toBe(3);
    expect(cpfs.semi.at(-1)).toBe(7);
    expect(cpfs.invalid.at(1)).toBe(1);
    expect(cpfs.invalid.at(-2)).toBe(1);
    expect(cpfs.valid.at(3)).toBe(7);
    expect(cpfs.valid.at(-3)).toBe(5);
  });
  it('should return undefined in the given index.', () => {
    expect(cpfs.empty.at(0)).toBeUndefined();
    expect(cpfs.empty.at(-1)).toBeUndefined();
    expect(cpfs.semi.at(5)).toBeUndefined();
    expect(cpfs.semi.at(-5)).toBeUndefined();
    expect(cpfs.invalid.at(11)).toBeUndefined();
    expect(cpfs.invalid.at(-12)).toBeUndefined();
    expect(cpfs.valid.at(11)).toBeUndefined();
    expect(cpfs.valid.at(-12)).toBeUndefined();
  });
});

describe('"CPF.prototype.with" tests', () => {
  it('should return a new CPF with the value in the given index.', () => {
    const cpfA = new CPF([3, 1, 6, 7, 5, 7, 4, 5, 5, 0, 0]);
    expect(cpfA.with(10, 1).equals(cpfs.valid)).toBeTrue();
    expect(cpfA.with(-1, 1).equals(cpfs.valid)).toBeTrue();
  });
  it('should return the same CPF if no change is made.', () => {
    expect(cpfs.valid.with(10, 1)).toBe(cpfs.valid);
    expect(cpfs.valid.with(-1, 1.5)).toBe(cpfs.valid);
  });
  it('should throw an `RangeError` on out-of-bounds index.', () => {
    expect(() => cpfs.empty.with(0, 1)).toThrow(RangeError);
    expect(() => cpfs.valid.with(11, 0)).toThrow(RangeError);
    expect(() => cpfs.valid.with(-12, 1)).toThrow(RangeError);
  });
});

describe('"CPF.prototype.toString" tests', () => {
  it('should return an string representation.', () => {
    expect(cpfs.empty.toString()).toBe('[CPF: ]');
    expect(cpfs.semi.toString()).toBe('[CPF: 316.7]');
    expect(cpfs.invalid.toString()).toBe('[CPF: 316.757.455-12]');
    expect(cpfs.valid.toString()).toBe('[CPF: 316.757.455-01]');
  });
});

describe('"CPF.prototype.toJSON" tests', () => {
  it('should return an JSON representation.', () => {
    expect(cpfs.empty.toJSON()).toBe('');
    expect(cpfs.semi.toJSON()).toBe('3167');
    expect(cpfs.invalid.toJSON()).toBe('31675745512');
    expect(cpfs.valid.toJSON()).toBe('31675745501');
  });
  it('should override the JSON.stringify behavior.', () => {
    expect(JSON.stringify(cpfs.empty)).toBe('""');
    expect(JSON.stringify(cpfs.semi)).toBe('"3167"');
    expect(JSON.stringify(cpfs.invalid)).toBe('"31675745512"');
    expect(JSON.stringify(cpfs.valid)).toBe('"31675745501"');
  });
});

describe('"CPF.prototype.toArray" tests', () => {
  it('should return an array with digits.', () => {
    expect(cpfs.empty.toArray()).toEqual(digits.empty);
    expect(cpfs.semi.toArray()).toEqual(digits.semi);
    expect(cpfs.invalid.toArray()).toEqual(digits.invalid);
    expect(cpfs.valid.toArray()).toEqual(digits.valid);
  });
});

describe('"CPF.prototype.getValidity" tests', () => {
  const validities = {
    empty: cpfs.empty.getValidity(),
    semi: cpfs.semi.getValidity(),
    invalid: cpfs.invalid.getValidity(),
    valid: cpfs.valid.getValidity(),
  };

  it('should return true valueMissing for empty CPFs.', () => {
    expect(validities.empty.valueMissing).toBeTrue();
    expect(validities.semi.valueMissing).toBeFalse();
    expect(validities.invalid.valueMissing).toBeFalse();
    expect(validities.valid.valueMissing).toBeFalse();
  });
  it('should return true tooShort for CPFs with digits between zero and eleven.', () => {
    expect(validities.empty.tooShort).toBeFalse();
    expect(validities.semi.tooShort).toBeTrue();
    expect(validities.invalid.tooShort).toBeFalse();
    expect(validities.valid.tooShort).toBeFalse();
  });
  it('should return true typeMismatch for CPFs with eleven digits but invalid check digits.', () => {
    expect(validities.empty.typeMismatch).toBeFalse();
    expect(validities.semi.typeMismatch).toBeFalse();
    expect(validities.invalid.typeMismatch).toBeTrue();
    expect(validities.valid.typeMismatch).toBeFalse();
  });
});

describe('"CPF.prototype.checkValidity" tests', () => {
  it('should return false for CPFs with invalid digits.', () => {
    expect(cpfs.empty.checkValidity()).toBeFalse();
    expect(cpfs.semi.checkValidity()).toBeFalse();
    expect(cpfs.invalid.checkValidity()).toBeFalse();
  });
  it('should return false for CPFs with same digits.', () => {
    for (let index = 0; index < 10; index++) {
      const digits = new Array(11).fill(index);
      expect(new CPF(digits).checkValidity()).toBeFalse();
    }
  });
  it('should return true for CPFs with valid digits.', () => {
    expect(cpfs.valid.checkValidity()).toBeTrue();
  });
});

describe('"CPF.prototype.format" tests', () => {
  it('should return an formatted string.', () => {
    expect(cpfs.empty.format()).toBe('');
    expect(cpfs.semi.format()).toBe('316.7');
    expect(cpfs.invalid.format()).toBe('316.757.455-12');
    expect(cpfs.valid.format()).toBe('316.757.455-01');
  });
});

describe('"CPF.prototype.length" tests', () => {
  it('should return the number of digits in the CPF.', () => {
    expect(cpfs.empty.length).toBe(0);
    expect(cpfs.semi.length).toBe(4);
    expect(cpfs.invalid.length).toBe(11);
    expect(cpfs.valid.length).toBe(11);
  });
});

describe('"CPF.prototype.size" tests', () => {
  it('should return the number of digits in the CPF.', () => {
    expect(cpfs.empty.size).toBe(0);
    expect(cpfs.semi.size).toBe(4);
    expect(cpfs.invalid.size).toBe(11);
    expect(cpfs.valid.size).toBe(11);
  });
});

describe('"CPF.prototype[Symbol.iterator]" tests', () => {
  it('should return an interator with the digits in the CPF.', () => {
    const tests: (keyof typeof cpfs)[] = ['empty', 'invalid', 'semi', 'valid'];
    for (const test of tests) {
      let index = 0;
      for (const digit of cpfs[test]) {
        // @ts-expect-error index is already checked.
        expect(digit).toBe(digits[test][index]);
        index += 1;
      }
    }
  });
});

describe('"CPF.Nil" tests', () => {
  it('should have no digits.', () => {
    expect(CPF.Nil.length).toBe(0);
  });
  it('should have an empty string representation.', () => {
    expect(CPF.Nil.toString()).toBe('[CPF: ]');
  });
  it('should have an empty JSON representation.', () => {
    expect(CPF.Nil.toJSON()).toBe('');
  });
  it('should have an empty array representation.', () => {
    expect(CPF.Nil.toArray()).toEqual([]);
  });
  it('should not be valid.', () => {
    expect(CPF.Nil.checkValidity()).toBeFalse();
  });
  it('should have an empty formatted string representation.', () => {
    expect(CPF.Nil.format()).toBe('');
  });
});

describe('"CPF.from" tests', () => {
  it('should return a nil instance with empty strings.', () => {
    expect(CPF.from('').equals(CPF.Nil)).toBeTrue();
  });
  it('should return nil instance with strings with no decimal numbers.', () => {
    expect(CPF.from('aaa').equals(CPF.Nil)).toBeTrue();
    expect(CPF.from('a long string').equals(CPF.Nil)).toBeTrue();
    expect(CPF.from('\u2014').equals(CPF.Nil)).toBeTrue();
  });
  it('should return incomplete instance with strings with some decimal numbers.', () => {
    expect(CPF.from('3167').equals(cpfs.semi)).toBeTrue();
    expect(CPF.from('3, 1, 6, 7').equals(cpfs.semi)).toBeTrue();
    expect(CPF.from('31 ab6\u2014 7').equals(cpfs.semi)).toBeTrue();
  });
  it('should return invalid instance with strings with at least 11 decimal numbers.', () => {
    expect(CPF.from('31675745512').equals(cpfs.invalid)).toBeTrue();
    expect(CPF.from('3167574551200').equals(cpfs.invalid)).toBeTrue();
    expect(CPF.from('316.757.455-12').equals(cpfs.invalid)).toBeTrue();
    expect(CPF.from('316a757\u2014455z12').equals(cpfs.invalid)).toBeTrue();
    expect(CPF.from('316a757\u2014455z1200').equals(cpfs.invalid)).toBeTrue();
  });
  it('should return valid instance with strings with at least 11 decimal numbers.', () => {
    expect(CPF.from('31675745501').equals(cpfs.valid)).toBeTrue();
    expect(CPF.from('3167574550100').equals(cpfs.valid)).toBeTrue();
    expect(CPF.from('316.757.455-01').equals(cpfs.valid)).toBeTrue();
    expect(CPF.from('316a757\u2014455z01').equals(cpfs.valid)).toBeTrue();
    expect(CPF.from('316a757\u2014455z0100').equals(cpfs.valid)).toBeTrue();
  });
});

describe('"CPF.create" tests', () => {
  it('should create valid CPFs', () => {
    for (let index = 0; index < 100; index++) {
      const cpf = CPF.create();
      expect(cpf.checkValidity()).toBeTrue();
    }
  });
});

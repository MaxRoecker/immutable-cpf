import { expect } from '@esm-bundle/chai';
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
    expect(cpfA.equals(cpfB));
  });
  it('should only use the unit part as digits', () => {
    const cpfA = new CPF([13.5, 11.0, 26, 77, 105, 7, 4, 5.5, 55, 1, 2.1]);
    const cpfB = new CPF([3.2, 1.1, 6.5, 7, 5, 7, 4, 45, 5.5, 11.0, 2.05]);
    expect(cpfA.equals(cpfB));
  });
});

describe('"CPF.prototype.equals" tests', () => {
  it('should return true when comparing itself', () => {
    expect(cpfs.empty.equals(cpfs.empty)).equal(true);
    expect(cpfs.semi.equals(cpfs.semi)).equal(true);
    expect(cpfs.invalid.equals(cpfs.invalid)).equal(true);
    expect(cpfs.valid.equals(cpfs.valid)).equal(true);
  });

  it('should return empty digits equal to CPF.Nil', () => {
    expect(cpfs.empty.equals(CPF.Nil)).equal(true);
    expect(CPF.Nil.equals(cpfs.empty)).equal(true);
  });

  it('should return true when having the same digits', () => {
    expect(cpfs.empty.equals(new CPF(digits.empty))).equal(true);
    expect(cpfs.semi.equals(new CPF(digits.semi))).equal(true);
    expect(cpfs.invalid.equals(new CPF(digits.invalid))).equal(true);
    expect(cpfs.valid.equals(new CPF(digits.valid))).equal(true);
  });

  it('should return false when not having the same digits', () => {
    expect(cpfs.empty.equals(cpfs.semi)).equal(false);
    expect(cpfs.empty.equals(cpfs.invalid)).equal(false);
    expect(cpfs.empty.equals(cpfs.valid)).equal(false);

    expect(cpfs.semi.equals(cpfs.empty)).equal(false);
    expect(cpfs.semi.equals(cpfs.invalid)).equal(false);
    expect(cpfs.semi.equals(cpfs.valid)).equal(false);

    expect(cpfs.invalid.equals(cpfs.empty)).equal(false);
    expect(cpfs.invalid.equals(cpfs.semi)).equal(false);
    expect(cpfs.invalid.equals(cpfs.valid)).equal(false);

    expect(cpfs.valid.equals(cpfs.empty)).equal(false);
    expect(cpfs.valid.equals(cpfs.semi)).equal(false);
    expect(cpfs.valid.equals(cpfs.invalid)).equal(false);
  });

  it('should be called when used in "is" function', () => {
    expect(is(cpfs.empty, cpfs.empty)).equal(true);
    expect(is(cpfs.semi, cpfs.semi)).equal(true);
    expect(is(cpfs.invalid, cpfs.invalid)).equal(true);
    expect(is(cpfs.valid, cpfs.valid)).equal(true);

    expect(is(cpfs.empty, CPF.Nil)).equal(true);
    expect(is(CPF.Nil, cpfs.empty)).equal(true);

    expect(is(cpfs.empty, new CPF(digits.empty))).equal(true);
    expect(is(cpfs.semi, new CPF(digits.semi))).equal(true);
    expect(is(cpfs.invalid, new CPF(digits.invalid))).equal(true);
    expect(is(cpfs.valid, new CPF(digits.valid))).equal(true);

    expect(is(cpfs.empty, cpfs.semi)).equal(false);
    expect(is(cpfs.empty, cpfs.invalid)).equal(false);
    expect(is(cpfs.empty, cpfs.valid)).equal(false);

    expect(is(cpfs.semi, cpfs.empty)).equal(false);
    expect(is(cpfs.semi, cpfs.invalid)).equal(false);
    expect(is(cpfs.semi, cpfs.valid)).equal(false);

    expect(is(cpfs.invalid, cpfs.empty)).equal(false);
    expect(is(cpfs.invalid, cpfs.semi)).equal(false);
    expect(is(cpfs.invalid, cpfs.valid)).equal(false);

    expect(is(cpfs.valid, cpfs.empty)).equal(false);
    expect(is(cpfs.valid, cpfs.semi)).equal(false);
    expect(is(cpfs.valid, cpfs.invalid)).equal(false);
  });
});

describe('"CPF.prototype.hashCode" tests', () => {
  it('should return the same hash for same digits.', () => {
    expect(cpfs.empty.hashCode()).equal(new CPF(digits.empty).hashCode());
    expect(cpfs.semi.hashCode()).equal(new CPF(digits.semi).hashCode());
    expect(cpfs.invalid.hashCode()).equal(new CPF(digits.invalid).hashCode());
    expect(cpfs.valid.hashCode()).equal(new CPF(digits.valid).hashCode());
  });
});

describe('"CPF.prototype.toString" tests', () => {
  it('should return an string representation.', () => {
    expect(cpfs.empty.toString()).equal('[CPF: ]');
    expect(cpfs.semi.toString()).equal('[CPF: 316.7]');
    expect(cpfs.invalid.toString()).equal('[CPF: 316.757.455-12]');
    expect(cpfs.valid.toString()).equal('[CPF: 316.757.455-01]');
  });
});

describe('"CPF.prototype.toJSON" tests', () => {
  it('should return an JSON representation.', () => {
    expect(cpfs.empty.toJSON()).equal('');
    expect(cpfs.semi.toJSON()).equal('3167');
    expect(cpfs.invalid.toJSON()).equal('31675745512');
    expect(cpfs.valid.toJSON()).equal('31675745501');
  });
  it('should override the JSON.stringify behavior.', () => {
    expect(JSON.stringify(cpfs.empty)).equal('""');
    expect(JSON.stringify(cpfs.semi)).equal('"3167"');
    expect(JSON.stringify(cpfs.invalid)).equal('"31675745512"');
    expect(JSON.stringify(cpfs.valid)).equal('"31675745501"');
  });
});

describe('"CPF.prototype.toArray" tests', () => {
  it('should return an array with digits.', () => {
    expect(cpfs.empty.toArray()).deep.equal(digits.empty);
    expect(cpfs.semi.toArray()).deep.equal(digits.semi);
    expect(cpfs.invalid.toArray()).deep.equal(digits.invalid);
    expect(cpfs.valid.toArray()).deep.equal(digits.valid);
  });
});

describe('"CPF.prototype.checkValidity" tests', () => {
  it('should return false for CPFs with invalid digits.', () => {
    expect(cpfs.empty.checkValidity()).equal(false);
    expect(cpfs.semi.checkValidity()).equal(false);
    expect(cpfs.invalid.checkValidity()).equal(false);
  });
  it('should return false for CPFs with same digits.', () => {
    for (let index = 0; index < 10; index++) {
      const digits = new Array(11).fill(index);
      expect(new CPF(digits).checkValidity()).equal(false);
    }
  });
  it('should return true for CPFs with valid digits.', () => {
    expect(cpfs.valid.checkValidity()).equal(true);
  });
});

describe('"CPF.prototype.format" tests', () => {
  it('should return an formatted string.', () => {
    expect(cpfs.empty.format()).equal('');
    expect(cpfs.semi.format()).equal('316.7');
    expect(cpfs.invalid.format()).equal('316.757.455-12');
    expect(cpfs.valid.format()).equal('316.757.455-01');
  });
});

describe('"CPF.Nil" tests', () => {
  it('should be equals to a nil instance.', () => {
    expect(CPF.Nil.equals(CPF.Nil)).equal(true);
    expect(CPF.Nil.equals(cpfs.empty)).equal(true);
  });
  it('should have hash code equals to zero.', () => {
    expect(CPF.Nil.hashCode()).equal(0);
  });
  it('should have an empty string representation.', () => {
    expect(CPF.Nil.toString()).equal('[CPF: ]');
  });
  it('should have an empty JSON representation.', () => {
    expect(CPF.Nil.toJSON()).equal('');
  });
  it('should have an empty array representation.', () => {
    expect(CPF.Nil.toArray()).deep.equal([]);
  });
  it('should not be valid.', () => {
    expect(CPF.Nil.checkValidity()).equal(false);
  });
  it('should have an empty formatted string representation.', () => {
    expect(CPF.Nil.format()).equal('');
  });
});

describe('"CPF.from" tests', () => {
  it('should return a nil instance with empty strings.', () => {
    expect(CPF.from('').equals(CPF.Nil)).equal(true);
  });
  it('should return nil instance with strings with no decimal numbers.', () => {
    expect(CPF.from('aaa').equals(CPF.Nil)).equal(true);
    expect(CPF.from('a long string').equals(CPF.Nil)).equal(true);
    expect(CPF.from('\u2014').equals(CPF.Nil)).equal(true);
  });
  it('should return incomplete instance with strings with some decimal numbers.', () => {
    expect(CPF.from('3167').equals(cpfs.semi)).equal(true);
    expect(CPF.from('3, 1, 6, 7').equals(cpfs.semi)).equal(true);
    expect(CPF.from('31 ab6\u2014 7').equals(cpfs.semi)).equal(true);
  });
  it('should return invalid instance with strings with at least 11 decimal numbers.', () => {
    expect(CPF.from('31675745512').equals(cpfs.invalid)).equal(true);
    expect(CPF.from('3167574551200').equals(cpfs.invalid)).equal(true);
    expect(CPF.from('316.757.455-12').equals(cpfs.invalid)).equal(true);
    expect(CPF.from('316a757\u2014455z12').equals(cpfs.invalid)).equal(true);
    expect(CPF.from('316a757\u2014455z1200').equals(cpfs.invalid)).equal(true);
  });
  it('should return valid instance with strings with at least 11 decimal numbers.', () => {
    expect(CPF.from('31675745501').equals(cpfs.valid)).equal(true);
    expect(CPF.from('3167574550100').equals(cpfs.valid)).equal(true);
    expect(CPF.from('316.757.455-01').equals(cpfs.valid)).equal(true);
    expect(CPF.from('316a757\u2014455z01').equals(cpfs.valid)).equal(true);
    expect(CPF.from('316a757\u2014455z0100').equals(cpfs.valid)).equal(true);
  });
});

describe('"CPF.create" tests', () => {
  it('should create valid CPFs', () => {
    for (let index = 0; index < 100; index++) {
      const cpf = CPF.create();
      expect(cpf.checkValidity()).equal(true);
    }
  });
});

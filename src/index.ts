import { type Evaluable } from 'evaluable';
import { getSeed, hashSequence } from 'cruxhash';

/**
 * An immutable class to represent CPF documents.
 */
export class CPF implements Evaluable {
  #digits: Array<number> = [];
  #hashCode: number | null = null;

  /**
   * Creates a new immutable instance of CPF.
   */
  constructor(numbers: Iterable<number> = []) {
    for (const value of numbers) {
      const digit = Math.trunc(value) % 10;
      if (Number.isNaN(digit) || digit < 0 || digit > 9) continue;
      this.#digits.push(digit);
      if (this.#digits.length === 11) break;
    }
    if (this.#digits.length === 0) return CPF.Nil;
  }

  /**
   * The number of digits in the CPF.
   */
  get length(): number {
    return this.#digits.length;
  }

  /**
   * The number of digits in the CPF.
   * @deprecated Use `length` property instead
   * @see {length}
   */
  get size(): number {
    return this.#digits.length;
  }

  /**
   * Returns the digit located at the specified index. Negative integers count
   * back from the last digit in the current CPF.
   */
  at(index: number): number | undefined {
    return this.#digits.at(index);
  }

  /**
   * Returns a copy of the CPF with the digit at the provided index overwritten
   * with the given value. If the index is negative, then it replaces from the
   * end of the array. If the index after normalization is out of bounds,
   * a `RangeError` is thrown.
   */
  with(index: number, digit: number): CPF {
    const current = Math.trunc(digit) % 10;
    const previous = this.#digits.at(index);
    if (previous === current) return this;
    const digits = this.#digits.with(index, current);
    return new CPF(digits);
  }

  /**
   * Returns`true` if the given value is equal to this CPF, `false` otherwise.
   * Two CPFs are equal if they have the same sequence of digits.
   */
  equals(other: unknown): boolean {
    return (
      this === other ||
      (other != null &&
        other instanceof CPF &&
        this.hashCode() === other.hashCode() &&
        this.#digits.length === other.#digits.length &&
        this.#digits.every((digit, index) => other.#digits[index] === digit))
    );
  }

  hashCode(): number {
    if (this.#hashCode == null) {
      this.#hashCode = hashSequence(this.#digits, CPF.#seed);
    }
    return this.#hashCode;
  }

  /**
   * Returns an object that represents the state of validity of the CPF.
   *
   * @see {CPFValidityStateFlags}
   */
  getValidity(): CPFValidityStateFlags {
    const valueMissing = this.#digits.length === 0;

    const tooShort = this.#digits.length > 0 && this.#digits.length < 11;

    const typeMismatch =
      this.#digits.length === 11 &&
      (this.#digits.every((digit) => digit === this.#digits[0]) ||
        CPF.getCheckDigit(this.#digits, 0, 9) !== this.#digits[9] ||
        CPF.getCheckDigit(this.#digits, 0, 10) !== this.#digits[10]);

    return { valueMissing, tooShort, typeMismatch };
  }

  /**
   * Returns `true` if the CPF is valid, `false` otherwise. A CPF is valid if
   * they have 11 digits and the two last digits satisfies the
   * [validation algorithm][CPF].
   *
   * [CPF]: https://pt.wikipedia.org/wiki/Cadastro_de_pessoas_f%C3%ADsicas#D%C3%ADgitos_verificadores
   */
  checkValidity(): boolean {
    const { valueMissing, tooShort, typeMismatch } = this.getValidity();
    return !(valueMissing || tooShort || typeMismatch);
  }

  /**
   * Formats the CPF in the standard pattern "###.###.###-##".
   */
  format(): string {
    let output = this.#digits.slice(0, 3).join('');
    if (this.#digits.length < 3) return output;
    output = output + '.' + this.#digits.slice(3, 6).join('');
    if (this.#digits.length < 6) return output;
    output = output + '.' + this.#digits.slice(6, 9).join('');
    if (this.#digits.length < 9) return output;
    output = output + '-' + this.#digits.slice(9, 11).join('');
    return output;
  }

  /**
   * Returns a string representation of an object.
   */
  toString(): string {
    return `[CPF: ${this.format()}]`;
  }

  /**
   * Serializes the digits of the CPF into JSON string.
   */
  toJSON(): string {
    return this.#digits.join('');
  }

  /**
   * Returns the CPF digits in an array.
   */
  toArray(): Array<number> {
    return Array.from(this.#digits);
  }

  /**
   * Iterates over the digits of the CPF.
   */
  *[Symbol.iterator](): Generator<number, void, void> {
    for (const digit of this.#digits) {
      yield digit;
    }
  }

  static #seed: number = getSeed('CPF');

  /**
   * An empty instance of CPF.
   */
  static readonly Nil = new CPF([]);

  /**
   * Creates a CPF instance from an string. The string can be formatted or not.
   * If not enough digits are found on the string, an incomplete CPF will be
   * returned.
   */
  static from(formatted: string): CPF {
    const stripped = formatted.normalize('NFD').replace(/\D/g, '');
    if (stripped.length === 0) return CPF.Nil;
    const chars = stripped.substring(0, 11);
    const digits = Array.from(chars, (c) => Number.parseInt(c, 10) % 10);
    return new CPF(digits);
  }

  /**
   * Creates new valid CPF instance of random numbers.
   */
  static create(): CPF {
    const length = 9;
    const digits = Array.from({ length }, () => Math.trunc(Math.random() * 10));
    digits.push(CPF.getCheckDigit(digits));
    digits.push(CPF.getCheckDigit(digits));
    return new CPF(digits);
  }

  /**
   * Returns the CPF check digit from interval of the given digits.
   */
  static getCheckDigit(
    digits: Readonly<Array<number>>,
    start = 0,
    end = digits.length,
  ): number {
    let acc = 0;
    for (let index = start; index < end; index = index + 1) {
      acc = acc + digits[index] * (end + 1 - index);
    }
    const rem = acc % 11;
    return rem < 2 ? 0 : 11 - rem;
  }
}

/**
 * Represents the state of validity of the CPF.
 */
export type CPFValidityStateFlags = {
  /**
   * Flagged as `true` if the count of CPF digits is zero.
   */
  valueMissing: boolean;

  /**
   * Flagged as `true` if the count of CPF digits between, inclusively, one and
   * ten.
   */
  tooShort: boolean;

  /**
   * Flagged as `true` if the number of digits is eleven but the
   * [check digit algorithm][CPF] fails.
   *
   * [CPF]: https://pt.wikipedia.org/wiki/Cadastro_de_pessoas_f%C3%ADsicas#D%C3%ADgitos_verificadores
   */
  typeMismatch: boolean;
};

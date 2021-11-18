import type { Evaluable } from 'evaluable';
import { hashIterable } from 'cruxhash';

/**
 * An immutable class to represent CPF documents.
 */
export class CPF implements Evaluable {
  private readonly digits: number[];
  private readonly hash: number;

  /**
   * Creates a new immutable instance of CPF.
   *
   * @param digits The digits of the CPF
   */
  constructor(digits: Iterable<number>) {
    const numbers = Array.from(digits).slice(0, 11);
    this.digits = numbers.map((n) => Math.trunc(n) % 10);
    this.hash = hashIterable(this.digits);
  }

  equals(other: unknown): boolean {
    return (
      this === other ||
      (other != null &&
        other instanceof CPF &&
        this.hash === other.hash &&
        this.digits.length === other.digits.length &&
        this.digits.every((digit, index) => other.digits[index] === digit))
    );
  }

  hashCode(): number {
    return this.hash;
  }

  /**
   * @returns a string representation of an object.
   */
  toString(): string {
    return `[CPF: ${this.format()}]`;
  }

  /**
   * Serializes the CPF into JSON. Returns a string with all the digits of the
   * CPF.
   *
   * @returns an string with the digits.
   */
  toJSON(): string {
    return this.digits.join('');
  }

  /**
   * Returns the CPF digits in an array.
   *
   * @returns a new array witht the digits.
   */
  toArray(): number[] {
    return Array.from(this.digits);
  }

  /**
   * Returns an object that represents the state of validity of the CPF, with
   * the following properties:
   * - `valueMissing`: true if the count of CPF digits is zero;
   * - `tooShort`: true if the count of CPF digits between, inclusively, one
   *   and ten;
   * - `typeMismatch`: true if the number of digits is eleven but the checkdigit
   *   algorithm fails.
   *
   * @returns the validity state of the CPF.
   */
  getValidity(): {
    valueMissing: boolean;
    tooShort: boolean;
    typeMismatch: boolean;
  } {
    const valueMissing = this.digits.length === 0;

    const tooShort = this.digits.length > 0 && this.digits.length < 11;

    const typeMismatch =
      this.digits.length === 11 &&
      (this.digits.every((digit) => digit === this.digits[0]) ||
        CPF.digit(this.digits.slice(0, 9)) !== this.digits[9] ||
        CPF.digit(this.digits.slice(0, 10)) !== this.digits[10]);

    return { valueMissing, tooShort, typeMismatch };
  }

  /**
   * Check if the CPF is valid. A CPF is valid if they have 11 digits and
   * the two last digits satisfies the [validation algorithm][CPF].
   *
   * [CPF]: https://pt.wikipedia.org/wiki/Cadastro_de_pessoas_f%C3%ADsicas#D%C3%ADgitos_verificadores
   *
   * @returns `true` if the CPF is valid, `false` otherwise.
   */
  checkValidity(): boolean {
    const { valueMissing, tooShort, typeMismatch } = this.getValidity();
    return !(valueMissing || tooShort || typeMismatch);
  }

  /**
   * Formats the CPF in the standard pattern "###.###.###-##".
   *
   * @returns a formatted string.
   */
  format(): string {
    let output = this.digits.slice(0, 3).join('');
    if (this.digits.length < 3) return output;
    output = output + '.' + this.digits.slice(3, 6).join('');
    if (this.digits.length < 6) return output;
    output = output + '.' + this.digits.slice(6, 9).join('');
    if (this.digits.length < 9) return output;
    output = output + '-' + this.digits.slice(9, 11).join('');
    return output;
  }

  /**
   * The number of digits in the CPF.
   */
  get size(): number {
    return this.digits.length;
  }

  *[Symbol.iterator](): Generator<number, void, void> {
    for (const digit of this.digits) {
      yield digit;
    }
  }

  /**
   * An empty instance of CPF.
   */
  static readonly Nil = new CPF([]);

  /**
   * Creates a CPF instance from an string. The string can be formatted or not.
   * If not enough digits are found on the string, an incomplete CPF will be
   * returned.
   *
   * @returns a CPF instance.
   */
  static from(formatted: string): CPF {
    const stripped = formatted.replace(/\D/g, '').normalize('NFD');
    const digits = Array.from(stripped).map((d) => Number.parseInt(d, 10));
    return new CPF(digits);
  }

  /**
   * Creates new valid CPF instance of random numbers.
   *
   * @returns a CPF instance.
   */
  static create(): CPF {
    const digits = Array.from({ length: 9 }, () => {
      return Math.round(Math.random() * 9);
    });
    digits.push(CPF.digit(digits));
    digits.push(CPF.digit(digits));
    return new CPF(digits);
  }

  /**
   * Returns the CPF check digit from the given digits.
   *
   * @returns the check digit.
   */
  private static digit(digits: number[]): number {
    let acc = 0;
    let i = 0;
    while (i < digits.length) {
      acc = acc + digits[i] * (digits.length + 1 - i);
      i = i + 1;
    }
    const rem = acc % 11;
    return rem < 2 ? 0 : 11 - rem;
  }
}

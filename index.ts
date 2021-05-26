import type { Evaluable } from 'evaluable';
import { hashIterable } from 'cruxhash';

export class CPF implements Evaluable {
  private readonly digits: number[];
  private readonly hash: number;

  constructor(digits: Iterable<number>) {
    const numbers = Array.from(digits).slice(0, 11);
    this.digits = numbers.map((n) => Math.round(n) % 10);
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

  toString(): string {
    return `[CPF: ${this.format()}]`;
  }

  /**
   * Serializes the CPF into JSON.
   */
  toJSON(): string {
    return this.digits.join('');
  }

  /**
   * Returns the CPF digits in an array.
   */
  toArray(): number[] {
    return Array.from(this.digits);
  }

  /**
   * Check if the CPF is valid.
   */
  checkValidity(): boolean {
    if (this.digits.length !== 11) return false;
    if (this.digits.every((digit) => digit === this.digits[0])) return false;
    if (CPF.digit(this.digits.slice(0, 9)) !== this.digits[9]) return false;
    if (CPF.digit(this.digits.slice(0, 10)) !== this.digits[10]) return false;
    return true;
  }

  /**
   * Returns a formatted version of the CPF digits.
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
   * An empty instance of CPF.
   */
  static readonly Nil = new CPF([]);

  /**
   * Creates a CPF instance from an string.
   */
  static from(formatted: string): CPF {
    const stripped = formatted.replace(/\D/g, '').normalize('NFD');
    const digits = Array.from(stripped).map((d) => Number.parseInt(d, 10));
    return new CPF(digits);
  }

  /**
   * Creates a valid CPF instance of random numbers.
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

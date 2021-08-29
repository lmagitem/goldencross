/** A key-value pair object that has a toString() method. */
export class StringableKeyValuePair<T> {
  /** Returns a string to display to represent this pair's value. */
  private _toString: (data: T) => string;

  constructor(
    /** The key of this key-value pair. */
    public key: any,
    /** The value of this key-value pair. */
    public data: T,
    /** Returns a string to display to represent this pair's value. */
    toString: (data: T) => string = (d) => d + ''
  ) {
    this._toString = toString;
  }

  /** Returns a string to display to represent this pair's value. */
  public toString(): string {
    return this._toString(this.data);
  }
}

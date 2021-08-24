/** Helper functions regarding objects in general. */
export class ObjectUtils {
  /** Returns the content found following a given path for a given object.
   *  @example resolveProperty('adress.city', person) would return the city of the adress of the given person. */
  public static resolveProperty(path: string, obj: any) {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : undefined;
    }, obj || self);
  }

  /** Simple function to compare two strings or numbers. */
  public static compare(v1: string | number, v2: string | number) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }
}

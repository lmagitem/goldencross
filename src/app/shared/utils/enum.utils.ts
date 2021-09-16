import { StringUtils } from './string.utils';

/** Helper functions regarding enums. */
export class EnumUtils {
  /** Returns the key of an enum corresponding to a given value. */
  public static getEnumKeyByEnumValue<T extends { [index: string]: string }>(
    myEnum: T,
    enumValue: string
  ): keyof T | null {
    let keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : null;
  }

  /** Returns a somewhat readable string from an enum value. */
  public static enumToString(o: any): string {
    const s = (
      StringUtils.replaceAll(o + '', '_', ' ') as string
    ).toLowerCase();
    return s.charAt(0).toUpperCase() + s.substring(1);
  }
}

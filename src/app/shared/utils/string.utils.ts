/** Helper functions for anything string related. */
export class StringUtils {
  /** Returns the list of occurences of a regex in the given string.
   *  @param regex The regex used to test the string.
   *  @param string The string to process. */
  public static findMatches(regex: RegExp, string: string): string[] {
    const matches = StringUtils.doFindMatches(
      new RegExp(regex.source, regex.flags.replace('g', '')),
      string,
      []
    );
    const result: string[] = [];
    for (const match of matches) {
      result.push(match[0]);
    }

    return result;
  }

  /** Returns the list of occurences of a regex in the given string, with infos about their placement and stuff.
   *  @param regex The regex used to test the string.
   *  @param string The string to process.
   *  @param matches The occurences already found. */
  public static doFindMatches(
    regex: RegExp,
    string: string,
    matches: any[] = []
  ) {
    if (regex.test(string)) {
      const res = regex.exec(string);
      if (!!res) {
        matches.push(res);
        string = string.replace(regex, '');
        StringUtils.doFindMatches(regex, string, matches);
      }
    }
    return matches;
  }

  /** Replaces every occurence that was marked "toReplace" by what's marked "toInsertInstead" in the given string. */
  public static replaceAll(string: any, toReplace: any, toInsertInstead: any) {
    if (
      string !== undefined &&
      string !== null &&
      toReplace !== undefined &&
      toReplace !== null &&
      toInsertInstead !== undefined &&
      toInsertInstead !== null &&
      typeof string === 'string'
    ) {
      string = string + '';
      toReplace = toReplace + '';
      toInsertInstead = toInsertInstead + '';

      let i = -1;
      while (
        // tslint:disable-next-line: no-conditional-assignment
        (i = string
          .toLowerCase()
          .indexOf(toReplace, i >= 0 ? i + toInsertInstead.length : 0)) !== -1
      ) {
        string =
          string.substring(0, i) +
          toInsertInstead +
          string.substring(i + toReplace.length);
      }
    }

    return string;
  }
}

import { StringUtils } from './string.utils';

describe('StringUtils', () => {
  it(`.findMatches should return expected returns when given a proper string`, () => {
    expect(
      StringUtils.findMatches(
        new RegExp('is'),
        'This is a sentence. And this is another one.'
      )
    ).toContain('is');
    expect(
      StringUtils.findMatches(
        new RegExp('is'),
        'This is a sentence. And this is another one.'
      )
    ).toContain('is');
    expect(
      StringUtils.findMatches(
        new RegExp('is', 'g'),
        'This is a sentence. And this is another one.'
      ).length === 4
    ).toBe(true);
    expect(StringUtils.findMatches(/\$\d*/, '$10+$88+2/$186')).toContain('$10');
    expect(StringUtils.findMatches(/\$\d*/, '$10+$88+2/$186')).toContain('$88');
    expect(StringUtils.findMatches(/\$\d*/, '$10+$88+2/$186')).not.toContain(
      '2'
    );
    expect(StringUtils.findMatches(/\$\d*/, '$10+$88+2/$186')).toContain(
      '$186'
    );
    expect(StringUtils.findMatches(/\$\d*/g, '$10+$88+2/$186')).toContain(
      '$10'
    );
    expect(StringUtils.findMatches(/\$\d*/g, '$10+$88+2/$186')).toContain(
      '$88'
    );
    expect(StringUtils.findMatches(/\$\d*/g, '$10+$88+2/$186')).not.toContain(
      '2'
    );
    expect(StringUtils.findMatches(/\$\d*/g, '$10+$88+2/$186')).toContain(
      '$186'
    );
  });
  it(`.replaceAll should replace all expected parts in the given string`, () => {
    expect(StringUtils.replaceAll('145 265 953', '5', '0')).toEqual(
      '140 260 903'
    );
    expect(StringUtils.replaceAll("Aren't", "'", '')).toEqual('Arent');
    expect(StringUtils.replaceAll('How are you ?', '?', '')).toEqual(
      'How are you '
    );
    expect(StringUtils.replaceAll('-186 594 481,56', ',', '.')).toEqual(
      '-186 594 481.56'
    );
    expect(StringUtils.replaceAll('YES510566', 'd*', '')).not.toEqual('YES');
  });
});

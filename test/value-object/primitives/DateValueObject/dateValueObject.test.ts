import BirthDate from './__mocks__/BirthDate';

describe('DateValueObject', () => {
  describe('constructor', () => {
    it('should store the date in ISO format', () => {
      const birthDate = new BirthDate('2024-01-15T00:00:00.000Z');

      expect(birthDate.value).toBe('2024-01-15T00:00:00.000Z');
    });

    it('should throw an error if the date is not valid', () => {
      expect(() => new BirthDate('no-es-una-fecha')).toThrow(
        'the value: no-es-una-fecha, is not a valid date'
      );
    });
  });

  describe('format', () => {
    it('should return the date as an ISO string', () => {
      const birthDate = new BirthDate('2024-01-15T00:00:00.000Z');

      expect(birthDate.format('2020-05-10T12:30:00.000Z')).toBe(
        '2020-05-10T12:30:00.000Z'
      );
    });
  });

  describe('is before this date', () => {
    it('should return "true" if the value is before the other date', () => {
      const birthDate = new BirthDate('2024-01-15T00:00:00.000Z');

      expect(birthDate.isBeforeThisDate('2024-02-01T00:00:00.000Z')).toBe(true);
    });

    it('should return "false" if the value is after the other date', () => {
      const birthDate = new BirthDate('2024-01-15T00:00:00.000Z');

      expect(birthDate.isBeforeThisDate('2023-12-31T00:00:00.000Z')).toBe(
        false
      );
    });

    it('should throw an error if the other date is not valid', () => {
      const birthDate = new BirthDate('2024-01-15T00:00:00.000Z');

      expect(() => birthDate.isBeforeThisDate('invalida')).toThrow();
    });
  });

  describe('is after this date', () => {
    it('should return "true" if the value is after the other date', () => {
      const birthDate = new BirthDate('2024-01-15T00:00:00.000Z');

      expect(birthDate.isAfterThisDate('2023-12-31T00:00:00.000Z')).toBe(true);
    });

    it('should return "false" if the value is before the other date', () => {
      const birthDate = new BirthDate('2024-01-15T00:00:00.000Z');

      expect(birthDate.isAfterThisDate('2024-02-01T00:00:00.000Z')).toBe(false);
    });
  });

  describe('is between the dates', () => {
    it('should return "true" if the value is between both dates', () => {
      const birthDate = new BirthDate('2024-01-15T00:00:00.000Z');

      expect(
        birthDate.isBetweenTheDates(
          '2024-01-01T00:00:00.000Z',
          '2024-01-31T00:00:00.000Z'
        )
      ).toBe(true);
    });

    it('should return "false" if the value is outside the range', () => {
      const birthDate = new BirthDate('2024-03-15T00:00:00.000Z');

      expect(
        birthDate.isBetweenTheDates(
          '2024-01-01T00:00:00.000Z',
          '2024-01-31T00:00:00.000Z'
        )
      ).toBe(false);
    });

    it('should throw an error if one of the dates is not valid', () => {
      const birthDate = new BirthDate('2024-01-15T00:00:00.000Z');

      expect(() =>
        birthDate.isBetweenTheDates('invalida', '2024-01-31T00:00:00.000Z')
      ).toThrow();
    });
  });
});

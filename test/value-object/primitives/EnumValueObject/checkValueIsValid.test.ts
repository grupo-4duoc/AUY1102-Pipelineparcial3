import { Seasons, SEASONS } from './__mocks__/Seasons'


describe('EnumValueObject', () => {
  describe('check value is valid', () => {
    it(`should return void if the value exists on SEASONS`, () => {
      const expected = new Seasons(SEASONS.SPRING);

      expect(expected).toBeInstanceOf(Seasons)
    })

    it(`should throw an error if the value does not exist on SEASONS`, () => {
      expect(() => new Seasons('MONSOON' as SEASONS)).toThrow(
        'the value: MONSOON, no exists on seasons'
      )
    })
  })
}) 
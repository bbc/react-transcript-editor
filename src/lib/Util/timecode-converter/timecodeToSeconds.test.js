import timecodeToSecondsHelper from './timecodeToSeconds';

describe('Timecode conversion TC- convertToSeconds', () => {
  it('Should be defined', ( ) => {
    const demoTcValue = '00:10:00:00';
    const result = timecodeToSecondsHelper(demoTcValue);
    expect(result).toBeDefined();
  });

  it('Should be able to convert from: hh:mm:ss:ff ', ( ) => {
    const demoTcValue = '00:10:00:00';
    const demoExpectedResultInSeconds = 600;
    const result = timecodeToSecondsHelper(demoTcValue);
    expect(result).toEqual(demoExpectedResultInSeconds);
  });
});

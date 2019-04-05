import secondsToTimecode from './secondsToTimecode';

describe('Timecode conversion TC- convertToSeconds', () => {
  it('Should be defined', ( ) => {
    const dmoSecondsValue = 600;
    // const demoExpectedTc = '00:10:00:00';
    const result = secondsToTimecode(dmoSecondsValue);
    expect(result).toBeDefined();
  });

  it('Should be able to convert to: hh:mm:ss:ff ', ( ) => {
    const dmoSecondsValue = 600;
    const demoExpectedTc = '00:10:00:00';
    const result = secondsToTimecode(dmoSecondsValue);
    expect(result).toEqual(demoExpectedTc);
  });
});

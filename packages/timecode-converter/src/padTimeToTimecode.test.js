import padTimeToTimecode from './padTimeToTimecode';

describe('Timecode conversion TC- convertToSeconds', () => {
  it('Should be defined', ( ) => {
    const demoTimecode = '12:34:56:78';
    const result = padTimeToTimecode(demoTimecode);
    expect(result).toBeDefined();
  });

  it('hh:mm:ss:ff --> hh:mm:ss:ff ', ( ) => {
    const demoTimecode = '12:34:56:78';
    const result = padTimeToTimecode(demoTimecode);
    expect(result).toEqual(demoTimecode);
  });

  it('mm:ss --> convert to hh:mm:ss:ms', ( ) => {
    const demoTime = '34:56';
    const expectedTimecode = '00:34:56:00';
    const result = padTimeToTimecode(demoTime);
    expect(result).toEqual(expectedTimecode);
  });

  xit('hh:mm:ss --> convert to hh:mm:ss:ms', ( ) => {
    const demoTime = '34:56:78';
    const expectedTimecode = '00:34:56:78';
    const result = padTimeToTimecode(demoTime);
    expect(result).toEqual(expectedTimecode);
  });

  it('mm.ss--> convert to hh:mm:ss:ms', ( ) => {
    const demoTime = '34.56';
    const expectedTimecode = '00:34:56:00';
    const result = padTimeToTimecode(demoTime);
    expect(result).toEqual(expectedTimecode);
  });

  it('120 sec --> 120', ( ) => {
    const demoTime = 120;
    const expectedTimecode = 120;
    const result = padTimeToTimecode(demoTime);
    expect(result).toEqual(expectedTimecode);
  });
});

import { timecodeToSeconds, secondsToTimecode } from './index';

describe('Timecode conversion TC- convertToSeconds', () => {
  it('Should be defined', ( ) => {
    const demoTcValue = '00:10:00:00';
    const result = timecodeToSeconds(demoTcValue);
    expect(result).toBeDefined();
  });

  it('Should be able to convert: hh:mm:ss:ms ', ( ) => {
    const demoTcValue = '00:10:00:00';
    const demoExpectedResultInSeconds = 600;
    const result = timecodeToSeconds(demoTcValue);
    expect(result).toEqual(demoExpectedResultInSeconds);
  });

  it('Should be able to conver: mm:ss ', ( ) => {
    const demoTcValue = '10:00';
    const demoExpectedResultInSeconds = 600;
    const result = timecodeToSeconds(demoTcValue);
    expect(result).toEqual(demoExpectedResultInSeconds);
  });

  it('Should be able to convert: m:ss ', ( ) => {
    const demoTcValue = '09:00';
    const demoExpectedResultInSeconds = 540;
    const result = timecodeToSeconds(demoTcValue);
    expect(result).toEqual(demoExpectedResultInSeconds);
  });

  it('Should be able to convert: m.ss ', ( ) => {
    const demoTcValue = '9.01';
    const demoExpectedResultInSeconds = 541;
    const result = timecodeToSeconds(demoTcValue);
    expect(result).toEqual(demoExpectedResultInSeconds);
  });

  it('Should be able to convert: ss - seconds ', ( ) => {
    const demoTcValue = 600;
    const demoExpectedResultInSeconds = 600;
    const result = timecodeToSeconds(demoTcValue);
    expect(result).toEqual(demoExpectedResultInSeconds);
  });

  xit('Should be able to convert: ss - seconds - eve if it is string ', ( ) => {
    const demoTcValue = '600';
    const demoExpectedResultInSeconds = 600;
    const result = timecodeToSeconds(demoTcValue);
    expect(result).toEqual(demoExpectedResultInSeconds);
  });

  it('Should be able to convert: hh:mm:ss ', ( ) => {
    const demoTcValue = '00:10:00';
    const demoExpectedResultInSeconds = 600;
    const result = timecodeToSeconds(demoTcValue);
    expect(result).toEqual(demoExpectedResultInSeconds);
  });

  xit(' "sss" seconds number as string --> ss', ( ) => {
    const demoTime = '56';
    const expectedTimecode = '56';
    const result = timecodeToSeconds(demoTime);
    expect(result).toEqual(expectedTimecode);
  });

  xit(' "sss" seconds number as string --> ss', ( ) => {
    const demoTime = '116';
    const expectedTimecode = '116';
    const result = timecodeToSeconds(demoTime);
    expect(result).toEqual(expectedTimecode);
  });

  it('120 sec --> 120', ( ) => {
    const demoTime = 120;
    const expectedTimecode = 120;
    const result = timecodeToSeconds(demoTime);
    expect(result).toEqual(expectedTimecode);
  });

  //   xit('Should be able to convert: hh:mm:ss,ms ', ( )=> {
  //     const demoTcValue = '00:10:00,00';
  //     const demoExpectedResultInSeconds = 600;
  //     const result = convertToSeconds(demoTcValue);
  //     expect(result).toEqual(demoExpectedResultInSeconds);
  //   })

  //   xit('Should be able to convert hh:mm:ss;ms ', ( )=> {
  //     const demoTcValue = '00:10:00;00';
  //     const demoExpectedResultInSeconds = 600;
  //     const result = convertToSeconds(demoTcValue);
  //     expect(result).toEqual(demoExpectedResultInSeconds);
  //   })

  //   xit('Should be able to convert hh:mm:ss.ms ', ( )=> {
  //     const demoTcValue = '00:10:00.00';
  //     const demoExpectedResultInSeconds = 600;
  //     const result = convertToSeconds(demoTcValue);
  //     expect(result).toEqual(demoExpectedResultInSeconds);
  //   })
});

describe('Timecode conversion seconds to - convertToTimecode ', () => {
  it('Should be able to seconds to timecode hh:mm:ss:ms ', ( ) => {
    const demoSeconds = 600;
    const demoExpectedResultInTc = '00:10:00:00';
    const result = secondsToTimecode(demoSeconds);
    expect(result).toEqual(demoExpectedResultInTc);
  });

  it('Should be able to seconds - string to timecode hh:mm:ss:ms ', ( ) => {
    const demoSeconds = '600';
    const demoExpectedResultInTc = '00:10:00:00';
    const result = secondsToTimecode(demoSeconds);
    expect(result).toEqual(demoExpectedResultInTc);
  });
});

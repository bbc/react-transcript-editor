// test file
import React from 'react';
import { shallow, mount, render } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';
import TimedTextEditor from './index.js';

describe('<MyComponent />', () => {
  it('renders three <Foo /> components', () => {
    // const timedTextEditor = (
    //   <TimedTextEditor
    //     fileName={ this.props.fileName }
    //     transcriptData={ this.state.transcriptData }
    //     timecodeOffset={ this.state.timecodeOffset }
    //     onWordClick={ this.handleWordClick }
    //     playMedia={ this.handlePlayMedia }
    //     handleSave={ this.handleSave }
    //     isPlaying={ this.handleIsPlaying }
    //     currentTime={ this.state.currentTime }
    //     isEditable={ this.props.isEditable }
    //     isSpellCheck={ this.props.spellCheck }
    //     sttJsonType={ this.props.sttJsonType }
    //     mediaUrl={ this.props.mediaUrl }
    //     isScrollIntoView={ this.state.isScrollIntoViewOn }
    //     isPauseWhileTyping={ this.state.isPauseWhileTypingOn }
    //     showTimecodes={ this.state.showTimecodes }
    //     showSpeakers={ this.state.showSpeakers }
    //     ref={ this.timedTextEditorRef }
    //     handleAnalyticsEvents={ this.props.handleAnalyticsEvents }
    //   />
    // );
    const wrapper = shallow(
      <TimedTextEditor
        fileName={ this.props.fileName }
        transcriptData={ this.state.transcriptData }
        timecodeOffset={ this.state.timecodeOffset }
        onWordClick={ this.handleWordClick }
        playMedia={ this.handlePlayMedia }
        handleSave={ this.handleSave }
        isPlaying={ this.handleIsPlaying }
        currentTime={ this.state.currentTime }
        isEditable={ this.props.isEditable }
        isSpellCheck={ this.props.spellCheck }
        sttJsonType={ this.props.sttJsonType }
        mediaUrl={ this.props.mediaUrl }
        isScrollIntoView={ this.state.isScrollIntoViewOn }
        isPauseWhileTyping={ this.state.isPauseWhileTypingOn }
        showTimecodes={ this.state.showTimecodes }
        showSpeakers={ this.state.showSpeakers }
        ref={ this.timedTextEditorRef }
        handleAnalyticsEvents={ this.props.handleAnalyticsEvents }
      />);
    expect(wrapper.find(TimedTextEditor)).to.have.lengthOf(3);
  });

  //   it('renders an `.icon-star`', () => {
  //     const wrapper = shallow(<MyComponent />);
  //     expect(wrapper.find('.icon-star')).to.have.lengthOf(1);
  //   });

  //   it('renders children when passed in', () => {
  //     const wrapper = shallow((
  //       <MyComponent>
  //         <div className="unique" />
  //       </MyComponent>
  //     ));
  //     expect(wrapper.contains(<div className="unique" />)).to.equal(true);
  //   });

//   it('simulates click events', () => {
//     const onButtonClick = sinon.spy();
//     const wrapper = shallow(<Foo onButtonClick={ onButtonClick } />);
//     wrapper.find('button').simulate('click');
//     expect(onButtonClick).to.have.property('callCount', 1);
//   });
});

const wrapper = shallow(timedTextEditor);

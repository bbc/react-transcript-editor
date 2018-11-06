import React from "react";
import {
  // Draft,
  Editor,
  EditorState,
  // ContentState,
  CompositeDecorator,
  convertFromRaw
} from "draft-js";

import Word from "./Word";
import bbcKaldiToDraft from "./adapters/bbc-kaldi/index.js";

import styles from "./TimedTextEditor.module.css";

class TimedTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      transcriptData: this.props.transcriptData
    };

    this.onChange = editorState => this.setState({ editorState });
    this.handleClick.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentWillReceiveProps(nexProps) {
    this.setState(
      {
        transcriptData: nexProps.transcriptData
      },
      () => {
        this.loadData();
      }
    );
  }

  loadData() {
    if (this.props.transcriptData !== "") {
      const blocks = bbcKaldiToDraft(this.props.transcriptData);
      const entityMap = flatten(blocks.map(block => block.entityRanges)).reduce(
        (acc, data) => ({
          ...acc,
          [data.key]: {
            type: "WORD",
            mutability: "MUTABLE",
            data
          }
        }),
        {}
      );

      const contentState = convertFromRaw({ blocks, entityMap });
      const editorState = EditorState.createWithContent(
        contentState,
        decorator
      );

      this.setState({ editorState });
    }
  }

  handleClick(event) {
    let element = event.nativeEvent.target;
    while (!element.hasAttribute("data-start") && element.parentElement) {
      element = element.parentElement;
    }

    if (element.hasAttribute("data-start")) {
      const t = parseFloat(element.getAttribute("data-start"));
      // this.props.seek(t);
      console.log(t);
    }
  }

  render() {
    return (
      <section
        className={styles.editor}
        onClick={event => this.handleClick(event)}
      >
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          stripPastedStyles
        />
        {/* <button onClick={() => this.loadData()}>load data</button> */}
      </section>
    );
  }
}

const flatten = list =>
  list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

const getEntityStrategy = mutability => (
  contentBlock,
  callback,
  contentState
) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    if (entityKey === null) {
      return false;
    }
    return contentState.getEntity(entityKey).getMutability() === mutability;
  }, callback);
};

const decorator = new CompositeDecorator([
  {
    strategy: getEntityStrategy("MUTABLE"),
    component: Word
  }
]);

export default TimedTextEditor;

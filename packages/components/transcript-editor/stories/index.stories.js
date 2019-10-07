import React from "react";

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  text,
  number,
  boolean,
  object,
  select
} from '@storybook/addon-knobs';

import bbcKaldiTranscript from "./fixtures/bbc-kaldi.json";

import TranscriptEditor from "../index.js";

storiesOf("TranscriptEditor", module)
  .addDecorator(withKnobs)
  .add("default", () => {
    const fixtureProps = {
      title: text('title', 'Ted Talk'),
      mediaUrl: text(
        'mediaUrl',
        'https://download.ted.com/talks/KateDarling_2018S-950k.mp4'
      ),
      sttJsonType: text('sttJsonType', 'bbckaldi'),
      isEditable: boolean('isEditable', true),
      spellCheck: boolean('spellCheck', false),
      fileName: text('fileName', 'KateDarling_2018S-950k.mp4'),
      // commenting this version of `transcriptData` coz it seems that
      // loading a json this sisde effects storybook performance
      // transcriptData: object('transcriptData', bbcKaldiTranscript),
      transcriptData: bbcKaldiTranscript,
      handleAnalyticsEvents: action('Analytics event'),
      handleAutoSaveChanges: action('handleAutoSaveChange'),
      autoSaveContentType: select(
        'autoSaveContentType',
        [
          'draftjs',
          'digitalpaperedit',
          'txt',
          'txtspeakertimecodes',
          'srt',
          'html',
          'ttml',
          'premiereTTML',
          'itt',
          'csv',
          'vtt',
          'pre-segment-txt',
          'json-captions'
        ],
        'draftjs',
        0
      ),
      mediaType: select('mediaType', [ 'audio', 'video' ], 'video', 1),
      autoSaveContentType: text('autoSaveContentType', 'digitalpaperedit')
    };

    return <TranscriptEditor { ...fixtureProps } />;
  })
  .add('audio file', () => {
    const fixtureProps = {
      title: text('title', 'Ted Talk'),
      mediaUrl: text(
        'mediaUrl',
        'https://download.ted.com/talks/KateDarling_2018S-950k.mp4'
      ),
      sttJsonType: text('sttJsonType', 'bbckaldi'),
      isEditable: boolean('isEditable', true),
      spellCheck: boolean('spellCheck', false),
      fileName: text('fileName', 'KateDarling_2018S-950k.mp4'),
      // commenting this version of `transcriptData` coz it seems that
      // loading a json this sisde effects storybook performance
      // transcriptData: object('transcriptData', bbcKaldiTranscript),
      transcriptData: bbcKaldiTranscript,
      handleAnalyticsEvents: action('Analytics event'),
      handleAutoSaveChanges: action('handleAutoSaveChange'),
      autoSaveContentType: select(
        'autoSaveContentType',
        [
          'draftjs',
          'digitalpaperedit',
          'txt',
          'txtspeakertimecodes',
          'srt',
          'html',
          'ttml',
          'premiereTTML',
          'itt',
          'csv',
          'vtt',
          'pre-segment-txt',
          'json-captions'
        ],
        'draftjs',
        0
      ),
      mediaType: select('mediaType', [ 'audio', 'video' ], 'audio', 0),
      autoSaveContentType: text('autoSaveContentType', 'digitalpaperedit')
    };

    return <TranscriptEditor { ...fixtureProps } />;
  });

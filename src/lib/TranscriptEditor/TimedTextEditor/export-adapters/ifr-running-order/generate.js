
episode_timeline_id = uuid1();

// get list of topics


// for topic in topics
//   add topic to topic_segments
topic_segments.push({
  _id: uuid1(),
  _used_in_timeline: episode_timeline_id,
  active_start: null,
  approved: true,
  is_active: false,
  pips_compatible: false,
  timeline: {
    _id: uuid1(),
    beginning_of_timeline: '0:0',
    segmentEventPlacements: // sentences
  }
})


service_id = 'bbc_radio_four';
brand_id = 'p02nrss1';
version_id = 'p06pbpb2';
episode_id = 'p06pbppg';
topics = [{
  title: 'Foreign Aid'
}];
editorial_data = {
  can_replace: false,
  can_skip: false,
  category_summaries: [],
  titles: {
    display_title: "WS More or Less: Foreign Aid: Who's the most generous?",
    entity_title: "WS More or Less: Foreign Aid: Who's the most generous?",
    primary_title: "WS More or Less: Foreign Aid: Who's the most generous?",
    secondary_title: null,
    series_title: "More or Less: Behind the Stats",
    brand_title: "BBC Radio 4"
  },
  synopses: {
    short_synopsis: "In foreign aid terms what's the best way of measuring how generous a country is?",
    medium_synopsis: null,
    long_synopsis: null
  },
  tags: {
    approved: []
  },
  images: {
    primary: {
      pid: 'p06pbppz',
      title: null,
      caption: null,
      altText: null
    },
    secondary: {
      pid: null,
      title: null,
      caption: null,
      altText: null
    },
    gallery: []
  }
}
segment = {
  _id: uuid1(),
  in_time: null,
  out_time: null,
  segment_type: 'version',
  source_id: 'https://open.live.bbc.co.uk/mediaselector/6/redir/version/2.0/mediaset/audio-nondrm-download/proto/https/vpid/p06pbpb2.mp3',
  source_type: 'href',
  editorial_data
}
timeline = {
  _id: uuid1(),
  beginning_of_timeline: '0:0',
  segmentEventPlacements: topic_segments
}
segment_event = {
  active_start: null,
  approved: null,
  is_active: null,
  pips_compatible: null,
  segment,
  timeline,
  topics
}
ro = {
  _id: uuid1(),
  service_id,
  brand_id,
  version_id,
  episode_id,
  segment_events: [
    segment_event
  ]
}

import React from 'react';
import ReactDOM from 'react-dom';
import { MusicPlayer }  from './music_player.js';
import { LibraryList } from "./library_list.js";
import { MusicInfo } from "./music_info.js";
import { TabContainer } from "./tabs.js";
import { fetch_recommendation, fetch_library_songs } from "./util.js";
import { PlayList } from "./play_list.js";

import "./index.css";

var c = [
    { value: "我的清單", context_item: <LibraryList from={fetch_library_songs}/> },
    { value: "播放中", context_item: <PlayList />},
];
ReactDOM.render(
    <TabContainer tabs={c} />,
    document.getElementById("song_list")
);

ReactDOM.render(
  <MusicInfo />,
  document.getElementById("recommendations")
);

ReactDOM.render(
  <MusicPlayer />,
  document.getElementById('music_player')
);
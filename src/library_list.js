import React from 'react';
import { MediaItemList } from "./media_item_list.js";

import "./library_list.css";

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    [array[i], array[j]] = [array[j], array[i]];
  }
}

export class LibraryList extends MediaItemList {
    constructor(props) {
        super(props);
        this.from = props.from;
        this.song_list = [];
    }

    music_loaded() {
        super.music_loaded();
        this.music.player.addEventListener("playbackStateDidChange", (event)=> {
            // event.oldState;
            if(event.state === window.MusicKit.PlaybackStates.completed) {
                if(this.song_list.length === 0) return;
                this.music.setQueue({
                    songs: this.song_list.splice(0, 25)
                });
            }
        });
    }

    async load_more_songs() {
        this.c += 1;
        try {
            while(this.songs_lock) {
                await this.songs_lock;
            }
        } catch(e) {}
        try {
            this.songs_lock = this.from(undefined, { limit: 100, offset: this.songs_offset });
            var songs = await this.songs_lock;
            this.songs_offset += 100;
            if(songs.length === 0) {
                this.load_finish = true;
                return;
            }
            this.setState({ item_list: this.state.item_list.concat(songs) });
        }finally{
            this.songs_lock = undefined;
        }
    }

    async select_item(item) {
        await this.music.setQueue({
            song: item.id
        });
    }

    async sort(func) {
        var item_list = this.state.item_list.sort(func);
        this.setState({ item_list: item_list });
    }

    async play(want_shuffle=false) {
        var songs=[];
        if(want_shuffle) {
            shuffle(this.state.item_list);
        }
        for(var item of this.state.item_list) {
            songs.push(item.id);
        }
        this.song_list = songs;
        await this.music.setQueue({
            songs: this.song_list.splice(0, 25)
        });
    }

    sort_artist(a, b) {
        if(a.attributes.artistName < b.attributes.artistName) {
            return -1;
        }
        if(a.attributes.artistName === b.attributes.artistName) {
            return 0;
        }
        return 1;
    }

    sort_name(a, b) {
        if(a.attributes.name < b.attributes.name) {
            return -1;
        }
        if(a.attributes.name === b.attributes.name) {
            return 0;
        }
        return 1;
    }

    render() {
        var items = super.render();
        return <div className="library_container">
            <div className="library_controller_container">
            <button value="" onClick={()=>this.load_all_songs()}>載入全部</button>
            <button value="" onClick={()=>this.sort(this.sort_artist)}>作者排序</button>
            <button value="" onClick={()=>this.sort(this.sort_name)}>名稱排序</button>
            <button value="" onClick={()=>this.play(false)}>播放全部</button>
            <button value="" onClick={()=>this.play(true)}>隨機播放全部</button>
            </div>
            <div className="library_list_container">
            { items }
            </div>
            </div>;
    }
}
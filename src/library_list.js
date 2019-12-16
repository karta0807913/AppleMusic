import React from 'react';
import { AppleMusicComponent } from "./music_manager.js";

import "./library_list.css";

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    [array[i], array[j]] = [array[j], array[i]];
  }
}

export class LibraryList extends AppleMusicComponent {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.state = { item_list: [], offset: 0 };
        this.songs_lock = undefined;
        this.load_finish = false;
        this.title = props.title;
        this.from = props.from;
    }

    music_loaded() {
        this.load_more_songs();
    }

    async load_more_songs() {
        console.log(this.music.api);
        if(this.songs_lock) return;
        this.songs_lock = this.from(undefined, { limit: 100, offset: this.state.offset });
        var songs = await this.songs_lock;
        if(songs.length === 0) {
            this.load_finish = true;
            return;
        }
        this.setState({ item_list: this.state.item_list.concat(songs), offset: this.state.offset + 100 });
        this.songs_lock = undefined;
    }

    async load_all_songs() {
        while(!this.load_finish) {
            await this.load_more_songs();
        }
    }

    scroll() {
        if(this.ref.current.scrollTop + this.ref.current.offsetHeight >= this.ref.current.scrollHeight) {
            this.load_more_songs();
        }
    }

    async select_item(item) {
        await this.music.setQueue({
            song: item.id
        });
        this.music.play();
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
        var a = await this.music.setQueue({
            songs: songs
        });
        this.music.play();
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
        var items = [];
        for (let item of this.state.item_list) {
            var url = item.attributes.artwork && item.attributes.artwork.url.replace("{w}", "100").replace("{h}", "100");
            items.push(<li key={item.id} onClick={()=>this.select_item(item)}>
                       <ListItem
                       image={url}
                       title={item.attributes.name}
                       artist={item.attributes.artistName} />
                       </li>);
        }
        return <div>
            <h2>{this.title}</h2>
            <button value="" onClick={()=>this.load_all_songs()}>載入全部</button>
            <button value="" onClick={()=>this.sort(this.sort_artist)}>作者排序</button>
            <button value="" onClick={()=>this.sort(this.sort_name)}>名稱排序</button>
            <button value="" onClick={()=>this.play(false)}>播放全部</button>
            <button value="" onClick={()=>this.play(true)}>隨機播放全部</button>
            <div className="fit">
            <nav>
            <ul onScroll={this.scroll.bind(this)} ref={this.ref} >
            {items}
            </ul>
            </nav>
        </div>
            </div>;
    }
}

class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: props.image,
            title: props.title,
            artist: props.artist
        };
    }

    render() {
        return <div className="list_item">
            <img src={this.state.image} />
            <div>
            <div>{this.state.title}</div>
            <div>{this.state.artist}</div>
            </div>
            </div>;
    }
}
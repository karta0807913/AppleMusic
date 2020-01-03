import React from 'react';
import { AppleMusicComponent } from "./music_manager.js";

import { get_feather_icons } from "./util.js";
import "./media_item_list.css";

export class MediaItemList extends AppleMusicComponent {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.state = { item_list: []};
        this.songs_lock = undefined;
        this.load_finish = false;
        this.songs_offset = 0;
        this.song_ref_map = new Map();
        this.delay_item_set_playing = undefined;
        this.last_playing = null;
    }

    music_loaded() {
        if(this.music.isAuthorized) {
            this.load_more_songs();
        }
        this.music.addEventListener("authorizationStatusDidChange", function() {
            if(this.music.isAuthorized) {
                this.load_more_songs();
            } else {
                this.load_finish = false;
                this.setState({ item_list: [] });
                this.songs_offset = 0;
            }
        });

        if(this.music.player.nowPlayingItem) {
            this.update_playing_state();
        }
        this.music.addEventListener("mediaItemDidChange",(item)=> {
            this.update_playing_state(item);
        });
    }

    componentDidUpdate() {
        if(this.music) {
            this.update_playing_state();
        }
    }

    update_playing_state({ item }={}) {
        if(!item) {
            item = this.music.player.nowPlayingItem;
            if(!item) {
                return;
            }
        }
        if(this.last_playing && this.last_playing.current) {
            this.last_playing.current.setState({ playing: false });
        }
        var current_item = this.song_ref_map.get(item.container.id);
        if(current_item && current_item.current) {
            current_item.current.setState({ playing: true });
        } else {
            this.delay_item_set_playing = current_item;
        }
        this.last_playing = current_item;
    }

    // update_playing_state(media_target) {
    //     var item = media_target.item;
    //     if(last_playing && last_playing.current) {
    //     last_playing.current.setState({ playing: false });
    //     }
    //     var current_item = this.song_ref_map.get(obj.item.container.id);
    //     if(current_item && current_item.current) {
    //         current_item.current.setState({ playing: true });
    //     } else {
    //         this.delay_item_set_playing = current_item;
    //     }
    //     last_playing = current_item;
    // }

    componentDidMount() {
    }

    reload_songs() {
        this.song_ref_map.clear();
        this.setState({ item_list: [] });
        this.load_more_songs();
    }

    async load_more_songs() {
        const data = await this._load_more_songs();
        this.setState({ item_list: data });
    }

    // implement and return apple media item
    async _load_more_songs() {
        throw new Error("please implement this method");
    }

    async load_all_songs() {
        while(!this.load_finish) {
            await this.load_more_songs();
        }
    }

    async select_item(item) {
        throw new Error("please implement this method");
    }


    scroll() {
        if(this.ref.current.scrollTop + this.ref.current.offsetHeight >= this.ref.current.scrollHeight) {
            this.load_more_songs();
        }
    }

    async sort(func) {
        var item_list = this.state.item_list.sort(func);
        this.setState({ item_list: item_list });
    }

    render() {
        var items = [];
        for (let item of this.state.item_list) {
            var url = item.attributes.artwork && item.attributes.artwork.url.replace("{w}", "100").replace("{h}", "100");
            var item_id = item.id;
            if(item instanceof window.MusicKit.MediaItem) {
                item_id = item.container.id;
            }
            var ref = this.song_ref_map.get(item_id) || React.createRef();
            this.song_ref_map.set(item_id, ref);
            items.push(<li key={item.id} onClick={()=>this.select_item(item)}>
                       <ListItem
                       ref={ref}
                       image={url}
                       title={item.attributes.name}
                       artist={item.attributes.artistName} />
                       </li>);
        }
        return <nav className="media_item_list">
        <ul onScroll={this.scroll.bind(this)} ref={this.ref} >
            {items}
        </ul>
        </nav>;
    }
};

export class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: props.image,
            title: props.title,
            artist: props.artist,
            playing: false
        };
    }

    get_controll_icon() {
        if(this.state.playing === true) {
            return get_feather_icons("play", { width: 50, height: 50 });
        }
        return { __html: "" };
    }

    render() {
        return <div className="list_item">
            <span>
            <img src={this.state.image} />
            <div className="item_state_container"
                dangerouslySetInnerHTML={this.get_controll_icon()}>
            </div>
            </span>
            <div>
            <div>{this.state.title}</div>
            <div>{this.state.artist}</div>
            </div>
            </div>;
    }
}
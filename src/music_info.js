import React from 'react';
import { AppleMusicComponent } from "./music_manager.js";

export class MusicInfo extends AppleMusicComponent {
    constructor(props) {
        super(props);
        this.state = { item: undefined };
    }
    music_loaded() {
        this.music.player.addEventListener("mediaItemDidChange", (obj) => {
            this.setState({item: obj.item});
        });
    }

    render() {
        if(!this.state || this.state.item === undefined) {
            return <div></div>;
        }
        var item = this.state.item;
        return <div>
            <img src={item.artworkURL} style={{ width: "50vh", height: "50vh"}}/>
            <p>{item.title}</p>
            <p>{item.artistName}</p>
            <p>{item.info}</p>
            <p>{item.albumName}</p>
            <p>{item.albumInfo}</p>
            </div>;
    }
}
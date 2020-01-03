import React from 'react';
import { AppleMusicComponent } from "./music_manager.js";

import "./music_info.css";

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
        return <div className="music_info_container">
            <img src={item.artworkURL} style={{ width: "50vh", height: "50vh"}}/>
            <table style={{ "marginTop": "20px" }}>
            <tbody>
            <tr><td className="music_info_title">title:</td><td className="music_info_text">{item.title}</td></tr>
            <tr><td className="music_info_title">artistName:</td><td className="music_info_text">{item.artistName}</td></tr>
            <tr><td className="music_info_title">info:</td><td className="music_info_text">{item.info}</td></tr>
            <tr><td className="music_info_title">albumName:</td><td className="music_info_text">{item.albumName}</td></tr>
            <tr><td className="music_info_title">albumInfo:</td><td className="music_info_text">{item.albumInfo}</td></tr>
            </tbody>
            </table>
            </div>;
    }
}
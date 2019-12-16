import React from 'react';
import { AppleMusicComponent } from "./music_manager.js";

import feather from 'feather-icons';

import "./music_player.css";

export class MusicPlayer extends AppleMusicComponent {
    constructor(props) {
        super(props);
        this.login_success = false;
        this.state = {
            isPlaying: false,
            login_success: false
        };
    }

    music_loaded() {
        this.login();
        this.music.player.addEventListener("playbackStateDidChange", (...args)=> {
            this.setState({ item: this.music.player.nowPlayingItem,
                            isPlaying: this.music.player.isPlaying });
        });
        this.music.setQueue({
            album: '1025210938'
        });
    }

    async login() {
        try {
            await this.music.authorize();
            this.login_success = true;
        } catch(error) {
            this.login_success = false;
            console.log(error);
        }

        this.setState({ login_success: this.login_success });
    }

    get_feather_icons(name) {
        return { __html: feather.icons[name].toSvg() };
    }

    play_or_pause() {
        console.log(this.music);
        if(this.music.player.isPlaying) {
            this.music.player.pause();
        } else {
            this.music.player.play();
        }
        this.setState({ item: this.music.player.nowPlayingItem,
                        isPlaying: this.music.player.isPlaying });
    }

    next() {
        this.music.player.skipToNextItem();
    }

    previous() {
        this.music.player.skipToPreviousItem();
    }

    render() {
        if(!this.login_success) {
            return <div>
                <button onClick={this.login.bind(this)} dangerouslySetInnerHTML={this.get_feather_icons("log-in")}></button>
                </div>;
        } else {
            return <div className="music_player">
                <div className="wrap">


                <img className="fit_img display_inline" src={this.state.item && this.state.item.artworkURL}/>
                <a className="display_inline">{this.state.item && this.state.item.attributes.name}</a>

                <div className="display_inline" onClick={()=>this.previous()} dangerouslySetInnerHTML={this.get_feather_icons("skip-back")} />

                <div className="display_inline" onClick={()=>this.play_or_pause()} dangerouslySetInnerHTML={ this.state.isPlaying ? this.get_feather_icons("pause") : this.get_feather_icons("play")} />
                <label className="display_inline" onClick={()=>this.next()} dangerouslySetInnerHTML={this.get_feather_icons("skip-forward")} />
                </div>
                </div>;
        }
    }
}
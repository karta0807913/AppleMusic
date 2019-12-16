import React from 'react';

import feather from 'feather-icons';

import { AppleMusicComponent } from "./music_manager.js";

import "./music_player.css";

export class MusicPlayer extends AppleMusicComponent {
    constructor(props) {
        super(props);
        this.login_success = false;
        this.stop_update_slider = false;
        this.song_duration = 0;
        this.state = {
            isPlaying: false,
            login_success: false
        };
        this.slider_bar = undefined;
    }

    music_loaded() {
        this.login();

        this.music.player.addEventListener("mediaItemDidChange", (obj) => {
            this.song_duration = obj.item.playbackDuration / 1000;
            this.setState({item: obj.item});
        });

        this.music.player.addEventListener("playbackStateDidChange", (...args)=> {
            this.setState({ isPlaying: this.music.player.isPlaying });
        });

        this.music.player.addEventListener("queueItemsDidChange", (obj) => {
            this.music.play();
        });

        this.music.addEventListener("playbackDurationDidChange", (event) => {
            event.target.addEventListener("timeupdate", (event)=>{
                if(this.slider_bar && !this.stop_update_slider) {
                    var target = event.target;
                    this.slider_bar.value = (target.currentTime / target.duration) * 1000;
                }
            });
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

    bind_slider_event(slider) {
        if(!slider) return;
        if(this.slider_bar) return;
        this.slider_bar = slider;
        this.slider_bar.value = 0;
        this.slider_bar.addEventListener("change", (event) => {
            var target = event.target;
            this.music.seekToTime(parseInt(target.value) / parseInt(target.max) * this.song_duration);
        });
        this.slider_bar.addEventListener("mousedown", ()=> {
            this.stop_update_slider = true;
        });
        this.slider_bar.addEventListener("mouseup", ()=> {
            this.stop_update_slider = false;
        });
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
                <div className="display_inline" style={{width: "100%"}}>
                <div className="music_text">
                {this.state.item && this.state.item.attributes.name}
            </div>
                <div className="music_text">
                {this.state.item && this.state.item.artistName}
            </div>
                <input
            type="range"
            min="0"
            max="1000"
            className="slider"
            ref={this.bind_slider_event.bind(this)}
                />
                </div>

                <div
            className="display_inline"
            onClick={()=>this.previous()}
            dangerouslySetInnerHTML={this.get_feather_icons("skip-back")}
                />

                <div
            className="display_inline" onClick={()=>this.play_or_pause()}
            dangerouslySetInnerHTML={ this.state.isPlaying ? this.get_feather_icons("pause") : this.get_feather_icons("play")}
                />

                <label className="display_inline" onClick={()=>this.next()} dangerouslySetInnerHTML={this.get_feather_icons("skip-forward")} />
                </div>
                </div>;
        }
    }
}
import React from 'react';

import feather from 'feather-icons';

import { AppleMusicComponent } from "./music_manager.js";

import "./music_player.css";

export class MusicPlayer extends AppleMusicComponent {
    constructor(props) {
        super(props);
        this.mask_play_state = false;
        this.login_success = false;
        this.stop_update_slider = false;
        this.song_duration = 0;
        this.native_audio_player = undefined;
        this.state = {
            isPlaying: false,
            login_success: false
        };
        this.slider_bar = undefined;
    }

    music_loaded() {
        this.login();

        this.music.player.volume = 0.1;

        this.music.player.addEventListener("mediaItemDidChange", (obj) => {
            this.song_duration = obj.item.playbackDuration / 1000;
            this.setState({item: obj.item});
        });

        this.music.player.addEventListener("mediaCanPlay", (obj) => {
            this.music.play().then(()=> {
                this.mask_play_state = false;
                this.setState({ isPlaying: this.music.player.isPlaying });
                console.log("AAA");
            });
        });

        this.music.player.addEventListener("playbackStateDidChange", (...args)=> {
            if(this.mask_play_state) {
                this.setState({ isPlaying: false });
            } else {
                this.setState({ isPlaying: this.music.player.isPlaying });
            }
        });

        this.music.player.addEventListener("queueItemsDidChange", (obj) => {
            this.mask_play_state = true;
            this.music.play();
            this.music.pause();
        });

        this.music.addEventListener("playbackDurationDidChange", (event) => {
            if(this.native_audio_player === event.target) return;
            this.native_audio_player = event.target;
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
        if(this.mask_play_state) return;
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
        if(this.slider_bar == slider) return;
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

    get_controll_icon() {
        if(this.mask_play_state) {
            return this.get_feather_icons("loader");
        }
        if(!this.state.isPlaying) {
            return this.get_feather_icons("play");
        }
        return this.get_feather_icons("pause");
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
            dangerouslySetInnerHTML={this.get_controll_icon()}
                />

                <label className="display_inline" onClick={()=>this.next()} dangerouslySetInnerHTML={this.get_feather_icons("skip-forward")} />
                </div>
                </div>;
        }
    }
}
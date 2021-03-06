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

        this.media_can_play = false;

        this.music.player.addEventListener("mediaItemDidChange", (obj) => {
            this.song_duration = obj.item.playbackDuration / 1000;
            this.setState({item: obj.item});
        });

        var music_player = undefined;
        var previous_src = undefined;
        var play_promise = undefined;
        this.music.player.addEventListener("mediaCanPlay", (obj) => {
            if(obj.target.src === previous_src) return;
            music_player = obj.target;
            previous_src = obj.target.src;
            this.media_can_play = true;
            if(play_promise) {
                play_promise = undefined;
            } else {
                this.music.play();
            }
        });

        this.music.player.addEventListener("mediaPlaybackError", (obj) => {
            console.log(obj);
        });

        this.music.player.addEventListener("playbackStateDidChange", (events)=> {
            if(this.mask_play_state) {
                if(this.media_can_play && this.music.player.isPlaying) {
                    this.mask_play_state = false;
                    this.setState({ isPlaying: this.music.player.isPlaying });
                    music_player && music_player.play();
                } else {
                    music_player && music_player.pause();
                    this.setState({ isPlaying: false });
                }
            } else {
                this.setState({ isPlaying: this.music.player.isPlaying });
            }
        });

        this.music.player.addEventListener("queueItemsDidChange", async (obj) => {
            this.mask_play_state = true;
            this.media_can_play = false;
            play_promise = this.music.play();
            await play_promise;
            if(play_promise) {
                this.music.pause();
            }
            play_promise = undefined;
        });

        this.music.player.addEventListener("queuePositionDidChange", ()=> {
            this.mask_play_state = true;
            this.media_can_play = false;
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
        this.music.player.skipToNextItem().catch(()=>{});
    }

    previous() {
        this.music.player.skipToPreviousItem().catch(()=>{});
    }

    bind_slider_event(slider) {
        if(!slider) return;
        if(this.slider_bar === slider) return;
        this.slider_bar = slider;
        this.slider_bar.value = 0;
        this.slider_bar.addEventListener("change", async (event) => {
            if(this.media_can_play === false) return;
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
                <div className="music_text music_title">
                {this.state.item && this.state.item.attributes.name}
            </div>
                <div className="music_text music_artist">
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

                <label className="display_inline" onClick={()=>this.next()}
            dangerouslySetInnerHTML={this.get_feather_icons("skip-forward")} />
                </div>
                </div>;
        }
    }
}
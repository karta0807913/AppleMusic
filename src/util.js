import jquery from "jquery";
import feather from 'feather-icons';

export async function fetch_recommendation() {
    var api = window.MusicKit.getInstance().api;
    var a =  jquery.ajax({
        url: api.url + "/me/recommendations",
        method: "GET",
        headers: {
            "authorization": "Bearer " + api._developerToken.token,
            "music-user-token": api.userToken
        }
    });
    console.log(await a);
    return [0, []];
}

export async function recently_added(_, { offset=0 }={}) {
    const api = window.MusicKit.getInstance().api;
    let albums = await jquery.ajax({
        url: "https://api.music.apple.com/v1/me/library/recently-added?offset=" + offset,
        method: "GET",
        headers: {
            "authorization": "Bearer " + api._developerToken.token,
            "music-user-token": api.userToken
        }
    });
    albums = albums.data;
    if(albums.length === 0) {
        return [0, []];
    }
    let result = [];
    for(let album of albums) {
        result.push(jquery.ajax({
            url: "https://api.music.apple.com/v1/me/library/albums/" + album.id,
            method: "GET",
            headers: {
                "authorization": "Bearer " + api._developerToken.token,
                "music-user-token": api.userToken
            }
        }));
    }
    result = await Promise.all(result);
    let finally_result = [];
    for(let albums of result) {
        for(let album of albums.data) {
            finally_result = finally_result.concat(album.relationships.tracks.data);
        }
    }
    return [ albums.length, finally_result];
}

export async function fetch_library_songs(parm1, parm2) {
    let result = await window.MusicKit.getInstance().api.library.songs(parm1, parm2);
    return [ result.length, result ];
}

export function get_feather_icons(name, options={}) {
    return { __html: feather.icons[name].toSvg(options) };
}
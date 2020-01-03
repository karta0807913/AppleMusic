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
    return [];
}

export async function fetch_library_songs(parm1, parm2) {
    return window.MusicKit.getInstance().api.library.songs(parm1, parm2);
}

export function get_feather_icons(name, options={}) {
    return { __html: feather.icons[name].toSvg(options) };
}
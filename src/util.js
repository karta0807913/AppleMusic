import jquery from "jquery";

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
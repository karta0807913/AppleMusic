import React from 'react';

var reslove;
var music = new Promise((s)=>reslove=s);
function getInstance() {
    return music;
}

document.addEventListener("musickitloaded", () => {
    try {
        reslove(window.MusicKit.getInstance());
    } catch (error) {
        let instance = window.MusicKit.configure({
            developerToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlQ3NkdDVFVXOTYifQ.eyJpc3MiOiJDUkVMTDNSSDhEIiwiaWF0IjoxNTc2Mzk0MTA2LCJleHAiOjE1OTIxNzExMDZ9.zn2QlCeX7M97gWtKMRTzxUtW86EM437fTf6G1XfojOi60VhwQDc4L9jTlVSDbS1b8sHIcO50-Vb6NwyipzFVUQ',
            app: {
                name: 'test apple music',
                build: '1978.4.1'
            }
        });
        reslove(instance);
    }
});

var script = document.createElement("script");
script.src = "https://js-cdn.music.apple.com/musickit/v1/musickit.js";
// script.src = "https://js-cdn.music.apple.com/musickit/v2/amp/musickit.js";
script.async = true;
document.body.appendChild(script);


export class AppleMusicComponent extends React.Component{
    constructor(props) {
        super(props);
        getInstance().then((music)=> {
            this.music = music;
            this.music_loaded();
        }).catch(console.log);
    }

    music_loaded() {
    }
}
import { MediaItemList } from "./media_item_list.js";

export class PlayList extends MediaItemList {
    constructor(props) {
        super(props);
        this._can_reload = false;
        this._need_reload = false;
    }

    music_loaded() {
        super.music_loaded();
        this.music.addEventListener("queueItemsDidChange", ()=> {
            if(this._can_reload) {
                this.reload_songs();
            } else {
                this._need_reload = true;
            }
        });

        this.music._registry["__queueItemsDidChange"] = this.music._registry["__queueItemsDidChange"] || [];
        this.music.addEventListener("__queueItemsDidChange", ()=> {
            if(this._can_reload) {
                this.reload_songs();
            } else {
                this._need_reload = true;
            }
        });
    }

    componentDidMount() {
        this._can_reload = true;
        if(this._need_reload) {
            this.reload_songs();
            this._need_reload = false;
        }
    }

    componentWillUnmount() {
        this._can_reload = false;
    }

    async _load_more_songs() {
        return this.music.player.queue._items;
    }

    select_item(...args) {
        console.log(args);
    }
}
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
        if(this.load_finish) return [];
        this.load_finish = true;
        return this.music.player.queue._items;
    }

    select_item(mediaItem) {
        var index = this.music.player.queue._itemIDs.indexOf(mediaItem.container.id);
        if(index === -1) return;
        if(index === this.music.player.queue.position) return;
        index = index - 1;
        this.music.player.queue.position = index;
        this.music.player.skipToNextItem();
    }
}
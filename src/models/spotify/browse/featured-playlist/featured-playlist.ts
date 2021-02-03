export interface FeaturedPlaylistResponse {
    message: string;
    playlists: Playlists;
}

export interface Playlists {
    href: string;
    items: Item[];
    limit: number;
    next?: any;
    offset: number;
    previous?: any;
    total: number;
}

export interface Item {
    collaborative: boolean;
    description: string;
    external_urls: Externalurls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    owner: Owner;
    primary_color?: any;
    public?: any;
    snapshot_id: string;
    tracks: Tracks;
    type: string;
    uri: string;
}

export interface Tracks {
    href: string;
    total: number;
}

export interface Owner {
    display_name: string;
    external_urls: Externalurls;
    href: string;
    id: string;
    type: string;
    uri: string;
}

export interface Image {
    height?: any;
    url: string;
    width?: any;
}

export interface Externalurls {
    spotify: string;
}
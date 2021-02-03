import React, { FormEvent, ReactElement, useEffect, useState } from 'react';
import axios from 'axios';
import oembedParser, { OembedData, RichTypeData } from 'oembed-parser'
import { FilterObject } from '../../models';
import { FeaturePlaylistSearch, FeaturedPlaylistResponse, Item } from '../../models/spotify';

const Home = () => {
    const [filters, setFilers] = useState<FilterObject>({ filters: [] });
    const [search, setSearch] = useState<FeaturePlaylistSearch>();
    const [playlists, setPlaylists] = useState<Array<Item>>([])
    const [renderPlaylist, setRenderPlaylist] = useState<ReactElement[]>([]);
    const [titleSpotify, setTitleSpotify] = useState<string>('');

    useEffect( () => {
        setPlaylists([]);
        setRenderPlaylist([]);

        axios.get('http://www.mocky.io/v2/5a25fade2e0000213aa90776')
        .then(response => {
            setFilers(response.data);
        })
        .catch(err => {
            console.log('[FILTERS] Cannot get filter.', err);
            alert(`Something occurred to get filters.`)
        })

    }, [])

    useEffect(() => {
        handleSpotifyCall();
    }, [search]);

    useEffect(() => {
        renderSpotifyPlaylistFeatured()
    }, [playlists])

    const handleSpotifyCall = () => {
        const url = new URL('https://api.spotify.com/v1/browse/featured-playlists');

        if(search) {            
            Object.keys(search).map(key => {
                
                if(key === 'locale' && search.locale) url.searchParams.append(key, search.locale);
                if(key === 'country' && search.country) url.searchParams.append(key, search.country);
                if(key === 'timestamp' && search.timestamp) url.searchParams.append(key, search.timestamp);
                if(key === 'limit' && search.limit){
                    let limitValue = search.limit;
                    if(search.limit > 50) {
                        limitValue = 50;
                        alert(`The maximum item limit is 50, your value is ${search.limit}. We limited the search to 50`)
                    }
                    url.searchParams.append(key, limitValue.toString());
                } 
                if(key === 'offset' && search.offset) url.searchParams.append(key, search.offset.toString());
            })
        }

        axios.get(url.toString(), {
            headers: {
                'Authorization': 'Bearer BQBWJJCr6WpUuVFmXPf8e4fceMjjYTg_sK5BudW5rRa9an3OeulktT5bLqUvjfhlIDkcI1GTsmlQjeXnCRRnmgnueDloHX0SUgzaaQy3TTHXfHGNYkp-m2z2PLYD2H9DxUSdFdwfvAgaNSobzwdji_E6weRnsAmfNRI'
            }
        }).then(response => {
            const data: FeaturedPlaylistResponse = response.data
            setPlaylists(data.playlists.items)
            setTitleSpotify(data.message);
            setRenderPlaylist([]);
        })
    }

    const formChanged = (e:FormEvent<HTMLFormElement>) => {
        const target = e.target as HTMLInputElement;
        const name = target.name;
        const value = target.value;

        if(value){
            let toAppend;
            
            if(name === 'locale') toAppend = { ...search, locale: value}
            if(name === 'country') toAppend = { ...search, country: value}
            if(name === 'timestamp') toAppend = { ...search, timestamp: value}
            if(name === 'limit') toAppend = { ...search, limit: parseInt(value)}
            if(name === 'offset') toAppend = { ...search, offset: parseInt(value) }
            
            setSearch(toAppend);
        }
    }

    const renderSpotifyPlaylistFeatured = async () => {
        playlists.map(playlist => {
            oembedParser.extract(playlist.external_urls.spotify)
                .then(oembedData => {
                    const parsedOembed = oembedData as RichTypeData;

                    setRenderPlaylist(oldRender => [
                        ...oldRender,
                        <div style={{margin: '0px 10px'}} dangerouslySetInnerHTML={ { __html: parsedOembed.html } } />
                    ])
                })
                .catch(err => {
                    console.log('[FILTERS] Cannot get oembeds.', err);
                })
        })
    }
    
    return (
        <div>
            <div style={{ padding: 10 }}>
                <form method='POST' onChange={formChanged}>
                    <div>
                        {
                            filters.filters.map((filter, index) => {
                                if(Array.isArray(filter.values)){
                                    return (<div key={`${filter.name}_${index}`} style={{display: 'flex'}} >
                                        <div style={{width: 110}}>{ filter.name } </div>
                                        <div style={{width: 200}}>
                                        <select id={filter.id} name={filter.id} style={{ width: '100%'}}>
                                            <option>Select an option</option>
                                            {
                                                filter.values.map(value => {
                                                    return <option value={value.value}>{value.name}</option>
                                                })
                                            }
                                        </select>
                                        </div>
                                    </div>)
                                }

                                let inputType = 'text';

                                if(filter.validation.primitiveType === 'INTEGER') inputType = 'number';
                                if(filter.validation.entityType === 'DATE_TIME') inputType = 'datetime-local';

                                return (<div style={{display: 'flex'}}>
                                    <div style={{width: 110}}>{ filter.name }</div>
                                    <div style={{width: 200}}>
                                        <input 
                                            id={filter.id} 
                                            name={filter.id}
                                            type={inputType} 
                                            min={ filter.validation.primitiveType === 'INTEGER' ? filter.validation.min || 0 : 0 } 
                                            max={ filter.validation.primitiveType === 'INTEGER' ? filter.validation.max || 0 : 0 }
                                            style={{ width: '100%'}}
                                        />
                                    </div>
                                </div>)
                            })
                        }
                    </div>
                </form>
            </div>

            <h1>{titleSpotify}</h1>
            <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around'}}>
                { renderPlaylist.map(renderpl => {
                    return renderpl;
                }) }
            </div>

        </div>
    );
};

export { Home };
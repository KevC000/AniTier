import React, { useState, useEffect } from 'react';
import { Button, Modal, Tab, Tabs } from 'react-bootstrap';
import { ContentType, AniListStatus } from '../../utils/constants'
import { searchAniListContent, fetchUserAniListAnimeList, fetchUserAniListMangaList } from '../../utils/external_apis/anilist_api';
import { BeatLoader } from "react-spinners";
import './add_modal.scss';
import { SearchResult, SearchResultImport } from './content_result/search_result';

export default function AddFromAniListModal({ showModal, handleCloseModal, inventory, addContentToInventory, tierList, isApiAlreadyAdded }) {

    // State Initialization
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [status, setStatus] = useState(AniListStatus.CURRENT);
    const [userData, setUserData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSearchInputChange = (event) => setSearchInput(event.target.value);
    const handleUserNameChange = (event) => setUserName(event.target.value);
    const handleStatusChange = (event) => setStatus(event.target.value);

    const handleSearch = (event) => {
        event.preventDefault();
        setIsLoading(true);
        searchAniListContent(ContentType[tierList.content_type], searchInput)
            .then(result => {
                setSearchResults(result);
                setIsLoading(false);
            });
    }

    const fetchUserList = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const fetchFunction = ContentType[tierList.content_type] === ContentType.anime ? fetchUserAniListAnimeList : fetchUserAniListMangaList;

        fetchFunction(userName, status)
            .then(data => {
                if (!data || data.length === 0) {
                    setErrorMessage(`User ${userName} not found or user's list is empty.`);
                } else {
                    setUserData(data);
                    console.log('user data', data);
                }
            })
            .catch(error => {
                console.error(error.message);
                setErrorMessage(`No user data found`);
            });
    }

    const addAllToInventory = async () => {
        const promises = [];

        for (const list of userData) {
            for (const content of list.entries) {
                console.log('content', content);
                if (content.media) {
                    const id = content.media.id;
                    const image = (content.media.main_picture?.large || content.media.coverImage?.large || content.media.main_picture?.medium || content.media.image.large || content.media.image || content.media.images.jpg.image_url);
                    const name = content.media.title?.english || content.media.title?.romaji || content.media?.title || (content.media.name?.first ? `${content.media.name.first} ${content.media.name.last}` : content.media.name?.first || content.media.name?.last || "Unknown");
                    promises.push(addContentToInventory(id, name, image));
                }
            }
        }

        const results = await Promise.allSettled(promises);

        // Check for failures and handle them as needed
        for (const result of results) {
            if (result.status === 'rejected') {
                console.error("Error adding content to inventory:", result.reason);
            }
        }
    }

    return (
        <Modal show={showModal} onHide={handleCloseModal} size="xl" className="my-modal">
            <Modal.Header closeButton>
                <Modal.Title>Add {tierList.content_type}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs defaultActiveKey="tab1" id="uncontrolled-tab-example">
                    <Tab eventKey="tab1" title="Search">
                        <form className="d-flex mb-3" onSubmit={handleSearch}>
                            <input type="text" className="form-control" value={searchInput} onChange={handleSearchInputChange} placeholder={`${tierList.content_type} name`} />
                            <Button className="ml-2" type="submit">Search</Button>
                        </form>
                        <div className="scrollable-results py-2 w-100 h-80">
                            {isLoading ? <BeatLoader color="#123abc" loading={isLoading} size={15} /> :
                                (searchResults && searchResults.map(result =>
                                    <SearchResult key={result.id} result={result} contentType={ContentType[tierList.content_type]} inventory={inventory} addContentToInventory={addContentToInventory} isApiAlreadyAdded={isApiAlreadyAdded} />
                                ))
                            }
                        </div>
                    </Tab>
                    <Tab eventKey="tab2" title="Import">
                        {(tierList.source === 'anilist' && ContentType[ContentType[tierList.content_type]] === ContentType.character) ? <h1>Not available for Anilist characters</h1> : <div></div>}
                        <div>
                            {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
                            <form className="d-flex mb-3">

                                <input
                                    type="text"
                                    className="form-control"
                                    value={userName}
                                    onChange={handleUserNameChange}
                                    placeholder={`AniList Username`}
                                    disabled={tierList.source === 'anilist' && ContentType[tierList.content_type] === ContentType.character}
                                />
                                <select
                                    className="form-select ml-2"
                                    value={status}
                                    onChange={handleStatusChange}
                                    disabled={tierList.source === 'anilist' && ContentType[tierList.content_type] === ContentType.character}
                                >
                                    {Object.values(AniListStatus).map((statusValue, index) => (
                                        <option key={index} value={statusValue}>{statusValue}</option>
                                    ))}
                                </select>
                                <Button className="ml-2" type="button" onClick={fetchUserList} disabled={tierList.source === 'anilist' && ContentType[tierList.content_type] === ContentType.character}>Fetch</Button>
                            </form>
                            <Button className="my-2" onClick={addAllToInventory} disabled={tierList.source === 'anilist' && ContentType[tierList.content_type] === ContentType.character}>Add All</Button>
                        </div>
                        <div className="scrollable-results py-2 w-100 h-80">
                            {userData.map(list =>
                                list.entries.map(result =>
                                    result.media && <SearchResultImport key={result.media.id} result={result.media} contentType={ContentType[tierList.content_type]} inventory={inventory} addContentToInventory={addContentToInventory} isApiAlreadyAdded={isApiAlreadyAdded} />
                                )
                            )}
                        </div>
                    </Tab>
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button className="close" variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

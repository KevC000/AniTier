import React, { useState, useEffect, useCallback } from 'react';
import {
    downvoteTierList, fetchContentModel, fetchTierList, fetchTiersFromTierList,
    fetchUserVoteStatus, upvoteTierList
} from '../../utils/internal_apis/tierlist_apis';
import { fetchUserDataById, fetchUserState } from '../../utils/internal_apis/auth_api';
import './activity_tierlist_column.scss';

const initialTierList = { upvotes: 0, downvotes: 0 };

export default function ActivityTierListColumn({ tierListId }) {

    const [tierList, setTierList] = useState(initialTierList);
    const [tiers, setTiers] = useState([]);
    const [tierListOwner, setTierListOwner] = useState({});
    const [user, setUser] = useState(null);
    const [contentImages, setContentImages] = useState([]);
    const [userVote, setUserVote] = useState(null);
    const [votes, setVotes] = useState(0);

    const fetchTiers = useCallback(async () => {
        try {
            const data = await fetchTiersFromTierList(tierListId);
            setTiers(data);
            return data;
        } catch (error) {
            console.error(error);
        }
    }, [tierListId]);

    const fetchImages = useCallback(async (tiers) => {
        let contentIds = tiers.flatMap(tier => tier.content_ids);
        try {
            let images = await Promise.all(contentIds.map(async id => {
                const content = await fetchContentModel(id);
                return content.image_url;
            }));
            setContentImages(images);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const fetchTierListData = useCallback(async () => {
        try {
            const data = await fetchTierList(tierListId);
            setTierList(data);
            setVotes(data.upvotes - data.downvotes);
        } catch (error) {
            console.error(error);
        }
    }, [tierListId]);

    const fetchUser = useCallback(async () => {
        const userData = await fetchUserState();
        setUser(userData);
    }, []);

    const fetchVoteStatus = useCallback(async () => {
        if (user && user.user_id) {
            const voteStatus = await fetchUserVoteStatus(tierListId, user.user_id);
            setUserVote(voteStatus.upvoted ? 'up' : voteStatus.downvoted ? 'down' : null);
        }
    }, [tierListId, user]);

    const fetchTierListOwner = useCallback(async () => {
        if (tierList.user_id) {
            const userData = await fetchUserDataById(tierList.user_id);
            setTierListOwner(userData);
        }
    }, [tierList]);

    const handleVote = useCallback(async (direction) => {
        try {
            const voteAction = direction === 'up' ? upvoteTierList : downvoteTierList;
            await voteAction(tierListId, user.user_id);
            setUserVote(direction);
            fetchTierListData();
        } catch (error) {
            console.error(error);
        }
    }, [tierListId, user, fetchTierListData]);

    const handleUpvote = () => handleVote('up');
    const handleDownvote = () => handleVote('down');

    const handleTierListClick = () => {
        window.location.href = `/tierlist/${tierListId}`;
    };

    useEffect(() => {
        fetchUser();
        fetchTierListData();
    }, [fetchUser, fetchTierListData]);

    useEffect(() => {
        fetchTiers().then(fetchImages);
    }, [fetchTiers, fetchImages]);

    useEffect(() => {
        fetchVoteStatus();
    }, [fetchVoteStatus]);

    useEffect(() => {
        fetchTierListOwner();
    }, [fetchTierListOwner]);

    return (
        <div className="column card col-12 mx-2 my-1 bg-white">
            <div className="row align-items-center">
                {user && user.logged_in && (
                    <div className="vote-section col-1">
                        <button onClick={handleUpvote}>
                            <i className={`button-arrow up ${userVote === 'up' ? 'highlight' : ''}`}></i>
                        </button>
                        {votes}
                        <button onClick={handleDownvote}>
                            <i className={`button-arrow down ${userVote === 'down' ? 'highlight' : ''}`}></i>
                        </button>
                    </div>
                )}
                <div className={`info ${(user && user.logged_in) ? 'col-11' : 'col-12'}`} onClick={handleTierListClick}>
                    <h5 className='card-title'>{tierList.title}</h5>
                    <p>by <a href={`/user/${tierListOwner.id}`}>{tierListOwner.username}</a></p>
                    <p style={{
                        display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical',
                        overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>{tierList.description}</p>
                    <div className="images-row row">
                        {contentImages.slice(0, 6).map((image, index) => (
                            <div className='col-2 col-lg-1 p-0 img-container' key={index}>
                                <img className='image' src={image} alt="content" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

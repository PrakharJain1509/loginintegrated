import React, { useState, useEffect,useRef } from 'react';
import CrossIcon from './cross.png';
import GalleryIcon from './gallery.png';
import GifIcon from './gif.png';
import PollIcon from './poll.png';
import axios from 'axios';

const PostPage = ({ switchToDashboard, users }) => {
    const colorNameMap = {
        '#88FD88B7': 'green',
        '#76fd76': 'green',
        '#AA89FFB7': 'purple',
        '#9b76ff': 'purple',
        '#FFF189B7': 'yellow',
        '#ffef76': 'yellow',
        '#FF8989B7': 'red',
        '#FF7676FF': 'red',
        '#89E7FFB7': 'blue',
        '#76cfff': 'blue',
        '#FC85BDB7': 'pink',
        '#ff76b3': 'pink',
    };
    const [newContent, setNewContent] = useState('');
    const [items, setItems] = useState([]);
    const [mentionedUsers, setMentionedUsers] = useState([]);
    const [suggestedMentionedUsers, setSuggestedMentionedUsers] = useState([]);
    const [selectedStickyNoteColorIndex, setSelectedStickyNoteColorIndex] = useState(0);
    const [showStickyNote, setShowStickyNote] = useState(true);
    const [showPollLayout, setShowPollLayout] = useState(false);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']);
    const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image
    const [showTextarea, setShowTextarea] = useState(true); // State to store the selected image
    const [gifData, setGifData] = useState([]);
    const [showGifPopup, setShowGifPopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [offset, setOffset] = useState(0);
    const gifPopupRef = useRef(null);
    const [selectedGif, setSelectedGif] = useState(null);


    const handleItemSubmit = async () => {
        if (newContent.trim() === '') {
            return;
        }

        const token = localStorage.getItem('token');

        // Extract mentioned user's name
        const mentionedUserMatch = newContent.match(/@(\w+)/);
        const mentionedUser = mentionedUserMatch ? mentionedUserMatch[1] : null; // If no mention, set it to null

        // Get the selected color name from colorNameMap
        const selectedColorShade = stickyNoteColors[selectedStickyNoteColorIndex];
        const colorCode = colorNameMap[selectedColorShade];

        // Create the payload based on whether a mentioned user is present
        const payload = {
            content: newContent,
            color_code: colorCode,
            date_posted: new Date().toISOString(),
            author: '', // Replace with actual user info
            stickyNoteColor: selectedStickyNoteColorIndex,
        };

        // Include mentioned_user field only if mentionedUser is not null
        if (mentionedUser !== null) {
            payload.mentioned_user = mentionedUser;
        }

        try {
            const response = await axios.post('https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/posts/', payload, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            // Assuming you have a function switchToDashboard that handles navigation
            switchToDashboard(); // Redirect to the dashboard

            // Rest of the code...
        } catch (error) {
            // Handle errors here
            console.error('Error posting item:', error);
        }
    };

    const fetchUserSuggestions = async (mentionInput) => {
        try {
            const response = await axios.get('https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/users/');
            const allUsers = response.data;
            const filteredUsers = allUsers.filter((user) =>
                user.username.toLowerCase().includes(mentionInput)
            );
            const uniqueSuggestions = filteredUsers.filter((user, index, self) =>
                index === self.findIndex((u) => u.username === user.username)
            );

            setSuggestedMentionedUsers(uniqueSuggestions);
        } catch (error) {
            console.error('Error fetching user suggestions:', error);
        }
    };




    const handleMentionClick = (user) => {
        const mention = `@${user.username}`;
        const lastMentionStart = newContent.lastIndexOf('@');

        if (lastMentionStart >= 0) {
            const preMentionText = newContent.substring(0, lastMentionStart);
            const updatedContent = preMentionText + mention + ' ';
            setNewContent(updatedContent);
        } else {
            setNewContent(mention + ' ');
        }
        setMentionedUsers([...mentionedUsers, user]);
        setSuggestedMentionedUsers([]);
    };

    const getStickyNoteColor = () => {
        return stickyNoteColors[selectedStickyNoteColorIndex];
    };

    const getStickyNoteColor1 = () => {
        return stickyNoteColors1[selectedStickyNoteColorIndex];
    };

    const handleColorChange = (colorIndex) => {
        const shade1 = stickyNoteColors[colorIndex];
        const shade2 = stickyNoteColors1[colorIndex];
        const combinedColor = { shade1, shade2 };
        setSelectedStickyNoteColorIndex(colorIndex);
        const colorName = colorNameMap[shade1] || colorNameMap[shade2];
        // console.log(colorName);
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowStickyNote(window.scrollY <= 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const stickyNoteColors = [
        '#FC85BDB7',
        '#89E7FFB7',
        '#FF8989B7',
        '#FFF189B7',
        '#AA89FFB7',
        '#88FD88B7',
    ];
    const stickyNoteColors1 = [
        '#ff76b3',
        '#76cfff',
        '#FF7676FF',
        '#ffef76',
        '#9b76ff',
        '#76fd76',
    ];

    const handleInputChange = (event) => {
        const inputText = event.target.value;
        setNewContent(inputText);

        if (inputText.length >= 3 && inputText.includes('@')) {
            const lastMentionStart = inputText.lastIndexOf('@');
            const mentionInput = inputText.substring(lastMentionStart + 1).toLowerCase();
            fetchUserSuggestions(mentionInput);
        } else {
            setSuggestedMentionedUsers([]);
        }

        if (inputText.toLowerCase().includes('write your poll question here:')) {
            setShowPollLayout(true);
        } else {
            setShowPollLayout(false);
        }
    };

    const handlePollQuestionChange = (event) => {
        setPollQuestion(event.target.value);
    };

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...pollOptions];
        updatedOptions[index] = value;
        setPollOptions(updatedOptions);
    };

    const removeOption = (index) => {
        const updatedOptions = [...pollOptions];
        updatedOptions.splice(index, 1);
        setPollOptions(updatedOptions);
    };

    const addNewOption = () => {
        setPollOptions([...pollOptions, '']);
    };

    const handleCancelPoll = () => {
        setShowPollLayout(false);
        setPollQuestion('');
        setPollOptions(['', '']);
    };
    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                setShowTextarea(false); // Hide the textarea after selecting the image
            };
            reader.readAsDataURL(file);
        }
    };
    const fetchGifs = async () => {
        try {
            const API_KEY = 'xeCVW6hURo4ov1BJfQjtgUenGgfcRzOF';
            const response = await axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchQuery}&offset=${offset}`);
            setGifData((prevData) => [...prevData, ...response.data.data]);
            setOffset((prevOffset) => prevOffset + response.data.data.length);
        } catch (error) {
            console.error('Error fetching GIFs:', error);
        }
    };

    const fetchTrendingGifs = async () => {
        try {
            const API_KEY = 'xeCVW6hURo4ov1BJfQjtgUenGgfcRzOF';
            const response = await axios.get(`https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&offset=${offset}`);
            setGifData((prevData) => [...prevData, ...response.data.data]);
            setOffset((prevOffset) => prevOffset + response.data.data.length);
        } catch (error) {
            console.error('Error fetching trending GIFs:', error);
        }
    };

    useEffect(() => {
        if (showGifPopup) {
            setSearchQuery(''); // Clear search query when opening the popup
            setOffset(0); // Reset offset when opening the popup
            fetchTrendingGifs();
        }
    }, [showGifPopup]);

    useEffect(() => {
        if (showGifPopup && searchQuery.trim() !== '') {
            fetchGifs();
        } else if (showGifPopup) {
            fetchTrendingGifs();
        }
    }, [searchQuery, showGifPopup]);

    const handleGifClick = () => {
        setShowGifPopup(true);
    };

    const handleClosePopup = () => {
        setShowGifPopup(false);
        setSearchQuery(''); // Clear search query when closing popup
        setGifData([]); // Clear fetched GIFs when closing popup
        setOffset(0); // Reset offset when closing popup
    };

    const handleScroll = () => {
        const { current } = gifPopupRef;
        if (current && current.scrollTop + current.clientHeight >= current.scrollHeight - 20) {
            // Fetch more GIFs when scrolled to the bottom (with 20px buffer)
            fetchGifs();
        }
    };
    const handleGifSelection = (gifUrl) => {
        setSelectedGif(gifUrl); // Set the selected GIF URL
        setShowGifPopup(false); // Close the GIF popup
    };

    return (
        <div>
            <button onClick={switchToDashboard} style={{ position: 'absolute', top: '20px', left: '10px', background: 'none', border: 'none' }}>
                <img src={CrossIcon} alt="Close" style={{ width: '15px', height: '15px' }} />
            </button>
            <div style={{ marginTop:'100px',height:'100%'}}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    {stickyNoteColors1.map((color, index) => (
                        <div
                            key={index}
                            onClick={() => handleColorChange(index)}
                            style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: color,
                                borderRadius: '50%',
                                margin: '0 5px',
                                cursor: 'pointer',
                                border: selectedStickyNoteColorIndex === index ? '2px solid #000' : 'none',
                            }}
                        />
                    ))}
                </div>
                <div
                    style={{
                        background: getStickyNoteColor(),
                        borderRadius: '11px',
                        borderBottomLeftRadius: '30px',
                        position: showStickyNote ? 'sticky' : 'relative',
                        top: showStickyNote ? '0' : 'initial',
                        zIndex: showStickyNote ? '10' : 'auto',
                        border: '0px solid #000',
                        padding: '10px',
                        margin: '10px',
                        maxWidth: '100%',
                        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                    }}
                >
                    <div
                        style={{
                            borderBottom: '3px solid #000',
                            borderRight: '1px solid #000',
                            borderTopRightRadius: '0px',
                            borderTopLeftRadius: '30px',
                            borderBottomRightRadius: '11px',
                            borderBottomLeftRadius: '2px',
                            position: 'absolute',
                            bottom: '-0.4px',
                            left: '30.5px',
                            width: '30px',
                            height: '31px',
                            background: getStickyNoteColor1(),
                            clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% 75%)',
                            zIndex: '0',
                            transform: 'rotate(-83.6deg)',
                            transformOrigin: 'bottom left', // Set the rotation origin
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                            backgroundColor: getStickyNoteColor(),
                            opacity: '1%',
                            zIndex: '-1',
                            borderRadius: '11px',
                        }}
                    />

                    {!showPollLayout ? (
                        <textarea
                            placeholder="Start a gossip..."
                            value={newContent}
                            onChange={handleInputChange}
                            rows={Math.min(10, newContent.split('\n').length + 1)}
                            style={{ position: 'relative', zIndex: '1',backgroundColor: 'transparent',resize: 'none', marginLeft: '25px',border: 'none',borderRadius:'11px',outline: 'none', lineHeight:'1.5',width: 'calc(100% - 25px)', fontSize: '20px' , fontFamily:'Helvetica'}}
                        />
                        ) : (
                        <div>
                            <textarea
                                type="text"
                                placeholder="Write your poll question here:"
                                value={pollQuestion}
                                onChange={handlePollQuestionChange}
                                rows={Math.min(10, pollQuestion.split('\n').length + 1)}
                                style={{ position: 'relative', zIndex: '1',backgroundColor: 'transparent',resize: 'none', marginLeft: '25px',border: 'none',borderRadius:'11px',outline: 'none', lineHeight:'1.5',width: 'calc(100% - 25px)',height:'auto', fontSize: '20px' , fontFamily:'Helvetica'}}

                            />
                            <div>
                                {pollOptions.map((option, index) => (
                                    <div key={index}>
                                        <textarea
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            style={{ bottom:'5px',position: 'relative', zIndex: '1',backgroundColor: 'transparent',resize: 'none', marginLeft: '25px',border: '1px solid grey',borderRadius:'11px',outline: 'none', lineHeight:'1.5',width: 'calc(100% - 80px)',height: '30px', fontSize: '20px' , fontFamily:'Helvetica'}}

                                        />
                                        <button onClick={() => removeOption(index)} style={{backgroundColor:'transparent',border: 'none',position:'relative',bottom:'17px'}}><img src={CrossIcon} alt="Close" style={{ width: '12px', height: '12px' }} /></button>
                                    </div>
                                ))}
                                <button onClick={addNewOption}
                                 style={{ bottom:'5px', color:'rgba(33,33,33,0.77)', position: 'relative', zIndex: '1',backgroundColor: 'transparent',resize: 'none', marginLeft: '25px',border: '1px dashed grey',borderRadius:'11px',outline: 'none', lineHeight:'1.5',width: 'calc(100% - 75px)',height:'35px', fontSize: '20px' , fontFamily:'Helvetica'}}
                                ><b>Add Option</b></button>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',position:'relative',bottom:'13px' }}>
                                    <p style={{ color: 'rgba(33, 33, 33, 0.77)', position:'relative',left:'27px',fontSize: '16px', fontFamily: 'Helvetica' }}>Ends in 24h</p>
                                <button onClick={handleCancelPoll}
                                style={{color:'rgba(33,33,33,0.77)',backgroundColor:'transparent',border: 'none',position:'relative',right:'45px',fontSize: '16px' , fontFamily:'Helvetica', float:'right'}}
                                ><b>Remove poll</b></button>
                                </div>
                            </div>
                        </div>
                    )}



                    {selectedImage && (
                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'inline-block', position: 'relative' }}>
                            <img
                                src={selectedImage}
                                alt="Selected Image"
                                style={{ maxWidth: '100%', height: 'auto', borderRadius: '11px' }}
                            />
                                <button
                                    onClick={() => {
                                        setSelectedImage(null); // Clear selected image on button click
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '0px',
                                        right: '0px',
                                        backgroundColor: '#fff',
                                        border: 'none',
                                        padding: '5px',
                                        cursor: 'pointer',
                                        borderTopRightRadius: '11px',
                                        borderBottomLeftRadius:'20px',
                                        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                    }}
                                >
                                    <img
                                        src={CrossIcon}
                                        alt="Close"
                                        style={{ width: '20px', height: '20px' }}
                                    />
                                </button>
                            </div>
                        </div>
                    )}
                    {selectedGif && (
                        <div style={{ position: 'relative',textAlign: 'center', }}>
                            <div style={{ display: 'inline-block', position: 'relative' }}>
                                <img
                                    src={selectedGif}
                                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '11px' }}
                                />
                                <button
                                    onClick={() => {
                                        setSelectedGif(null); // Clear selected image on button click
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '0px',
                                        right: '0px',
                                        backgroundColor: '#fff',
                                        border: 'none',
                                        padding: '5px',
                                        cursor: 'pointer',
                                        borderTopRightRadius: '11px',
                                        borderBottomLeftRadius:'20px',
                                        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                    }}
                                >
                                    <img
                                        src={CrossIcon}
                                        alt="Close"
                                        style={{ width: '20px', height: '20px' }}
                                    />
                                </button>
                            </div>
                        </div>
                    )}
                    {!selectedGif && (
                    <button  style={{ position: 'relative', top: '0px', left: '40px', background: 'none', border: 'none' }}>
                        <label htmlFor="fileInput">
                            <img src={GalleryIcon}  style={{ width: '28px', height: '28px' }} />
                        </label>
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            style={{ display: 'none' }}
                        />
                    </button>
                        )}

                    {!selectedImage && (
                    <button  onClick={handleGifClick} style={{ position: 'relative', top: '0px', left: '40px', background: 'none', border: 'none' }}>
                        <img src={GifIcon}  style={{ width: '28px', height: '28px' }} />
                    </button>
                    )}
                    {showGifPopup && (
                        <div ref={gifPopupRef} onScroll={handleScroll} className="gif-popup" style={{overflowY:'scroll',position: 'fixed', bottom: -1, left: 0, height:'99%',width: '100%', backgroundColor: 'white',  zIndex: '100',borderTopRightRadius:'20px',borderTopLeftRadius:'20px', border:'0px solid #000',boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)'}}>
                            <button onClick={handleClosePopup} style={{ position: 'absolute', top: '10px', right: '5px', background: 'none', border: 'none', cursor: 'pointer' }}>
                                <img src={CrossIcon} alt="Close" style={{ width: '18px', height: '18px' }} />
                            </button>
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Powered by GIPHY"
                                   style={{paddingLeft: '18px',
                                       fontFamily: 'Helvetica',
                                       width: 'calc(100% - 22px)',
                                       height: '40px',
                                       background: '#efefef',
                                       border: '1px solid #ccc',
                                       fontSize: '20px',
                                       borderRadius: '11px',
                                   position:'relative',
                                   top:'40px'}} />
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',margin:'5px',marginTop:'50px' }}>
                                {gifData.map((gif) => (
                                    <div key={gif.id} style={{ width: '48%', marginBottom: '10px', }}>
                                        <img src={gif.images.fixed_height.url} alt={gif.title} onClick={() => handleGifSelection(gif.images.fixed_height.url)}
                                             style={{ width: '100%', borderRadius: '11px' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    {!showPollLayout && (<button  onClick={() => setShowPollLayout(true)} style={{ position: 'relative', top: '0px', left: '40px', background: 'none', border: 'none' }}>
                        <img src={PollIcon}  style={{ width: '28px', height: '28px' }} />
                    </button>
                        )}
                </div>
                <div>
                    {suggestedMentionedUsers.length > 0 && (
                        <ul>
                            {suggestedMentionedUsers.map((user, index) => (
                                <li key={index} style={{ display: 'flex', alignItems: 'center',borderBottom: '1px solid #ccc', padding: '0px 0',position: 'relative',left: '-20px' }} onClick={() => handleMentionClick(user)}>
                                    <img src={user.image} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
                                    <div style={{ flex: '1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ fontFamily: 'Helvetica', color: '#000', fontSize: '17px' ,position: 'relative',top:'4px', margin: '10px'}}><b>@{user.username}</b></p>
                                            <p style={{ fontFamily: 'Helvetica',color: '#8f8f8f',position: 'relative',top:'-2px', fontSize: '17px', margin: '10px' }}>{user.name}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button onClick={handleItemSubmit} style={{ position: 'absolute', top: '20px', right: '10px', background: '#000', color: '#fff', border: 'none', borderRadius: '11px', padding: '6px 12px', fontSize: '20px', cursor: 'pointer', fontFamily:'Helvetica' }}><b>Post</b></button>
            </div>
        </div>
    );
};

export default PostPage;

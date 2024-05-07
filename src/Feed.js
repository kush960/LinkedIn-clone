import React, { useState, useEffect } from 'react';
import "./Feed.css";
import CreateIcon from "@mui/icons-material/Create";
import InputOption from './InputOption';
import ImageIcon from "@mui/icons-material/Image";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarViewDayIcon from "@mui/icons-material/CalendarViewDay";
import Post from './Post';
import { db, storage } from "./firebase";
import firebase from "firebase";
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice';
import FlipMove from "react-flip-move";
import imageCompression from "browser-image-compression";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import PhotoRoundedIcon from "@mui/icons-material/PhotoRounded";
import SendIcon from '@mui/icons-material/Send';
import { Chip, LinearProgress } from "@mui/material";
import { v4 as uuid } from "uuid";

const Feed = () => {
    const { user } = useSelector(selectUser);

    const [posts, setPosts] = useState([]);
    const [progress, setProgress] = useState("");
    const [uploadData, setUploadData] = useState({
        input: "",
        file: {
            type: "",
            name: "",
            data: "",
        },
    });

    useEffect(() => {
        db.collection("posts")
            .orderBy("timestamp", "desc")
            .onSnapshot(snapshot =>
                setPosts(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                )
            );
    }, []);

    const sendPost = (e) => {
        e.preventDefault();
        // verify atleast one of the input fields are not empty
        if (uploadData.input || uploadData.file.data) {
            // if file input is true...upload the file to Fire-Store
            if (uploadData.file.data) {
                const id = uuid();
                const uploadTask = storage.ref(`posts/${id}`).putString(uploadData.file.data, "data_url");
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const value = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        setProgress(value);
                    },

                    (error) => {
                        alert(error);
                    },

                    () => {
                        storage
                            .ref("posts")
                            .child(id)
                            .getDownloadURL()
                            .then((url) => uploadToFirebaseDB(url));
                    }
                );

                // do not go further..
                return;
            }
            uploadToFirebaseDB(uploadData.file.data)
        }
        else {
            alert("😕 Input field can not be empty");
        }
    };

    const uploadToFirebaseDB = (fileData) => {
        db.collection("posts").add({
            name: user.displayName,
            description: user.email,
            message: uploadData.input,
            photoUrl: user.photoUrl || "",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            fileType: uploadData.file.type,
            fileName: uploadData.file.name,
            fileData: fileData,
        }).then(() => resetState());
    }



    // if file name is too long.. compress it
    const fileNameCompressor = (str, limit) => {
        let fileName = str;
        const arr = str.split(".");
        const name = arr[0];
        const ext = arr[arr.length - 1];

        if (name.length > limit) {
            fileName = name.substring(0, limit).trim() + "... ." + ext;
        }
        return fileName;
    };

    const imageuploadHandler = async (e, type) => {
        const inputFile = e.target.files[0];
        const _inputFile = inputFile.type.split("/");
        const inputFileType = _inputFile[0];
        const inputFileExec = _inputFile[1];
        const inputFileName = fileNameCompressor(inputFile.name, 20);

        const fileSize = inputFile.size / (1024 * 1024);

        const acceptedImageFormats = ["png", "jpg", "jpeg", "gif"];
        const acceptedVideoFormats = ["mp4", "mkv", "3gp", "avi", "webm"];

        switch (type) {
            case "video":
                if (!acceptedVideoFormats.some((format) => format.includes(inputFileExec))) {
                    alert("🔴 Please select video format of mp4 , mkv , av ");
                    e.target.value = "";
                    return;
                }
                if (fileSize > 10) {
                    alert("🔴 Please select a video less than 10MB file size");
                    e.target.value = "";
                    return;
                }
                break;
            case "image":
                if (!acceptedImageFormats.some((format) => format.includes(inputFileExec))) {
                    alert("🔴 Please select image format of png , jpg , jpeg , gif ");
                    e.target.value = "";
                    return;
                }
                if (fileSize > 2) {
                    alert("🔴 Please select an image less than 2MB file size");
                    e.target.value = "";
                    return;
                }
                break;
            default:
                alert("😮 OOPS...!!! Invalid file format");
                e.target.value = "";
                return;
        }

        let compressedInputFile = inputFile;
        if (inputFileType === "image") {
            //compression algorithm
            const compressionOptions = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            };

            try {
                compressedInputFile = await imageCompression(inputFile, compressionOptions);
            } catch (error) {
                alert(error);
            }
        }

        let inputFileDataBase64;
        const file = new FileReader();
        if (compressedInputFile) {
            file.onloadend = (fileLoadedEvent) => {
                inputFileDataBase64 = fileLoadedEvent.target.result;
                setUploadData({
                    ...uploadData,
                    file: {
                        type: inputFileType,
                        name: inputFileName,
                        data: inputFileDataBase64,
                    },
                });
            };
            file.readAsDataURL(compressedInputFile);
        }

        // clear the file input event value
        e.target.value = "";

    }

    const resetState = () => {
        setUploadData({
            input: "",
            file: {
                type: "",
                name: "",
                data: "",
            },
        });
        setProgress("");
    };

    return (
        <div className="feed">
            <div className="feed__inputContainer">
                <div className="feed__input">
                    <CreateIcon />
                    <form>
                        <input type="text"
                            value={uploadData.input}
                            onChange={(e) => setUploadData({ ...uploadData, input: e.target.value })}
                        />
                        <input type="file"
                            id="upload-image"
                            accept="image/*"
                            hidden
                            onChange={(e) => imageuploadHandler(e, "image")}
                        />
                        <input type="file"
                            id="upload-video"
                            accept="video/*"
                            hidden
                            onChange={(e) => imageuploadHandler(e, "video")}
                        />
                        <button onClick={sendPost} type='submit'><SendIcon /></button>
                    </form>
                </div>

                {uploadData.file.name && !progress && (
                    <div className='feed__input__selectedfile'>
                        <Chip
                            color="primary"
                            size="small"
                            onDelete={resetState}
                            icon={uploadData.file.type === "image" ? <PhotoRoundedIcon /> : <VideocamRoundedIcon />}
                            label={uploadData.file.name}
                        />
                    </div>
                )}

                {progress && (
                    <div className='feed__input__progress'>
                        <LinearProgress variant="determinate" value={progress} />
                        <p>{progress} %</p>
                    </div>
                )}

                <div className="feed__inputOptions">
                    <label htmlFor="upload-image">
                        <InputOption title="Photo" Icon={ImageIcon} color="#70B5F9" />
                    </label>
                    <label htmlFor="upload-video">
                        <InputOption title="Video" Icon={SubscriptionsIcon} color="#E7A33E" />
                    </label>
                    <label>
                        <InputOption title="Event" Icon={EventNoteIcon} color="#C0CBCD" />
                    </label>
                    <label>
                        <InputOption
                            title="Write article"
                            Icon={CalendarViewDayIcon}
                            color="#7FC15E"
                        />
                    </label>
                </div>
            </div>

            <FlipMove>
                {posts.map(({ id, data: { name, description, message, photoUrl, fileType, fileData } }) => (
                    <Post
                        key={id}
                        name={name}
                        description={description}
                        message={message}
                        photoUrl={photoUrl}
                        fileType={fileType}
                        fileData={fileData}
                    />
                ))}
            </FlipMove>

        </div >
    )
}

export default Feed;
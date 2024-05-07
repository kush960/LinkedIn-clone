import { Avatar } from '@mui/material';
import React, { forwardRef } from 'react';
import InputOption from './InputOption';
import "./Post.css";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import ReactPlayer from "react-player";

const Post = forwardRef(({ name, description, message, photoUrl, fileType, fileData }, ref) => {

    return (
        <div ref={ref} className="post">
            <div className="post__header">
                <Avatar src={photoUrl}>{name[0].toUpperCase()}</Avatar>
                <div className="post__info">
                    <h2>{name}</h2>
                    <p>{description}</p>
                </div>
            </div>

            <div className="post__body">
                <p>{message}</p>

                {fileData && fileType === "image" && (
                    <img src={fileData} alt="post" />
                )}
                {fileData && fileType === "video" && (
                    <ReactPlayer url={fileData} controls={true} />
                )}
            </div>
            {/* <hr /> */}
            <div className="post__buttons">
                <InputOption Icon={ThumbUpAltOutlinedIcon} title="Like" color="gray" />
                <InputOption Icon={ChatOutlinedIcon} title="Comment" color="gray" />
                <InputOption Icon={ShareOutlinedIcon} title="Share" color="gray" />
                <InputOption Icon={SendOutlinedIcon} title="Send" color="gray" />
            </div>

        </div>
    )
})

export default Post;
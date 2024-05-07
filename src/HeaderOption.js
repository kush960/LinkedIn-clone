import { Avatar,Tooltip } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice';
import "./HeaderOption.css";

const HeaderOption = ({ avatar, Icon, title, onClick }) => {
    const { user } = useSelector(selectUser);

    return (
        <div className="headerOption" onClick={onClick}>
            {Icon && <Icon className="headerOption_icon" />}
            {avatar &&
               <Tooltip title="Sign-Out" arrow>
                <Avatar
                    className='headerOption__icon'
                    src={user?.photoUrl}
                    style={{fontSize:"10px"}}
                >
                     {user?.email[0].toUpperCase()}
                </Avatar>
                </Tooltip>
            }

            <h3 className='headerOption__title'>{title}</h3>
        </div>
    )
}

export default HeaderOption;
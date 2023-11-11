import React from 'react';
import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';

const UserVideoComponent = (props) => {

    return (
        <div>
            {props.streamManager !== undefined ? (
                <div className="streamcomponent">
                    <OpenViduVideoComponent streamManager={props.streamManager} />
                </div>
            ) : null}
        </div>
    );
}

export default UserVideoComponent;

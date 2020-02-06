import React from 'react';

import {useMsgDispatch} from './MessageContext';
import Sender from './Sender';
import DateTime from './DateTime';

const Message = ({index, msgData}) => {
  const msgDispatch = useMsgDispatch();
  //console.debug(`msgData: `, msgData);

  const deleteMsg = (e) => {
    msgDispatch({type: 'rmIndex', index: index});
  };

  return (
    <li
      key={index + msgData.uuid + msgData.content}
      className={`chatMessage ${index % 2 ? 'even' : ''}`}
    >
      <div className='msgHeader'>
        <Sender senderId={msgData.senderUuid} />
        <DateTime timestamp={msgData.sentAt} />
      </div>
      <div className='msgContent'>Message: {msgData.content}</div>
      <div className='msgControls'>
        <div className='msgDelete button' onClick={deleteMsg}>
          Delete Message
        </div>
      </div>
    </li>
  );
};

export default Message;

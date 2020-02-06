import React from 'react';

const Sender = ({senderId}) => {
  return (
    <div className='msgSender'>
      <img
        className='senderAvatar'
        src={`https://robohash.org/react-2dhzpp-${senderId}.png?size=30x30&set=set4`}
        alt={`${senderId} Avatar`}
        title={senderId}
      />
      <div className='senderId'>Sender: {senderId}</div>
    </div>
  );
};

export default Sender;

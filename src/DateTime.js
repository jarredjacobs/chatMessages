import React from 'react';
import Moment from 'react-moment';

const DateTime = ({timestamp}) => {
  return (
    <div className='msgTime'>
      <Moment format='dddd, MMMM DD, YYYY \a\t HH:mma '>{timestamp}</Moment>
    </div>
  );
};

export default DateTime;

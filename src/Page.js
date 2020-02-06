import React, {useReducer, useEffect} from 'react';
import {
  faForward,
  faBackward,
  faSortDown,
  faSortUp,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {useMsgState, useMsgDispatch} from './MessageContext';
import Message from './Message';

// default/initial number of messages per page
const pageMsgLimit = 5;

const getPageMsgs = (pageNum, msgPerPage) => {
  const pageMsgStart = pageNum * msgPerPage;
  const pageMsgEnd = pageMsgStart + msgPerPage;
  //console.debug(`pageMsgStart: ${pageMsgStart}; pageMsgEnd: ${pageMsgEnd}`);
  return {start: pageMsgStart, end: pageMsgEnd};
};

const getMaxPageNum = (msgCount, msgPerPage) => {
  // 0 indexed
  return msgCount ? Math.floor((msgCount - 1) / msgPerPage) : 0;
};

const initPage = (msgList) => {
  const pageMsgs = getPageMsgs(0, pageMsgLimit);
  const maxPageNum = getMaxPageNum(msgList.length, pageMsgLimit);
  const pageObj = {
    pageNum: 0, // 0 indexed
    maxPageNum: maxPageNum,
    firstPage: true,
    lastPage: maxPageNum ? false : true,
    msgPerPage: pageMsgLimit,
    pageMsgs,
  };
  console.debug(`inital pageObj: `, pageObj);
  return pageObj;
};

const pageHandler = (state, action) => {
  console.debug(`Page Action: `, action);
  console.debug(`Page State: `, state);
  switch (action.type) {
    case 'nextPage':
      if (state.pageNum < state.maxPageNum) {
        const pageNum = state.pageNum + 1;

        let firstPage = false;
        if (pageNum === 0) {
          firstPage = true;
        }
        let lastPage = false;
        if (pageNum === state.maxPageNum) {
          lastPage = true;
        }

        const newState = {
          ...state,
          pageNum,
          firstPage,
          lastPage,
          pageMsgs: getPageMsgs(pageNum, state.msgPerPage),
        };
        console.debug(`New State: `, newState);
        return newState;
      }
      break;
    case 'prevPage':
      if (state.pageNum > 0) {
        const pageNum = state.pageNum - 1;

        let firstPage = false;
        if (pageNum === 0) {
          firstPage = true;
        }
        let lastPage = false;
        if (pageNum === state.maxPageNum) {
          lastPage = true;
        }

        const newState = {
          ...state,
          pageNum,
          firstPage,
          lastPage,
          pageMsgs: getPageMsgs(pageNum, state.msgPerPage),
        };
        console.debug(`New State: `, newState);
        return newState;
      }
      break;
    case 'updateMaxPageNum':
      let lastPage = false;
      if (state.pageNum === action.maxPageNum) {
        lastPage = true;
      }
      const newState = {
        ...state,
        lastPage,
        maxPageNum: action.maxPageNum,
      };
      console.debug(`New State: `, newState);
      return newState;
    default:
      break;
  }
  return state;
};

const Page = () => {
  const msgDispatch = useMsgDispatch();
  const msgState = useMsgState();
  const {msgList} = msgState;
  console.debug(`Page msgList: `, msgList);

  const [page, pageDispatch] = useReducer(pageHandler, msgList, initPage);

  const maxPageNum = getMaxPageNum(msgList.length, page.msgPerPage);
  console.debug(`msgList Length: ${msgList.length}; maxPageNum: ${maxPageNum}`);

  // Actions
  const nextPage = (e) => {
    pageDispatch({type: 'nextPage'});
  };
  const prevPage = (e) => {
    pageDispatch({type: 'prevPage'});
  };
  const sortMsgs = (e) => {
    msgDispatch({type: 'sort'});
  };

  useEffect(() => {
    pageDispatch({type: 'updateMaxPageNum', maxPageNum: maxPageNum});
    if (page.pageNum > maxPageNum) {
      // Auto navigate to the previous page after deleting the last message on the current page
      pageDispatch({type: 'prevPage'});
    }
  }, [maxPageNum, page]);

  useEffect(() => {
    // Initial sort
    msgDispatch({type: 'sort', sortAsc: true});
  }, [msgDispatch]);

  return (
    <div className='chatMessages'>
      <h2 className='chatTitle'>Chat Messages</h2>
      <div className='chatHeader'>
        <div
          className='sortMessages'
          onClick={sortMsgs}
          title={
            msgState.sortAsc ? `Sorted Oldest first` : `Sorted Newest first`
          }
        >
          Sorted{' '}
          <FontAwesomeIcon icon={msgState.sortAsc ? faSortUp : faSortDown} />
        </div>
      </div>
      <ul className='messagesList'>
        {msgList
          .slice(page.pageMsgs.start, page.pageMsgs.end)
          .map((msgObj, index) => {
            let msgIndex = index + page.pageMsgs.start;
            return <Message index={msgIndex} msgData={msgObj} />;
          })}
      </ul>

      <div className='pageControls'>
        {(!page.firstPage && (
          <div className='prevPage button' onClick={prevPage}>
            <FontAwesomeIcon icon={faBackward} /> Prev Page
          </div>
        )) || <div></div>}
        <div className='pageNumber'>
          Page: {page.pageNum + 1} / {maxPageNum + 1}
        </div>
        {(!page.lastPage && (
          <div className='nextPage button' onClick={nextPage}>
            Next Page <FontAwesomeIcon icon={faForward} />
          </div>
        )) || <div></div>}
      </div>
    </div>
  );
};

export default Page;

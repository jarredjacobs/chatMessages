import React, {useReducer, useContext} from 'react';
// This is the list of messages.
import {messages} from './data.json';
console.debug(`JSON messages: `, messages);

const MsgContext = React.createContext();
const MsgDispatchContext = React.createContext();

const dedupMsgs = (messages) => {
  const uniqueMsgs = new Map();
  messages.map((msg) =>
    uniqueMsgs.set(JSON.stringify({uuid: msg.uuid, content: msg.content}), msg)
  );
  console.debug(`uniqueMsgs: `, uniqueMsgs);
  return {msgList: Array.from(uniqueMsgs.values())};
};

// Define a reducer for handling message state
const handleMessages = (state, action) => {
  console.debug(`State: `, state);
  console.debug(`Action: `, action);
  switch (action.type) {
    case 'rmIndex':
      const delIndex = action.index;
      return {
        msgList: [
          ...state.msgList.slice(0, delIndex),
          ...state.msgList.slice(delIndex + 1),
        ],
      };
    case 'sort':
      let sortAsc = true;
      if (
        typeof action.sortAsc === 'undefined' &&
        typeof state.sortAsc !== 'undefined'
      ) {
        // toggle exisitng sort order
        sortAsc = !state.sortAsc;
      } else if (action.sortAsc) {
        // use specified sort order
        sortAsc = action.sortAsc;
      }
      const msgList = [...state.msgList].sort((a, b) => {
        if (sortAsc) {
          return a.sentAt > b.sentAt;
        } else {
          return b.sentAt > a.sentAt;
        }
      });
      const newState = {msgList, sortAsc};
      console.debug(`new State: `, newState);
      return newState;
    default:
      console.debug(`No Action`);
      return state;
  }
};

const MsgProvider = ({children}) => {
  const [messageList, msgDispatch] = useReducer(
    handleMessages,
    messages,
    dedupMsgs
  );

  return (
    <MsgContext.Provider value={messageList}>
      <MsgDispatchContext.Provider value={msgDispatch}>
        {children}
      </MsgDispatchContext.Provider>
    </MsgContext.Provider>
  );
};

const useMsgState = () => {
  const context = useContext(MsgContext);

  return context;
};

const useMsgDispatch = () => {
  const context = useContext(MsgDispatchContext);

  return context;
};

export {MsgProvider, useMsgState, useMsgDispatch};

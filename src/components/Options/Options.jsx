import { useState, useContext } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { SocketContext } from "../../SocketContext";

export const Options = ({ children }) => {
  const { myId, callAccepted, callEnded, name, setName, callUser, leaveCall } =
    useContext(SocketContext);

  const [idToCall, setIdToCall] = useState("");
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        noValidate
        autoComplete="off"
      >
        <hr />
        <div>
          <div>Your Info</div>
          <input
            aria-label="Name"
            label="Name"
            value={name}
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          {console.log(myId)}
          <CopyToClipboard text={myId}>
            <button>Click to Copy Your ID to Share</button>
          </CopyToClipboard>
        </div>
        <hr />
        <div>
          <div>Call Your Buddy by entering his ID</div>
          <input
            aria-label="Id to call"
            label="Id to call"
            value={idToCall}
            type="text"
            onChange={(e) => {
              setIdToCall(e.target.value);
            }}
          />
          {callAccepted && !callEnded ? (
            <button onClick={leaveCall}>End Call</button>
          ) : (
            <button onClick={() => callUser(idToCall)}>Start Call</button>
          )}
        </div>
      </form>
      {children}
    </div>
  );
};

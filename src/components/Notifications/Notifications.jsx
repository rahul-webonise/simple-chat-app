import { useContext } from "react";
import { SocketContext } from "../../SocketContext";

export const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);
  return (
    <div>
      {call?.isReceivedCall && !callAccepted && (
        <>
          <div>
            <strong>{call?.name || "Anonymous"} is calling...</strong>
          </div>
          <button onClick={answerCall}>Pick Call</button>
        </>
      )}
    </div>
  );
};

import { useContext } from "react";
import { SocketContext } from "../../SocketContext";

export const VideoPlayer = () => {
  const {
    stream,
    call,
    callAccepted,
    callEnded,
    name,
    myVideo,
    otherUserVideo,
  } = useContext(SocketContext);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          border: "1px solid",
          width: "50%",
          display: stream ? "block" : "none",
        }}
      >
        <div>{name || "Anonymous"}</div>
        <video width="100%" playsInline muted ref={myVideo} autoPlay />
      </div>
      <div
        style={{
          border: "1px solid",
          width: "50%",
          display: callAccepted && !callEnded ? "block" : "none",
        }}
      >
        <div>{call?.name || "Anonymous"}</div>
        <video width="100%" playsInline ref={otherUserVideo} autoPlay />
      </div>
    </div>
  );
};

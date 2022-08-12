import { createContext, useState, useRef, useEffect } from "react";

import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

const socket = io("https://the-meet-clone.herokuapp.com/");

const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [myId, setMyId] = useState("");
  const [call, setCall] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");

  const myVideo = useRef({ srcObject: null });
  const otherUserVideo = useRef({ srcObject: null });
  const connectionRef = useRef();

  useEffect(() => {
    socket.on("myid", (myclientId) => {
      setMyId(myclientId);
    });
  }, [myId]);
  // on mount and once the stream is available, store my client id on state

  useEffect(() => {
    // on mount of the component the request to video and audio permission should be asked by browser
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        // once permissions are granted we get the our video and audio Stream from our camera and microphone, store it in a state and a ref
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;

        socket.on("calluser", ({ from, name: callerName, signal }) => {
          setCall({ isReceivedCall: true, from, name: callerName, signal });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    // create a peer variable of the other user peer connection
    // initiator: true peers, it fires right away. For initatior: false peers, it fires when the remote offer is received.
    // trickle - set to false to disable trickle ICE and get a single 'signal' event (slower)
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answercall", { signal: data, to: call.from });
    });

    //other user stream event handler, gets us the data of other user video audio stream
    peer.on("stream", (currentStream) => {
      otherUserVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    // create a peer variable of us, we are the person calling
    // initiator: true peers, it fires right away. For initatior: false peers, it fires when the remote offer is received.
    // trickle - set to false to disable trickle ICE and get a single 'signal' event (slower)
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("calluser", {
        userToCall: id,
        signalData: data,
        from: myId,
        name,
      });
    });

    //other user stream event handler, gets us the data of other user video audio stream
    peer.on("stream", (currentStream) => {
      otherUserVideo.current.srcObject = currentStream;
    });

    socket.on("callaccepted", (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallAccepted(false);
    setCallEnded(true);
    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        stream,
        myId,
        call,
        callAccepted,
        callEnded,
        name,
        setName,
        myVideo,
        otherUserVideo,
        answerCall,
        callUser,
        leaveCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };

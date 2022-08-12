import { VideoPlayer } from "./components/VideoPlayer/VideoPlayer";
import { Options } from "./components/Options/Options";
import { Notifications } from "./components/Notifications/Notifications";

const App = () => {
  return (
    <div>
      <VideoPlayer />
      <Options>
        <Notifications />
      </Options>
    </div>
  );
};

export default App;

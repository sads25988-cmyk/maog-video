import { Composition } from "remotion";
import { Storyboard } from "./moaj/Storyboard";
import { ensureFonts } from "./moaj/fonts";
import { FPS, H, W } from "./moaj/theme";

ensureFonts();

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MoajStoryboard"
        component={Storyboard}
        durationInFrames={10}
        fps={FPS}
        width={W}
        height={H}
      />
    </>
  );
};

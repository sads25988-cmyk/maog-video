import { Composition } from "remotion";
import { Storyboard } from "./moaj/Storyboard";
import { StyleFrames } from "./pixel/StyleFrames";
import { Story, STORY_FRAMES } from "./pixel/Story";
import { BacteriaAd, BACTERIA_FRAMES } from "./anime/BacteriaAd";
import { ensureFonts } from "./moaj/fonts";
import { FPS, H, W } from "./moaj/theme";

ensureFonts();

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="BacteriaAd" component={BacteriaAd} durationInFrames={BACTERIA_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="MoajStory" component={Story} durationInFrames={STORY_FRAMES} fps={FPS} width={W} height={H} />
      <Composition
        id="MoajStoryboard"
        component={Storyboard}
        durationInFrames={10}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition id="PixelStyle" component={StyleFrames} durationInFrames={3} fps={FPS} width={W} height={H} />
    </>
  );
};

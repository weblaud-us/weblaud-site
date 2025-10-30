import Discuss from "~/components/discuss";
import OurMissionAndStory from "~/components/ourMissionAndStory";
import OurTrack from "~/components/ourTrack";
import TheTeam from "~/components/theTeam";

const AboutUs = () => {
  return (
    <div>
      <OurMissionAndStory />
      <OurTrack />
      <TheTeam />
      <Discuss />
    </div>
  );
};

export default AboutUs;

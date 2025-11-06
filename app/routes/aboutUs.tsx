import BannerAboutUs from "~/components/bannerAboutUs";
import Discuss from "~/components/discuss";
import OurAchievement from "~/components/ourAchievement";
import OurMissionAndStory from "~/components/ourMissionAndStory";
import OurTrack from "~/components/ourTrack";
import TheTeam from "~/components/theTeam";

const AboutUs = () => {
  return (
    <div>
      <BannerAboutUs />
      <OurAchievement />
      <OurMissionAndStory />
      <OurTrack />
      <TheTeam />
      <Discuss />
    </div>
  );
};

export default AboutUs;

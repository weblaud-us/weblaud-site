import BannerAboutUs from "~/components/aboutUs/bannerAboutUs";
import Discuss from "~/components/aboutUs/discuss";
import OurAchievement from "~/components/aboutUs/ourAchievement";
import OurMissionAndStory from "~/components/aboutUs/ourMissionAndStory";
import OurTrack from "~/components/aboutUs/ourTrack";
import TheTeam from "~/components/aboutUs/theTeam";

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

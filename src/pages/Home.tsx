import { Hero } from "./Hero";
import { AboutSection } from "./AboutSection";
import { VisionSection } from "./VisionSection";
import { InvestmentSection } from "./InvestmentSection";
import { WithdrawalSection } from "./WithdrawalSection";
import { ReferralSection } from "./ReferralSection";
import { NetworkerSection } from "./NetworkerSection";
import { TermsSection } from "./TermsSection";
import { CTASection } from "./CTASection";

const Home = () => {
  return (
    <>
      <Hero />
      <AboutSection />
      <VisionSection />
      <InvestmentSection />
      <WithdrawalSection />
      <ReferralSection />
      <NetworkerSection />
      <TermsSection />
      <CTASection />
    </>
  );
};

export default Home;

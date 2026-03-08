import { HeroSection } from "@/components/landing/hero-section";
import { ArchitectureSection } from "@/components/landing/architecture-section";
import { DemoSection } from "@/components/landing/demo-section";
import { CLISection } from "@/components/landing/cli-section";
import { CapabilitiesSection } from "@/components/landing/capabilities-section";
import { ChallengesSection } from "@/components/landing/challenges-section";

export default function Page() {
    return <>
        <HeroSection />
        <ArchitectureSection />
        <DemoSection />
        <CLISection/>
        <CapabilitiesSection />
        <ChallengesSection />
    </>
}

/**
    Layout Structure:
    Navbar
    Hero
    Demo
    Architecture
    CLI Terminal
    Capabilities
    Challenges
    Footer
*/
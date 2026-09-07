import ResponsiveHero from "@/components/features/home/ResponsiveHero"
import EnhancedMinistries from "@/components/features/ministries/EnhancedMinistries"
import ServiceWeek from "@/components/features/home/ServiceWeek"
import CTA from "@/components/features/home/CTA"
import UpcomingEvents from "@/components/features/events/UpcomingEvents"
import GallerySection from "@/components/features/media/GallerySection"
import GetInvolved from "@/components/features/give/GetInvolved"
import Footer from "@/components/layout/Footer"
import VideoWelcomeModal from "@/components/features/media/VideoWelcomeModal"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="w-full">
        {/* Video Welcome Modal - Only appears on home page */}
        <VideoWelcomeModal />

        <div className="w-full">
          <ResponsiveHero />
        </div>
        <div className="w-full">
          <EnhancedMinistries />
        </div>
        <div className="w-full">
          <ServiceWeek />
        </div>
        <div className="w-full">
          <GetInvolved />
        </div>
        <div className="w-full">
          <GallerySection />
        </div>
        {/*
        <div className="w-full">
          <UpcomingEvents />
        </div>
        */}
        <div className="w-full">
          <CTA />
        </div>
      </main>
    </div>
  )
}


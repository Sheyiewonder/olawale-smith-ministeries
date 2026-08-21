import Navbar from "@/components/navigation/Navbar";

export default function PartnerPage() {
  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      <Navbar />

      <section className="px-6 pb-24 pt-40 sm:px-8 lg:px-12 lg:pb-32 lg:pt-48">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow text-bronze">Partnership</p>

          <h1 className="display-heading mt-6 text-6xl sm:text-7xl lg:text-[8rem]">
            Partner
            <br />
            <span className="text-bronze">With Us.</span>
          </h1>

          <p className="body-copy mt-10 max-w-2xl text-lg text-charcoal/65">
            The work of the ministry continues through people who believe in
            the message and choose to partner with the vision.
          </p>

          <div className="mt-16 border-t border-charcoal/10 pt-8">
            <p className="eyebrow text-bronze">Coming Soon</p>

            <p className="mt-4 max-w-xl text-lg text-charcoal/65">
              Partnership information and official ministry partnership
              channels will be available here.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
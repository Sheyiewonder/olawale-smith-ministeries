import PageLayout from "@/components/layout/PageLayout";

export default function InvitePage() {
  return (
    <PageLayout theme="dark">
      <section className="px-6 pb-24 pt-40 sm:px-8 lg:px-12 lg:pb-32 lg:pt-48">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow text-gold">Ministry Invitations</p>

          <h1 className="display-heading mt-6 text-6xl sm:text-7xl lg:text-[8rem]">
            Invite Pastor
            <br />
            <span className="text-gold">Olawale Smith.</span>
          </h1>

          <p className="body-copy mt-10 max-w-2xl text-lg text-ivory-muted">
            Would you like to invite Pastor Olawale Smith to minister at your
            church, conference, convention, program, or special gathering?
          </p>

          <div className="mt-16 border-t border-ivory/10 pt-8">
            <p className="eyebrow text-gold">Official Contact</p>

            <p className="mt-4 text-lg text-ivory-muted">
              Ministry invitation details will be provided here.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
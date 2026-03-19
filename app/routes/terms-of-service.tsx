import NavBar from "~/components/ui/navBar";
import { motion } from "framer-motion";
import type { Route } from "./+types/terms-of-service";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Terms of Service – Weblaud LLC Software Development Company" },
    {
      name: "description",
      content:
        "Read the Terms of Service of Weblaud LLC. These terms govern your use of our website and services.",
    },
    {
      tagName: "link",
      rel: "canonical",
      href: "https://weblaud.com/terms-of-service",
    },
  ];
}

export default function TermsOfService() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card-bg border border-light-black rounded-2xl p-8 md:p-12 shadow-2xl"
          >
            <h1 className="text-3xl md:text-4xl font-bold font-barlow text-white mb-8 border-b border-white/10 pb-4">
              Terms of Service
            </h1>

            <div className="space-y-8 text-gray-300 font-barlow leading-relaxed">
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing and using Weblaud's website and services, you
                  agree to be bound by these Terms of Service. If you do not
                  agree with any part of these terms, please do not use our
                  services.
                </p>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  2. Use of Services
                </h2>
                <p className="mb-4">
                  You agree to use our services only for lawful purposes and in
                  accordance with these Terms. You agree not to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Use our services in any way that violates any applicable
                    local, national, or international law or regulation.
                  </li>
                  <li>
                    Engage in any conduct that restricts or inhibits anyone's
                    use or enjoyment of our services.
                  </li>
                  <li>
                    Attempt to gain unauthorized access to any portion of our
                    services or systems.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  3. Intellectual Property
                </h2>
                <p>
                  All content, features, and functionality of our services,
                  including but not limited to text, graphics, logos, and
                  software, are the exclusive property of Weblaud and are
                  protected by copyright, trademark, and other intellectual
                  property laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  4. Service Modifications
                </h2>
                <p>
                  We reserve the right to modify, suspend, or discontinue any
                  part of our services at any time without prior notice. We will
                  not be liable to you or any third party for any modification,
                  suspension, or discontinuance of our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  5. Limitation of Liability
                </h2>
                <p>
                  To the fullest extent permitted by law, Weblaud shall not be
                  liable for any indirect, incidental, special, consequential,
                  or punitive damages resulting from your use of or inability to
                  use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  6. Changes to Terms
                </h2>
                <p>
                  We may update these Terms of Service from time to time. We
                  will notify you of any changes by posting the new Terms on
                  this page. Your continued use of our services after such
                  changes constitutes your acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  7. Contact Information
                </h2>
                <p>
                  If you have any questions about these Terms of Service, please
                  contact us at:
                </p>
                <p className="mt-2 text-blue-500">info@weblaud.com</p>
              </section>

              <div className="pt-8 border-t border-white/10 text-sm text-gray-500">
                Last updated: {new Date().getFullYear()}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

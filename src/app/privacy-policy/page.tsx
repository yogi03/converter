export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl space-y-8">
            <div className="space-y-4 text-center">
                <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="prose dark:prose-invert max-w-none space-y-6">
                <section>
                    <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                    <p>
                        Welcome to ConverterX. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">2. The Data We Collect</h2>
                    <p>
                        ConverterX operates primarily as a client-side application. This means:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li><strong>Files:</strong> Your images and files <strong>never</strong> leave your device. All processing happens locally in your browser using WebAssembly technology. We do not upload, store, or view your files on any server.</li>
                        <li><strong>Usage Data:</strong> We may collect anonymous usage data (e.g., page views, error logs) to improve the performance and stability of our website.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">3. Cookies</h2>
                    <p>
                        We use essential cookies to make our site work. We may also use optional cookies for analytics to understand how you use our website. You can control your cookie preferences through your browser settings.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">4. Third-Party Links</h2>
                    <p>
                        Our website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
                    <p>
                        If you have any questions about this privacy policy or our privacy practices, please contact us at <a href="mailto:support@converterx.com" className="text-primary hover:underline">support@converterx.com</a>.
                    </p>
                </section>
            </div>
        </div>
    )
}

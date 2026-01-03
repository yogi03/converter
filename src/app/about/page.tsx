import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl space-y-8">
            <div className="space-y-4 text-center">
                <h1 className="text-4xl font-bold tracking-tight">About ConverterX</h1>
                <p className="text-muted-foreground text-lg">
                    Empowering your creative workflow with limitless conversion possibilities.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Our Mission</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            At ConverterX, our mission is simple: provide a fast, secure, and accessible tool for everyone to convert their images. We believe that privacy shouldn't be compromised for convenience.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>How It Works</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Unlike other online converters that upload your files to a remote server, ConverterX uses advanced WebAssembly (Wasm) technology to process your images directly inside your browser. Your files never leave your device.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="prose dark:prose-invert max-w-none">
                <h3>Why Choose Us?</h3>
                <ul>
                    <li><strong>Zero Uploads:</strong> Complete privacy guaranteed.</li>
                    <li><strong>Lightning Fast:</strong> No waiting for uploads or downloads.</li>
                    <li><strong>Universal Support:</strong> From JPEGs to SVGs and ICOs.</li>
                    <li><strong>Free Forever:</strong> No hidden costs or subscriptions.</li>
                </ul>
            </div>
        </div>
    )
}

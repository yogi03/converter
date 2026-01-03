import Link from 'next/link'

export function Footer() {
    return (
        <footer className="border-t bg-background/50 backdrop-blur-lg mt-auto">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <div className="font-bold text-xl flex items-center gap-2">
                            <span>Converter<span className="text-primary">X</span></span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            The ultimate client-side image converter. Fast, secure, and free.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium">Product</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-foreground transition-colors">Converter</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} ConverterX. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

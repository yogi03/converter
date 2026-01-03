"use client" // Client component for potential future form handling
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-2xl space-y-8">
            <div className="space-y-4 text-center">
                <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
                <p className="text-muted-foreground text-lg">
                    Have a question or feedback? We'd love to hear from you.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Get in Touch</CardTitle>
                    <CardDescription>
                        Choose the best way to reach us.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <a href="mailto:support@converterx.com" className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-medium">Email Support</h3>
                            <p className="text-sm text-muted-foreground">yogendrachaurasiya30@gmail.com</p>
                        </div>
                    </a>

                    <a href="#" className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <MessageSquare className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-medium">Social Media</h3>
                            <p className="text-sm text-muted-foreground">Follow us for updates @converterx</p>
                        </div>
                    </a>
                </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground">
                <p>We typically respond within 24 hours.</p>
            </div>
        </div>
    )
}

"use client"
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { CloudUpload, FileSymlink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

interface DropzoneProps {
    handleUpload: (files: File[]) => void
}

export default function Dropzone({ handleUpload }: DropzoneProps) {
    const [isHover, setIsHover] = useState(false)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setIsHover(false)
        if (acceptedFiles.length > 0) {
            handleUpload(acceptedFiles)
            toast.success(`${acceptedFiles.length} file(s) added successfully`)
        }
    }, [handleUpload])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDragEnter: () => setIsHover(true),
        onDragLeave: () => setIsHover(false),
        accept: {
            'image/*': [],
            'image/heic': ['.heic'],
            'image/heif': ['.heif'],
        }
    })

    return (
        <Card className={cn(
            "bg-muted/50 border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer hover:bg-muted/80",
            isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"
        )}>
            <CardContent className="flex flex-col items-center justify-center space-y-4 py-16 dark:py-12" {...getRootProps()}>
                <input {...getInputProps()} />
                <div className={cn(
                    "p-4 rounded-full bg-background transition-all duration-300 shadow-sm",
                    isDragActive && "animate-bounce"
                )}>
                    <CloudUpload className="h-10 w-10 text-primary" />
                </div>
                <div className="text-center space-y-1">
                    <h3 className="text-lg font-semibold tracking-tight">
                        {isDragActive ? "Drop the files here" : "Drag & drop files here"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        or click to select files
                    </p>
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground mt-2">
                    <span className="bg-background px-2 py-1 rounded-md border shadow-sm">JPG</span>
                    <span className="bg-background px-2 py-1 rounded-md border shadow-sm">PNG</span>
                    <span className="bg-background px-2 py-1 rounded-md border shadow-sm">WEBP</span>
                    <span className="bg-background px-2 py-1 rounded-md border shadow-sm">SVG</span>
                    <span className="bg-background px-2 py-1 rounded-md border shadow-sm">HEIC</span>
                </div>
            </CardContent>
        </Card>
    )
}

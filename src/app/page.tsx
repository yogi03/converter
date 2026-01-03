"use client"

import { useState, useEffect, useRef } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'
import { Loader2, Download, Trash2, Wand2, MonitorPlay } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Dropzone from '@/components/dropzone'
import { cn, formatBytes, compressFileName } from '@/lib/utils'
import { toast } from 'sonner'

export type Action = {
  file: File
  file_name: string
  file_size: number
  from: string
  to: string | null
  fileRef: File | null
  url: string | null
  output_blob: Blob | null
  is_converting: boolean
  is_converted: boolean
  is_error: boolean
}

export default function Home() {
  const [actions, setActions] = useState<Action[]>([])
  const [isReady, setIsReady] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const ffmpegRef = useRef<any>(null)

  const load = async () => {
    setIsLoaded(true)
    const ffmpeg = new FFmpeg()
    ffmpegRef.current = ffmpeg

    // Log to console so user can see what's happening
    ffmpeg.on('log', ({ message }) => {
      console.log(message)
    })

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'

    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      })
      setIsReady(true)
      setIsLoaded(false)
      console.log("FFmpeg loaded")
    } catch (error) {
      console.error("FFmpeg load failed", error)
      setIsLoaded(false)
      toast("FFmpeg failed to load. Please refresh.")
    }
  }

  useEffect(() => {
    load()
  }, [])


  const handleUpload = (files: File[]) => {
    const newActions: Action[] = files.map((file) => ({
      file,
      file_name: file.name,
      file_size: file.size,
      from: file.name.split('.').pop() || '',
      to: null,
      fileRef: file,
      url: URL.createObjectURL(file), // Preview URL
      output_blob: null,
      is_converting: false,
      is_converted: false,
      is_error: false,
    }))
    setActions((prev) => [...prev, ...newActions])
  }

  const updateAction = (fileName: string, to: string) => {
    setActions((prev) =>
      prev.map((action) =>
        action.file_name === fileName ? { ...action, to } : action
      )
    )
  }

  const removeAction = (fileName: string) => {
    setActions((prev) => prev.filter((a) => a.file_name !== fileName))
  }

  const convertFile = async (action: Action): Promise<Action> => {
    const { file, to } = action;
    if (!to) return action;

    try {
      let outputBlob: Blob;
      let outputUrl: string;
      const ffmpeg = ffmpegRef.current;

      // Browser-native supported formats for decoding
      // Browsers can usually decode: jpg, png, webp, gif, svg, bmp, ico
      const useCanvasDecoder = ['svg', 'ico', 'webp'];

      // canvas supported encoders: png, jpeg, webp
      // We can use canvas to decode SVG/ICO/WEBP -> PNG/JPG directly

      const isInputComplex = useCanvasDecoder.includes(action.from.toLowerCase());

      if (isInputComplex) {
        // Fallback: Use Browser Canvas to decode
        const standardFormats = ['jpg', 'jpeg', 'png', 'webp'];
        const isTargetCanvasSupported = standardFormats.includes(to.toLowerCase());
        const intermediateFormat = isTargetCanvasSupported ? to : 'png';

        // Convert to intermediate (or final) blob using Canvas
        const blob = await convertImageViaCanvas(file, intermediateFormat);

        if (isTargetCanvasSupported) {
          outputBlob = blob;
        } else {
          // We have a PNG blob, now use FFmpeg to convert PNG -> Target (e.g. ICO)
          if (!ffmpeg) throw new Error("FFmpeg not loaded for complex conversion");

          const tempName = `temp.${intermediateFormat}`;
          const outputName = `output.${to}`;

          await ffmpeg.writeFile(tempName, new Uint8Array(await blob.arrayBuffer()));

          // Special args for ICO
          const args = ['-i', tempName];
          if (to === 'ico') args.push('-s', '256x256'); // ICO needs specific sizes
          args.push(outputName);

          await ffmpeg.exec(args);
          const data = await ffmpeg.readFile(outputName);
          outputBlob = new Blob([data], { type: `image/${to}` });
        }

      } else if (to.toLowerCase() === 'svg') {
        // Image -> SVG (Wrap in SVG tag)
        outputBlob = await convertImageToSvg(file);
      } else {
        // Standard FFmpeg conversion
        if (!ffmpeg) throw new Error("FFmpeg not loaded");

        await ffmpeg.writeFile(file.name, await fetchFile(file));
        const outputName = file.name.replace(/\.[^/.]+$/, "") + "." + to;

        const args = ['-i', file.name];
        if (to === 'ico') args.push('-s', '256x256');
        args.push(outputName);

        await ffmpeg.exec(args);
        const data = await ffmpeg.readFile(outputName);
        outputBlob = new Blob([data], { type: `image/${to}` });
      }

      outputUrl = URL.createObjectURL(outputBlob);

      return {
        ...action,
        url: outputUrl,
        output_blob: outputBlob,
        is_converting: false,
        is_converted: true,
      };
    } catch (err) {
      console.error(err);
      return {
        ...action,
        is_converting: false,
        is_error: true,
      }
    }
  }

  const handleConvert = async () => {
    setIsConverting(true);
    // Process one by one or generic promise all
    // For safety, let's map through them

    const newActions = actions.map((action) => {
      if (action.to && !action.is_converted) {
        return { ...action, is_converting: true };
      }
      return action;
    });
    setActions(newActions);

    // Now let's process logic
    // Note: FFmpeg.wasm is single threaded in some versions, but we should be fine here for basic images. 
    // Ideally we process sequentially if we want to be safe with shared memory.

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      if (action.to && !action.is_converted) {
        const result = await convertFile(action); // convertFile needs to be defined
        setActions(prev => {
          const n = [...prev];
          n[i] = result;
          return n;
        });
      }
    }

    setIsConverting(false);
    toast.success("Conversion completed!");
  }

  // Helper for reading file
  async function fetchFile(file: File): Promise<Uint8Array> {
    return new Uint8Array(await file.arrayBuffer());
  }

  const downloadAll = () => {
    actions.forEach((action) => {
      if (action.is_converted && action.url) {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = action.url;
        // Ext correctly
        const ext = action.to;
        const name = action.file_name.replace(/\.[^/.]+$/, "");
        console.log(ext, name);
        a.download = name + "." + ext;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Navbar mockup */}
      <nav className="border-b p-4 flex items-center justify-between container mx-auto bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl">
          <MonitorPlay className="w-6 h-6 text-primary" />
          <span>Converter<span className="text-primary">X</span></span>
        </div>

      </nav>

      <main className="container mx-auto pt-12 md:pt-24 px-4 space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Transform your images <br className="hidden md:block" />
            <span className="text-primary">Limitless possibilities</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            The ultimate in-browser image converter. Convert JPG, PNG, WEBP, and more individually or in bulk.
            Privacy focused - files never leave your device.
          </p>
        </div>

        {/* Dropzone Area */}
        <section className="max-w-xl mx-auto">
          {isLoaded ? (
            <div className="space-y-4 text-center">
              <Skeleton className="h-64 w-full rounded-xl" />
              <p className="text-muted-foreground animate-pulse">Loading core engine...</p>
            </div>
          ) : (
            <Dropzone handleUpload={handleUpload} />
          )}
        </section>

        {/* Dashboard */}
        {actions.length > 0 && (
          <section className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Conversion Queue</h2>
              <div className="flex gap-2">
                <Button
                  disabled={isConverting || actions.every(a => a.is_converted)}
                  onClick={handleConvert}
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Convert All
                    </>
                  )}
                </Button>
                {actions.some(a => a.is_converted) && (
                  <Button variant="outline" onClick={downloadAll}>
                    <Download className="w-4 h-4 mr-2" /> Download All
                  </Button>
                )}
                <Button variant="ghost" className="text-destructive" onClick={() => setActions([])}>Clear All</Button>
              </div>
            </div>

            <div className="grid gap-4">
              {actions.map((action, i) => (
                <Card key={i} className="flex items-center p-4 justify-between gap-4">
                  <div className="flex items-center gap-4  overflow-hidden">
                    {action.from.match(/(jpg|jpeg|png|webp|svg|ico)/i) ? (
                      <img src={action.url || ''} alt="" className="w-12 h-12 object-cover rounded-md border" />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center font-bold text-xs uppercase">
                        {action.from}
                      </div>
                    )}
                    <div className="grid gap-1">
                      <p className="font-medium truncate max-w-[200px]" title={action.file_name}>
                        {compressFileName(action.file_name)}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatBytes(action.file_size)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!action.is_converted ? (
                      <>
                        <span className="text-sm text-muted-foreground">Convert to</span>
                        <Select
                          value={action.to || ''}
                          onValueChange={(val) => updateAction(action.file_name, val)}
                          disabled={action.is_converting}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="..." />
                          </SelectTrigger>
                          <SelectContent>
                            {['jpg', 'png', 'webp', 'ico', 'svg'].filter(x => x !== action.from.toLowerCase()).map((t) => (
                              <SelectItem key={t} value={t}>{t.toUpperCase()}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </>
                    ) : (
                      <Badge variant="secondary" className="text-green-600 bg-green-100 dark:bg-green-900/30">
                        Done
                      </Badge>
                    )}

                    {action.is_converted && (
                      <Button size="icon" variant="ghost" onClick={() => {
                        const a = document.createElement('a');
                        a.href = action.url!;
                        a.download = action.file_name.replace(/\.[^.]+$/, `.${action.to}`);
                        a.click();
                      }}>
                        <Download className="w-4 h-4" />
                      </Button>
                    )}

                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeAction(action.file_name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

// Helper functions
async function convertImageViaCanvas(file: File, outputFormat: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error("Canvas context failed")); return; }
      ctx.drawImage(img, 0, 0);

      let mime = `image/${outputFormat}`;
      if (outputFormat === 'jpg') mime = 'image/jpeg';

      canvas.toBlob((blob) => {
        if (!blob) reject(new Error("Conversion failed"));
        else resolve(blob);
      }, mime);

      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for canvas conversion"));
    };
    img.src = url;
  });
}

async function convertImageToSvg(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas'); // Used getting simple base64? No, direct reader is better.
      // Actually, we need width/height for the SVG tag
      const width = img.width;
      const height = img.height;
      URL.revokeObjectURL(url);

      const reader = new FileReader();
      reader.onload = () => {
        const b64 = reader.result as string;
        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <image href="${b64}" width="100%" height="100%" />
</svg>`;
        resolve(new Blob([svgContent], { type: 'image/svg+xml' }));
      };
      reader.readAsDataURL(file);
    };
    img.onerror = () => reject(new Error("Failed to load image for SVG conversion"));
    img.src = url;
  });
}

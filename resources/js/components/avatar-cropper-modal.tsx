import {
    Check,
    FlipHorizontal,
    Grid,
    Move,
    RotateCcw,
    RotateCw,
    Scissors,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface AvatarCropperModalProps {
    isOpen: boolean;
    imageSrc: string | null;
    originalFileName?: string;
    onClose: () => void;
    onCropComplete: (croppedFile: File, croppedPreviewUrl: string) => void;
}

export function AvatarCropperModal({
    isOpen,
    imageSrc,
    originalFileName = 'avatar.jpg',
    onClose,
    onCropComplete,
}: AvatarCropperModalProps) {
    const [zoom, setZoom] = useState<number>(1);
    const [rotation, setRotation] = useState<number>(0);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [position, setPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragStart, setDragStart] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });
    const [showGrid, setShowGrid] = useState<boolean>(true);

    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Reset state when modal opens or image changes
    useEffect(() => {
        if (isOpen && imageSrc) {
            setZoom(1);
            setRotation(0);
            setIsFlipped(false);
            setPosition({ x: 0, y: 0 });
        }
    }, [isOpen, imageSrc]);

    // Handle Drag / Pan
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging) return;
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        },
        [isDragging, dragStart],
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Wheel zoom (non-passive listener to prevent browser violation warnings)
    useEffect(() => {
        const container = containerRef.current;
        if (!container || !isOpen) return;

        const onWheelHandler = (e: WheelEvent) => {
            e.preventDefault();
            const delta = e.deltaY * -0.0015;
            setZoom((prev) =>
                Math.min(Math.max(0.4, Number((prev + delta).toFixed(2))), 3.5),
            );
        };

        container.addEventListener('wheel', onWheelHandler, { passive: false });
        return () => {
            container.removeEventListener('wheel', onWheelHandler);
        };
    }, [isOpen]);

    // Rotate
    const handleRotate = (deg: number) => {
        setRotation((prev) => (prev + deg) % 360);
    };

    // Flip horizontal
    const handleFlip = () => {
        setIsFlipped((f) => !f);
    };

    // Reset crop adjustments
    const handleReset = () => {
        setZoom(1);
        setRotation(0);
        setIsFlipped(false);
        setPosition({ x: 0, y: 0 });
    };

    // Apply Crop and Generate High-Resolution Output Canvas
    const handleApplyCrop = () => {
        if (!imageRef.current || !containerRef.current) return;

        const img = imageRef.current;
        const outputSize = 512;
        const canvas = document.createElement('canvas');
        canvas.width = outputSize;
        canvas.height = outputSize;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const cropBoxSize = 260;
        const scaleToCanvas = outputSize / cropBoxSize;

        ctx.translate(outputSize / 2, outputSize / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        if (isFlipped) {
            ctx.scale(-1, 1);
        }
        ctx.scale(zoom * scaleToCanvas, zoom * scaleToCanvas);
        ctx.translate(position.x / zoom, position.y / zoom);

        ctx.drawImage(
            img,
            -img.naturalWidth / 2,
            -img.naturalHeight / 2,
            img.naturalWidth,
            img.naturalHeight,
        );

        canvas.toBlob(
            (blob) => {
                if (!blob) return;
                const file = new File(
                    [blob],
                    originalFileName.replace(/\.[^/.]+$/, '.jpg'),
                    {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    },
                );
                const previewUrl = URL.createObjectURL(blob);
                onCropComplete(file, previewUrl);
                onClose();
            },
            'image/jpeg',
            0.92,
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-2xl dark:border-white/10 dark:bg-[#14161b]">
                {/* Clean White Header */}
                <DialogHeader className="border-b border-slate-100 bg-white px-5 py-4 dark:border-white/[0.06] dark:bg-[#14161b]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-7.5 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                            <Scissors className="size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                Sesuaikan &amp; Potong Foto Profil
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Geser foto untuk memposisikan wajah,
                                perbesar/perkecil, atau putar sudut.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Main Clean Studio Canvas */}
                <div className="flex flex-col items-center bg-slate-50/70 p-5 select-none dark:bg-[#0f1115]">
                    {/* Viewport Box */}
                    <div
                        ref={containerRef}
                        onMouseDown={handleMouseDown}
                        className="group relative flex size-[280px] cursor-grab items-center justify-center overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 active:cursor-grabbing dark:border-white/10 dark:bg-[#16181f] dark:shadow-none"
                        style={{
                            backgroundImage: `radial-gradient(circle, #cbd5e1 1px, transparent 1px)`,
                            backgroundSize: '16px 16px',
                        }}
                    >
                        {/* Target Image */}
                        {imageSrc && (
                            <img
                                ref={imageRef}
                                src={imageSrc}
                                alt="Crop target"
                                style={{
                                    transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) ${
                                        isFlipped ? 'scaleX(-1)' : ''
                                    } scale(${zoom})`,
                                    transformOrigin: 'center center',
                                    transition: isDragging
                                        ? 'none'
                                        : 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)',
                                    maxWidth: 'none',
                                }}
                                className="pointer-events-none absolute max-h-none select-none"
                            />
                        )}

                        {/* Clean Studio Mask & Circular Aperture */}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            {/* Outer White/Slate Frosted Vignette Mask */}
                            <div className="size-[260px] rounded-full border-2 border-white shadow-[0_0_0_9999px_rgba(241,245,249,0.92)] ring-1 ring-slate-300/80 dark:shadow-[0_0_0_9999px_rgba(15,17,21,0.92)] dark:ring-white/20">
                                {/* Rule of Thirds Photography Grid */}
                                {showGrid && (
                                    <div className="grid size-full grid-cols-3 grid-rows-3 opacity-30">
                                        <div className="border-r border-b border-blue-500" />
                                        <div className="border-r border-b border-blue-500" />
                                        <div className="border-b border-blue-500" />
                                        <div className="border-r border-b border-blue-500" />
                                        <div className="border-r border-b border-blue-500" />
                                        <div className="border-b border-blue-500" />
                                        <div className="border-r border-b border-blue-500" />
                                        <div className="border-r border-b border-blue-500" />
                                        <div />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Floating Drag Guide Badge */}
                        <div className="pointer-events-none absolute bottom-2.5 flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-slate-700 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-slate-900/90 dark:text-zinc-300">
                            <Move className="size-3 text-slate-500" />
                            <span>Tarik &amp; Geser Foto</span>
                        </div>
                    </div>

                    {/* Toolbar Controls */}
                    <div className="mt-4 flex w-full max-w-[280px] flex-col gap-2.5">
                        {/* Zoom Slider */}
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white px-3 py-1.5 shadow-2xs dark:border-white/10 dark:bg-[#14161b]">
                            <button
                                type="button"
                                onClick={() =>
                                    setZoom((z) =>
                                        Math.max(
                                            0.4,
                                            Number((z - 0.1).toFixed(2)),
                                        ),
                                    )
                                }
                                className="rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
                                title="Perkecil (Zoom Out)"
                            >
                                <ZoomOut className="size-3.5" />
                            </button>
                            <input
                                type="range"
                                min="0.4"
                                max="3.5"
                                step="0.05"
                                value={zoom}
                                onChange={(e) =>
                                    setZoom(parseFloat(e.target.value))
                                }
                                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600 dark:bg-zinc-700"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setZoom((z) =>
                                        Math.min(
                                            3.5,
                                            Number((z + 0.1).toFixed(2)),
                                        ),
                                    )
                                }
                                className="rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
                                title="Perbesar (Zoom In)"
                            >
                                <ZoomIn className="size-3.5" />
                            </button>
                            <span className="w-10 text-right font-mono text-[10px] font-bold text-slate-700 dark:text-zinc-300">
                                {Math.round(zoom * 100)}%
                            </span>
                        </div>

                        {/* Rotation, Flip, Grid, Reset Buttons */}
                        <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => handleRotate(-90)}
                                    className="flex items-center gap-1 rounded-lg border border-slate-200/80 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-300 dark:hover:bg-white/5"
                                    title="Putar 90° ke kiri"
                                >
                                    <RotateCcw className="size-3" />
                                    <span>-90°</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRotate(90)}
                                    className="flex items-center gap-1 rounded-lg border border-slate-200/80 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-300 dark:hover:bg-white/5"
                                    title="Putar 90° ke kanan"
                                >
                                    <RotateCw className="size-3" />
                                    <span>+90°</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleFlip}
                                    className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold shadow-2xs transition-colors ${
                                        isFlipped
                                            ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300'
                                            : 'border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-300 dark:hover:bg-white/5'
                                    }`}
                                    title="Balik Foto Horizontal (Cermin)"
                                >
                                    <FlipHorizontal className="size-3" />
                                    <span>Cermin</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowGrid((g) => !g)}
                                    className={`rounded-lg border p-1.5 shadow-2xs transition-colors ${
                                        showGrid
                                            ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300'
                                            : 'border-slate-200/80 bg-white text-slate-500 hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-400 dark:hover:bg-white/5'
                                    }`}
                                    title="Garis Bantu Fotografi"
                                >
                                    <Grid className="size-3" />
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleReset}
                                className="text-[11px] font-semibold text-slate-500 transition-colors hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Clean Footer */}
                <DialogFooter className="border-t border-slate-100 bg-white px-5 py-3 sm:justify-between dark:border-white/[0.06] dark:bg-[#14161b]">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 rounded-lg px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-white/10"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        onClick={handleApplyCrop}
                        className="h-8 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-blue-700 active:scale-95"
                    >
                        <Check className="mr-1.5 size-3.5" />
                        Terapkan &amp; Potong Foto
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

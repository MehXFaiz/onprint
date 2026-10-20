import { useState, useEffect, useMemo, useRef } from 'react'
import {
  RotateCcw,
  Play,
  Pause,
  Compass,
  Sparkles,
  Maximize2,
  Minimize2,
  Layers,
  ShieldCheck,
} from 'lucide-react'
import { getProductImage } from '../assets/productImages'

export default function Product360Viewer({
  product,
  initialAngle = 0,
  autoSpin = true,
  className = '',
  height = 'aspect-[4/3] sm:aspect-[1/1]',
}) {
  const [angle, setAngle] = useState(initialAngle)
  const [tilt] = useState(4)
  const [isDragging, setIsDragging] = useState(false)
  const [isPlaying, setIsPlaying] = useState(autoSpin)
  const [isZoomed, setIsZoomed] = useState(false)
  const [specularSheen, setSpecularSheen] = useState(true)

  const dragStartRef = useRef({ x: 0, startAngle: 0 })
  const stageRef = useRef(null)
  const animFrameRef = useRef(null)

  const primaryImage = getProductImage(product)

  const rotationFrames = useMemo(() => {
    if (Array.isArray(product?.images360) && product.images360.length >= 4) {
      return product.images360.filter(Boolean)
    }
    if (Array.isArray(product?.images) && product.images.length >= 4) {
      return product.images.filter(Boolean)
    }
    return []
  }, [product])

  const hasFrameRotation = rotationFrames.length >= 4
  const frameCount = rotationFrames.length || 0
  const currentFrameIndex = hasFrameRotation
    ? Math.round(((angle % 360) + 360) % 360 / (360 / frameCount)) % frameCount
    : 0

  const secondaryImage =
    !hasFrameRotation && product?.images && product.images.length > 1
      ? product.images[1]
      : (product?.back_image || product?.backImage || product?.reverse_image || null)

  useEffect(() => {
    if (!isPlaying || isDragging) return

    let lastTime = performance.now()
    const spinLoop = (time) => {
      const delta = time - lastTime
      lastTime = time
      setAngle((prev) => (prev + (delta * 0.025)) % 360)
      animFrameRef.current = requestAnimationFrame(spinLoop)
    }

    animFrameRef.current = requestAnimationFrame(spinLoop)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isPlaying, isDragging])

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      startAngle: angle,
    }
  }

  const handlePointerMove = (e) => {
    if (!isDragging) return
    const dx = e.clientX - dragStartRef.current.x
    const sensitivity = hasFrameRotation ? 1.1 : 0.65
    const newAngle = (dragStartRef.current.startAngle + dx * sensitivity) % 360
    setAngle(newAngle < 0 ? 360 + newAngle : newAngle)
  }

  const handlePointerUp = (e) => {
    if (isDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        // ignore
      }
      setIsDragging(false)
    }
  }

  const snapToAngle = (targetAngle) => {
    setIsPlaying(false)
    setAngle(targetAngle % 360)
  }

  const toggleAutoSpin = () => {
    setIsPlaying((prev) => !prev)
  }

  const resetView = () => {
    setIsPlaying(false)
    setAngle(0)
    setIsZoomed(false)
  }

  const normalizedAngle = Math.round(((angle % 360) + 360) % 360)
  const sheenOffset = ((normalizedAngle % 180) / 180) * 160 - 30

  return (
    <div
      className={`group/viewer relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#1E2C4F] bg-gradient-to-b from-[#0B132B] via-[#14213D] to-[#0B132B] text-[#F5F3EE] select-none ${className}`}
    >
      <div className="absolute left-3 right-3 top-3 z-30 flex flex-wrap items-center justify-between gap-1.5 pointer-events-none">
        <div className="flex items-center gap-1.5 rounded-full border border-[#1E2C4F] bg-[#14213D]/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#F5F3EE] shadow-xs backdrop-blur-md">
          <Compass className="h-3 w-3 text-[#D6C29A]" />
          <span>360° Studio</span>
          <span className="text-black/30">•</span>
          <span className="text-[#D6C29A]">{normalizedAngle}°</span>
          {hasFrameRotation && (
            <>
              <span className="text-black/30">•</span>
              <span className="text-black/55">{currentFrameIndex + 1}/{frameCount}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => setSpecularSheen(!specularSheen)}
            title="Toggle Spot UV / Specular Light Reflection"
            className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition-all cursor-pointer ${
              specularSheen
                ? 'border-[#D6C29A] bg-[#D6C29A] text-[#0B132B] shadow-xs'
                : 'border-[#1E2C4F] bg-[#14213D]/90 text-[#B8C2D9] hover:text-[#F5F3EE]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsZoomed(!isZoomed)}
            title={isZoomed ? 'Zoom Out' : 'Zoom In'}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[#1E2C4F] bg-[#14213D]/90 text-[#B8C2D9] transition-all hover:text-[#F5F3EE] shadow-xs cursor-pointer"
          >
            {isZoomed ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <div
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative w-full ${height} flex items-center justify-center cursor-grab active:cursor-grabbing touch-none`}
        style={{ perspective: '1200px' }}
      >
        <div className="pointer-events-none absolute bottom-6 h-28 w-4/5 rounded-full border border-black/5 bg-radial from-black/5 to-transparent blur-xs transform -rotate-x-60" />

        <div
          className="pointer-events-none absolute bottom-8 h-10 w-44 rounded-full bg-black/25 blur-md transition-all duration-150"
          style={{
            transform: `scale(${1 + Math.abs(Math.cos((angle * Math.PI) / 180)) * 0.25}, ${
              0.6 + Math.abs(Math.sin((angle * Math.PI) / 180)) * 0.2
            })`,
            opacity: 0.35 + Math.abs(Math.cos((angle * Math.PI) / 180)) * 0.15,
          }}
        />

        {hasFrameRotation ? (
          <div
            className="relative transition-transform duration-100 ease-out"
            style={{
              transform: `scale(${isZoomed ? 1.25 : 1})`,
              width: '82%',
              height: '82%',
            }}
          >
            {rotationFrames.map((src, idx) => (
              <div
                key={idx}
                className="absolute inset-0 rounded-2xl overflow-hidden border border-[#1E2C4F] bg-white shadow-2xl transition-opacity duration-100 ease-out"
                style={{
                  opacity: idx === currentFrameIndex ? 1 : 0,
                  zIndex: idx === currentFrameIndex ? 2 : 1,
                  pointerEvents: 'none',
                }}
              >
                <img
                  src={src}
                  alt={`${product?.name || 'Product'} view ${idx + 1} - ${Math.round(idx * (360 / frameCount))}°`}
                  className="h-full w-full object-cover select-none pointer-events-none"
                  draggable={false}
                />
                {specularSheen && (
                  <div
                    className="pointer-events-none absolute inset-0 transition-opacity duration-150"
                    style={{
                      background: `linear-gradient(115deg, transparent ${sheenOffset - 25}%, rgba(255,255,255,0.6) ${sheenOffset}%, transparent ${sheenOffset + 25}%)`,
                      mixBlendMode: 'screen',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div
            className="relative transition-transform duration-75 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: `scale(${isZoomed ? 1.2 : 1}) rotateX(${-tilt}deg) rotateY(${angle}deg)`,
              width: '68%',
              height: '68%',
            }}
          >
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden border border-[#1E2C4F] bg-white shadow-2xl"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'translateZ(6px)',
              }}
            >
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={product?.name || 'Product Front'}
                  className="h-full w-full object-cover pointer-events-none"
                  draggable={false}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white font-display text-sm font-black uppercase tracking-widest text-black/40">
                  ONPRINT PRESS
                </div>
              )}
              {specularSheen && (
                <div
                  className="pointer-events-none absolute inset-0 transition-opacity duration-150"
                  style={{
                    background: `linear-gradient(115deg, transparent ${sheenOffset - 25}%, rgba(255,255,255,0.65) ${sheenOffset}%, transparent ${sheenOffset + 25}%)`,
                    mixBlendMode: 'screen',
                  }}
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/20" />
            </div>

            <div
              className="absolute inset-0 rounded-2xl overflow-hidden border border-[#1E2C4F] bg-white shadow-2xl"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg) translateZ(6px)',
              }}
            >
              {secondaryImage ? (
                <img
                  src={secondaryImage}
                  alt={product?.name || 'Product Reverse'}
                  className="h-full w-full object-cover pointer-events-none"
                  draggable={false}
                />
              ) : (
                <div className="relative flex h-full w-full flex-col justify-between p-6 bg-gradient-to-br from-[#0B132B] via-[#14213D] to-[#070D1E] text-white">
                  {/* Subtle Background Gold Grid Watermark */}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#D6C29A_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                  <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#D6C29A]/15 blur-2xl" />

                  <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2.5 text-[9px] font-mono tracking-widest text-white/60">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-xs bg-[#00e5ff]" title="Cyan" />
                      <span className="h-2 w-2 rounded-xs bg-[#ff00ea]" title="Magenta" />
                      <span className="h-2 w-2 rounded-xs bg-[#ffee00]" title="Yellow" />
                      <span className="h-2 w-2 rounded-xs bg-black border border-white/30" title="Key/Black" />
                      <span className="ml-1 text-[8.5px] font-bold text-[#D6C29A]">ISO 12647-2 CALIBRATED</span>
                    </div>
                    <span className="rounded-md bg-[#D6C29A] px-1.5 py-0.5 text-[7.5px] font-black uppercase tracking-wider text-[#0B132B]">
                      REVERSE PROOF
                    </span>
                  </div>

                  <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center px-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D6C29A]/40 bg-gradient-to-br from-[#D6C29A]/20 to-transparent shadow-[0_8px_20px_rgba(212,175,101,0.15)]">
                      <Layers className="h-7 w-7 text-[#D6C29A]" />
                    </div>
                    <h4 className="mt-3.5 font-display text-sm font-black tracking-tight text-white line-clamp-1">
                      {product?.name || 'Custom Print Services'}
                    </h4>
                    <p className="mt-1 text-[9.5px] font-bold uppercase tracking-[0.22em] text-[#D6C29A]/90">
                      ONPRINT Atelier • Dubai, UAE
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[9px] font-semibold text-white/90 backdrop-blur-xs">
                      <ShieldCheck className="h-3 w-3 text-[#D6C29A]" />
                      <span>Heidelberg Precision Offset &amp; Spot UV</span>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2 text-[8px] font-mono uppercase tracking-wider text-white/45">
                    <span>1200 DPI Laser Direct</span>
                    <span className="text-[#D6C29A]/80">AL QUOZ 3 PRESSROOM</span>
                  </div>
                </div>
              )}
              {specularSheen && (
                <div
                  className="pointer-events-none absolute inset-0 transition-opacity duration-150"
                  style={{
                    background: `linear-gradient(115deg, transparent ${160 - sheenOffset - 25}%, rgba(255,255,255,0.45) ${160 - sheenOffset}%, transparent ${160 - sheenOffset + 25}%)`,
                    mixBlendMode: 'screen',
                  }}
                />
              )}
            </div>

            <div
              className="absolute top-0 bottom-0 right-0 w-[12px] rounded-r-xs bg-gradient-to-r from-[#D6C29A] to-[#D6C29A]"
              style={{
                transform: 'rotateY(90deg) translateZ(6px) translateX(6px)',
                transformOrigin: 'right center',
              }}
            />
            <div
              className="absolute top-0 bottom-0 left-0 w-[12px] rounded-l-xs bg-gradient-to-l from-[#D6C29A] to-[#D6C29A]"
              style={{
                transform: 'rotateY(-90deg) translateZ(6px) translateX(-6px)',
                transformOrigin: 'left center',
              }}
            />
            <div
              className="absolute top-0 left-0 right-0 h-[12px] bg-gradient-to-b from-[#14213D] to-[#0B132B]"
              style={{
                transform: 'rotateX(90deg) translateZ(6px) translateY(-6px)',
                transformOrigin: 'top center',
              }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-[12px] bg-gradient-to-t from-[#070D1E] to-[#D6C29A]"
              style={{
                transform: 'rotateX(-90deg) translateZ(6px) translateY(6px)',
                transformOrigin: 'bottom center',
              }}
            />
          </div>
        )}

        <div
          className={`pointer-events-none absolute bottom-4 z-20 flex items-center gap-2 rounded-full border border-[#1E2C4F] bg-[#14213D]/95 px-3 py-1.5 text-[10px] font-bold text-[#B8C2D9] shadow-md backdrop-blur-md transition-all duration-300 ${
            isDragging ? 'opacity-0 scale-95' : 'opacity-100'
          }`}
        >
          <span className="text-[#D6C29A] font-black">↔</span>
          <span>Drag horizontally to rotate 360°</span>
        </div>
      </div>

      <div className="relative z-30 flex w-full flex-wrap items-center justify-between gap-2 border-t border-[#1E2C4F] bg-[#14213D] px-4 py-2.5 backdrop-blur-md text-[#F5F3EE]">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
          <button
            type="button"
            onClick={() => snapToAngle(0)}
            className={`shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              normalizedAngle >= 350 || normalizedAngle <= 10
                ? 'bg-[#D6C29A] text-[#0B132B] shadow-xs'
                : 'border border-[#1E2C4F] bg-[#0B132B] text-[#B8C2D9] hover:border-[#D6C29A] hover:text-[#D6C29A]'
            }`}
          >
            Front
          </button>
          <button
            type="button"
            onClick={() => snapToAngle(90)}
            className={`shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              normalizedAngle >= 80 && normalizedAngle <= 100
                ? 'bg-[#D6C29A] text-[#0B132B] shadow-xs'
                : 'border border-[#1E2C4F] bg-[#0B132B] text-[#B8C2D9] hover:border-[#D6C29A] hover:text-[#D6C29A]'
            }`}
          >
            Edge (90°)
          </button>
          <button
            type="button"
            onClick={() => snapToAngle(180)}
            className={`shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              normalizedAngle >= 170 && normalizedAngle <= 190
                ? 'bg-[#D6C29A] text-[#0B132B] shadow-xs'
                : 'border border-[#1E2C4F] bg-[#0B132B] text-[#B8C2D9] hover:border-[#D6C29A] hover:text-[#D6C29A]'
            }`}
          >
            Back (180°)
          </button>
          <button
            type="button"
            onClick={() => snapToAngle(270)}
            className={`shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              normalizedAngle >= 260 && normalizedAngle <= 280
                ? 'bg-[#D6C29A] text-[#0B132B] shadow-xs'
                : 'border border-[#1E2C4F] bg-[#0B132B] text-[#B8C2D9] hover:border-[#D6C29A] hover:text-[#D6C29A]'
            }`}
          >
            Edge (270°)
          </button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={toggleAutoSpin}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#1E2C4F] bg-[#0B132B] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#F5F3EE] shadow-xs transition-colors hover:border-[#D6C29A] hover:text-[#D6C29A] cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3 text-[#D6C29A]" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 text-[#D6C29A]" />
                <span>Spin</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={resetView}
            title="Reset to 0°"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E2C4F] bg-[#0B132B] text-[#B8C2D9] shadow-xs transition-colors hover:text-[#F5F3EE] hover:border-[#D6C29A] cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

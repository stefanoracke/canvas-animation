"use client"
import React, { useEffect, useRef } from 'react'
import useWindows from './useWindows'
import Text from './Text'


export default function Scene() {
    const { dimension } = useWindows();
    const canvasRef = useRef(null);
    const prevPosition = useRef(null);

    useEffect(() => {
        if (dimension.width > 0) init();
    }, [dimension])

    const lerp = (x, y, a) => x * (1 - a) + y * a

    const init = () => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, dimension.width, dimension.height);
            ctx.globalCompositeOperation = "destination-out"
        }
    }

    const manageMouseMove = (e) => {
        const { clientX, clientY, movementX, movementY } = e;
        const speed = Math.max(Math.abs(movementX), Math.abs(movementY)) / 10;
        drawCircle(clientX, clientY, 70);
        if (prevPosition.current) {
            const { x, y } = prevPosition.current
            for (let i = 0; i < speed; i++) {
                const targetX = lerp(x, clientX, (1 / speed) * i)
                const targetY = lerp(y, clientY, (1 / speed) * i)
                drawCircle(targetX, targetY, 70)
            }
        }
        prevPosition.current = {
            x: clientX,
            y: clientY
        }
    }

    const drawCircle = (x, y, radius) => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }
    return (
        <>
            {dimension.width != 0 && <Text></Text>}
            {dimension.width == 0 && <div className="w-full h-full z-20 absolute top-0 bg-[#000]"></div>}
            <div className='relative w-full h-full z-0'>
                <canvas onMouseMove={manageMouseMove} ref={canvasRef} height={dimension.height} width={dimension.width} ></canvas>
            </div>
        </>
    )
}

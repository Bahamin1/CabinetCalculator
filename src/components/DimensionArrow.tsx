import { Html, Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'
import * as THREE from 'three'

interface DimensionArrowProps {
  start: THREE.Vector3
  end: THREE.Vector3
  label: string
  color?: string
}

export const DimensionArrow: React.FC<DimensionArrowProps> = ({ start, end, label, color = "yellow" }) => {
  const labelRef = useRef<HTMLDivElement>(null)
  const direction = new THREE.Vector3().subVectors(end, start)
  const length = direction.length()
  
  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
  const arrowHeadLength = Math.min(length * 0.1, 0.1) // 10% of arrow length, max 0.1 units

  useFrame(({ camera }) => {
    if (labelRef.current) {
      const tempV = midpoint.clone()
      tempV.project(camera)
      const x = (tempV.x * .5 + .5) * window.innerWidth
      const y = (tempV.y * -.5 + .5) * window.innerHeight
      labelRef.current.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`
    }
  })

  if (length < 0.0001) {
    return null
  }

  return (
    <group>
      <Line
        points={[start, end]}
        color={color}
        lineWidth={2}
        dashed={false}
      />
      <Line
        points={[
          end.clone().sub(direction.clone().normalize().multiplyScalar(arrowHeadLength)),
          end
        ]}
        color={color}
        lineWidth={2}
      />
      <Line
        points={[
          start.clone().add(direction.clone().normalize().multiplyScalar(arrowHeadLength)),
          start
        ]}
        color={color}
        lineWidth={2}
      />
      <Html>
        <div
          ref={labelRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '2px 4px',
            borderRadius: '2px',
            fontSize: '10px',
            fontFamily: 'Arial, sans-serif',
            whiteSpace: 'nowrap',
            textShadow: '0 0 2px rgba(0,0,0,0.5)',
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  )
}


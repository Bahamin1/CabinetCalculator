'use client'

import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

type CabinetType = 'base' | 'wall' | 'full'
type DoorOrientation = 'vertical' | 'horizontal'
type DoorDivision = 'length' | 'height'

interface CabinetProps {
  type: CabinetType
  length: number
  height: number
  depth: number
  doorCount: number
  doorOrientation: DoorOrientation
  doorDivision: DoorDivision
  handleType: 'modern' | 'classic' | 'magnet'
}

const Cabinet: React.FC<CabinetProps> = ({
  type,
  length,
  height,
  depth,
  doorCount,
  doorOrientation,
  doorDivision,
  handleType,
}) => {
  const cabinetRef = useRef<THREE.Group>(null)
  const { scene } = useThree()

  const doorMaterial = useMemo(() => {
    const texture = new THREE.TextureLoader().load('/textures/1.jpg')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 1)

    // تنظیمات روشنایی برای متریال
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.4,  // کمی فلزی بودن
      roughness: 0.1,  // سطح کمی صیقلی
    })

    return material
  }, [])

  const cabinetGeometry = useMemo(() => {
    const l = length / 100
    const h = height / 100
    const d = depth / 100
    const doorThickness = 0.016 // 1.6 cm door thickness
    const frameGap = 0.005 // 1 mm gap from frame
    const doorGap = 0.003 // 2 mm gap between doors

    const renderHandle = (doorWidth: number, doorHeight: number, xPos: number, yPos: number, zPos: number, cabinetType: 'base' | 'wall' | 'full') => {
      if (handleType === 'modern') {
        if (cabinetType === 'base') {
          return (
            <mesh position={[xPos, doorHeight / 0.981 - 0.0, 0.25 + doorThickness / 2 + 0.01]}>
              <boxGeometry args={[0.51, 0.07, 0.028]} />
              <meshStandardMaterial color='#808080' />
            </mesh>
          );
        }
      }
      
      
      if (handleType === 'classic') {
        // For base cabinets, handle at the top center of the door
        if (cabinetType === 'base') {
          return (
            <mesh position={[xPos, doorHeight / 1.1 - 0.00, zPos + doorThickness / 2 + 0.01]}>
              <boxGeometry args={[0.2, 0.02, 0.01]} />
              <meshStandardMaterial color="#808080" />
            </mesh>
          );
        }

        // For wall cabinets, handle at the bottom center of the door
        if (cabinetType === 'wall') {
          return (
            <mesh position={[xPos, -(doorHeight / 2 - 0.5), zPos + doorThickness / 2 + 0.01]}>
              <boxGeometry args={[0.2, 0.02, 0.01]} />
              <meshStandardMaterial color="#808080" />
            </mesh>
          );
        }

        // For full cabinets, handle at the center of the door
        if (cabinetType === 'full') {
          return (
            <mesh position={[xPos, doorHeight / 1, zPos + doorThickness / 2 + 0.01]}>
              <boxGeometry args={[0.2, 0.02, 0.01]} />
              <meshStandardMaterial color="#808080" />
            </mesh>
          );
        }
      }

      // Return null if handle type is not "classic"
      return null;
    };

    return (
      <group ref={cabinetRef}>
        {/* Cabinet body */}
        <mesh position={[0, h / 2, 0]}>
          <boxGeometry args={[l, h, d]} />
          <meshStandardMaterial  color="#dddedf" />
        </mesh>

        {/* Base cabinet additions */}
        {type === 'base' && (
          <>
            {/* Legs */}
            {[-1, 1].map((xPos) =>
              [-1, 1].map((zPos) => (
                <mesh key={`leg-${xPos}-${zPos}`} position={[
                  xPos * (l / 2 - 0.05), // Adjust to match countertop width
                  -0.025, // Height of the legs (relative to the cabinet body)
                  zPos * (d / 2 - 0.05), // Adjust to match countertop depth
                ]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.16, 16]} />
                  <meshStandardMaterial color="#020202"/>
                </mesh>
              ))
            )}
            {/* Countertop */}
            <mesh position={[0, h + 0.02, 0.02]}>
              <boxGeometry args={[l + 0.02, 0.05, d + 0.05]} />
              <meshStandardMaterial color="#f3f3f3" />
            </mesh>
            {handleType === 'modern' && (
              <mesh position={[0, h - 0.035, d / 2 - 0.0125]}>
                <boxGeometry args={[l, 0.07, 0.025]} />
                <meshStandardMaterial color="#dddedf" />
              </mesh>
            )}
          </>
        )}

        {/* Doors */}
        {Array.from({ length: doorCount }).map((_, index) => {
          let doorWidth: number, doorHeight: number, xPos: number, yPos: number, zPos: number
          if ((type === 'wall' || type === 'full') && (doorOrientation === 'horizontal' || (type === 'full' && doorDivision === 'height'))) {
            doorWidth = l - 2 * frameGap
            doorHeight = (h - (doorCount + 1) * frameGap - doorCount * doorGap) / doorCount
            xPos = 0
            yPos = h - frameGap - (index + 0.5) * (doorHeight + frameGap + doorGap)
            zPos = d / 2 + doorThickness / 2
          } else {
            doorWidth = (l - (doorCount + 1) * frameGap - (doorCount - 1) * doorGap) / doorCount
            doorHeight = h - 2 * frameGap
            xPos = -l / 2 + frameGap + (index + 0.49) * (doorWidth + frameGap + doorGap)
            yPos = h / 2
            zPos = d / 2 + doorThickness / 2
          }

          if (type === 'full' && doorDivision === 'height') {
            yPos = h / 2 - (index - (doorCount - 1) / 2) * (doorHeight + frameGap + doorGap)
          }

          if (handleType === 'modern' && type === 'base') {
            doorHeight -= 0.045 // Reduce door height by 4.5 cm
            yPos -= 0.0225 // Adjust door position
          }

          return (
            <group key={index}>
              <mesh position={[xPos, yPos, zPos]}>
                <boxGeometry args={[doorWidth, doorHeight, doorThickness]} />
                <primitive object={doorMaterial} />
              </mesh>
              {renderHandle(doorWidth, doorHeight, xPos, yPos, zPos, type)}
            </group>
          )
        })}
      </group>
    )
  }, [type, length, height, depth, doorCount, doorOrientation, doorDivision, doorMaterial, handleType])

  // Center the cabinet
  useFrame(() => {
    if (cabinetRef.current) {
      cabinetRef.current.position.set(0, type === 'base' ? -height / 200 : type === 'wall' ? -height / 300 : type === 'full' ? -height / 200 :  0, 0)
    }
  })

  return cabinetGeometry
}

export const CabinetVisualization: React.FC<CabinetProps> = (props) => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, Math.max(props.length, props.height, props.depth) / 50]} />
        <ambientLight intensity={3} />  {/* روشنایی ملایم */}
        <pointLight position={[10, 10, 10]} intensity={1.5} /> {/* نور نقطه‌ای با شدت بیشتر */}
        <directionalLight position={[0, 10, 10]} intensity={2} /> {/* نور جهت‌دار */}
        <Cabinet {...props} />
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={Math.max(props.length, props.height, props.depth) / 100}
          maxDistance={Math.max(props.length, props.height, props.depth) / 25}
        />
      </Canvas>
    </div>
  )
}


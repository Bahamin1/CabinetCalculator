import { useFrame, useThree } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { DimensionArrow } from './DimensionArrow'

interface CabinetProps {
  type: 'base' | 'wall' | 'full'
  length: number
  height: number
  depth: number
  doorCount: number
  doorOrientation: 'vertical' | 'horizontal'
  doorDivision: 'length' | 'height'
  backPanelType: 'normal' | 'fitting' | 'mdf'
  handleType: 'classic' | 'modern'
  showDimensions: boolean
}

export const Cabinet: React.FC<CabinetProps> = ({
  type,
  length,
  height,
  depth,
  doorCount,
  doorOrientation,
  doorDivision,
  backPanelType,
  handleType,
  showDimensions,
}) => {
  const cabinetRef = useRef<THREE.Group>(null)
  const { scene } = useThree()

  const doorMaterial = useMemo(() => {
    const texture = new THREE.TextureLoader().load('/textures/1.jpg')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 1)

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.5,
      roughness: 0.5,
    })

    return material
  }, [])

  const cabinetGeometry = useMemo(() => {
    const l = Math.max(length, 0.1) / 100
    const h = Math.max(height, 0.1) / 100
    const d = Math.max(depth, 0.1) / 100
    const doorThickness = 0.016
    const frameGap = 0.005
    const doorGap = 0.003

    // Adjust dimensions based on handle type
    let adjustedHeight = h
    let lProfileHeight = 0
    if (handleType === 'modern' && type === 'base') {
      adjustedHeight -= 0.045 // Reduce door height by 4.5 cm
      lProfileHeight = 0.07 // L profile height of 7 cm
    }

    // Calculate back panel dimensions
    let backPanelWidth = l
    let backPanelHeight = h
    if (backPanelType === 'fitting') {
      backPanelWidth -= 0.0016 // Reduce by 1.6 mm (0.8 mm on each side)
      backPanelHeight -= 0.0016
    } else if (backPanelType === 'mdf') {
      backPanelWidth -= 0.032 // Reduce by 3.2 cm
      if (type === 'base') {
        backPanelHeight -= 0.016 // Reduce by 1.6 cm for base cabinets
      } else {
        backPanelHeight -= 0.032 // Reduce by 3.2 cm for wall cabinets
      }
    }

    return (
      <group ref={cabinetRef}>
        {/* Cabinet body */}
        <mesh position={[0, h / 2, 0]}>
          <boxGeometry args={[l, h, d]} />
          <meshStandardMaterial color="#dddedf" />
        </mesh>

        {/* Back panel */}
        <mesh position={[0, h / 2, -d / 2 + 0.001]}>
          <boxGeometry args={[backPanelWidth, backPanelHeight, 0.003]} />
          <meshStandardMaterial color="#c0c0c0" />
        </mesh>

        {/* Base cabinet additions */}
        {type === 'base' && (
          <>
            {/* Legs */}
            {[-1, 1].map((xPos) =>
              [-1, 1].map((zPos) => (
                <mesh key={`leg-${xPos}-${zPos}`} position={[
                  xPos * (l / 2 - 0.05),
                  -0.025,
                  zPos * (d / 2 - 0.05),
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
            {/* L profile for modern handle */}
            {handleType === 'modern' && (
              <mesh position={[0, h - lProfileHeight / 2, d / 2 - 0.025 / 2]}>
                <boxGeometry args={[l, lProfileHeight, 0.025]} />
                <meshStandardMaterial color="#dddedf" />
              </mesh>
            )}
          </>
        )}

        {/* Doors */}
        {Array.from({ length: Math.max(doorCount, 1) }).map((_, index) => {
          let doorWidth: number, doorHeight: number, xPos: number, yPos: number, zPos: number
          if ((type === 'wall' || type === 'full') && doorOrientation === 'horizontal') {
            doorWidth = Math.max(l - 2 * frameGap, 0.01)
            doorHeight = Math.max((adjustedHeight - (doorCount + 1) * frameGap - doorCount * doorGap) / Math.max(doorCount, 1), 0.01)
            xPos = 0
            yPos = adjustedHeight / 2 - frameGap - (index + 0.5) * (doorHeight + frameGap + doorGap)
            zPos = d / 2 + doorThickness / 2
          } else {
            doorWidth = Math.max((l - (doorCount + 1) * frameGap - (doorCount - 1) * doorGap) / Math.max(doorCount, 1), 0.01)
            doorHeight = Math.max(adjustedHeight - 2 * frameGap, 0.01)
            xPos = -l / 2 + frameGap + (index + 0.5) * (doorWidth + frameGap + doorGap)
            yPos = adjustedHeight / 2
            zPos = d / 2 + doorThickness / 2
          }

          return (
            <group key={index}>
              <mesh position={[xPos, yPos, zPos]}>
                <boxGeometry args={[doorWidth, doorHeight, doorThickness]} />
                <primitive object={doorMaterial} />
              </mesh>
              {/* Classic handle */}
              {handleType === 'classic' && (
                <mesh position={[xPos + doorWidth / 2 - 0.02, yPos, zPos + doorThickness / 2 + 0.01]}>
                  <boxGeometry args={[0.04, 0.1, 0.02]} />
                  <meshStandardMaterial color="#808080" />
                </mesh>
              )}
            </group>
          )
        })}

        {/* Dimension arrows */}
        {showDimensions && (
          <>
            <DimensionArrow 
              start={new THREE.Vector3(-l/2, -h/2, d/2 + 0.02)} 
              end={new THREE.Vector3(l/2, -h/2, d/2 + 0.02)} 
              label={`Width: ${length.toFixed(1)} cm`} 
            />
            <DimensionArrow 
              start={new THREE.Vector3(-l/2 - 0.02, -h/2, d/2)} 
              end={new THREE.Vector3(-l/2 - 0.02, h/2, d/2)} 
              label={`Height: ${height.toFixed(1)} cm`} 
            />
            <DimensionArrow 
              start={new THREE.Vector3(-l/2, -h/2, -d/2)} 
              end={new THREE.Vector3(-l/2, -h/2, d/2)} 
              label={`Depth: ${depth.toFixed(1)} cm`} 
            />
          </>
        )}
      </group>
    )
  }, [type, length, height, depth, doorCount, doorOrientation, doorDivision, backPanelType, handleType, showDimensions, doorMaterial])

  // Center the cabinet
  useFrame(() => {
    if (cabinetRef.current) {
      cabinetRef.current.position.set(0, type === 'base' ? -height / 200 : type === 'wall' ? -height / 300 : type === 'full' ? -height / 200 : 0, 0)
    }
  })

  return cabinetGeometry
}


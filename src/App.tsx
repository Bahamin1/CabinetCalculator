'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/lable"
import { RadioGroup, RadioGroupItem } from "./components/ui/radioGroup"
import { ScrollArea } from "./components/ui/scrollArea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Switch } from "./components/ui/switch"

type CabinetType = 'base' | 'wall'
type DoorOrientation = 'vertical' | 'horizontal'


interface Dimensions {
  کف  : string
  کنارها: string
  سفف: string
  پشت: string
  درب: string
  پارتیشن?: string
  طبقه?: string
  قید?: string
  قیددرب?: string
}

interface CabinetUnit {
  type: CabinetType
  length: number
  height: number
  depth: number
  includeShelf: boolean
  doorCount: number
  doorOrientation: DoorOrientation
  dimensions: Dimensions
}

export default function CabinetCalculator() {
  const [length, setLength] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [depth, setDepth] = useState<number>(0)
  const [includeShelf, setIncludeShelf] = useState<boolean>(false)
  const [cabinetType, setCabinetType] = useState<CabinetType>('base')
  const [doorCount, setDoorCount] = useState<number>(2)
  const [manualDoorCount, setManualDoorCount] = useState<number | null>(null)
  const [doorOrientation, setDoorOrientation] = useState<DoorOrientation>('vertical')
  const [dimensions, setDimensions] = useState<Dimensions | null>(null)
  const [history, setHistory] = useState<CabinetUnit[]>([])

  useEffect(() => {
    if (cabinetType === 'base') {
      setDepth(56)
      setHeight(72)
      setDoorOrientation('vertical')
    } else {
      setDepth(32)
      setHeight(83)
    }
  }, [cabinetType])

  useEffect(() => {
    if (length > 0 && !manualDoorCount) {
      if (length < 60) {
        setDoorCount(1)
      } else if (length < 115) {
        setDoorCount(2)
      } else if (length < 128) {
        setDoorCount(3)
      } else {
        setDoorCount(4)
      }
    }
  }, [length, manualDoorCount])

  useEffect(() => {
    if (length > 0 && height > 0 && depth > 0) {
      calculateDimensions()
    }
  }, [length, height, depth, includeShelf, cabinetType, doorCount, doorOrientation])

  const calculateDimensions = () => {
    let newDimensions: Dimensions

    if (cabinetType === 'base') {
      newDimensions = {
        کف: `${length}x${depth} ( x 1 )`,
        کنارها: `${height}x${depth} ( x 2 )`,
        سفف: `7x${(length - 3.2).toFixed(1)} ( x 2 )`,
        پشت: `${length}x${(height - 2).toFixed(1)} ( x 1 )`,
        درب: calculateDoor(),
        طبقه: includeShelf ? `${(length - 3.2).toFixed(1)}x${(depth - 2).toFixed(1)}` : undefined,
        قید: `7x${(length - 3.2).toFixed(1)} ( x 2 )`
      }

      if (length > 110) {
        newDimensions.پارتیشن = `7x${height} ( x 3 )`
      }
    } else {
      newDimensions = {
        کف: `${length}x${depth} ( x 1 )`,
        کنارها: `${height}x${depth} ( x 2 )`,
        سفف: `${length}x${depth} ( x 1 )`,
        پشت: `${length}x${height} ( x 1 )`,
        درب: calculateDoor(),
        طبقه: includeShelf ? `${(length - 3.2).toFixed(1)}x${depth - 1}` : undefined,
        قید: `7x${(length - 3.2).toFixed(1)} ( x 2 )`
      }

      if (doorOrientation === 'horizontal') {
        newDimensions.قیددرب = calculateقیددرب()
      }
    }

    setDimensions(newDimensions)
  }

  const calculateDoor = (): string => {
    if (cabinetType === 'base') {
      const doorWidth = (length / doorCount)
      const doorHeight = height - 2
      return `${doorHeight}x${(doorWidth - 0.6).toFixed(1)} ( x ${doorCount} ${doorCount > 1 ? '' : ''})`
    } else {
      if (doorOrientation === 'vertical') {
        const doorWidth = (length / doorCount)
        const doorHeight = height - 0.6
        return `${doorHeight}x${(doorWidth - 0.6).toFixed(1)} ( x ${doorCount} ${doorCount > 1 ? '' : ''})`
      } else {
        const doorHeight = height / doorCount
        return `${(doorHeight - 0.6).toFixed(1)}x${(length - 0.6).toFixed(1)} ( x ${doorCount} ${doorCount > 1 ? '' : ''})`
      }
    }
  }

  const calculateقیددرب = (): string => {
    const qeydCount = Math.max(0, doorCount - 1)
    const qeydLength = (length / 100) * 69.8
    return `7x${qeydLength.toFixed(1)} ( x ${qeydCount} )`
  }

  const storeInHistory = () => {
    if (dimensions) {
      const newUnit: CabinetUnit = {
        type: cabinetType,
        length,
        height,
        depth,
        includeShelf,
        doorCount,
        doorOrientation,
        dimensions
      }
      setHistory([...history, newUnit])
    }
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">محاسبه‌گر کابینت آشپزخانه</h1>
      <div className="grid gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>ابعاد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="length">طول (سانتی‌متر)</Label>
              <Input
                id="length"
                type="number"
                value={length || ''}
                onChange={(e) => setLength(Number(e.target.value))}
                placeholder="طول کابینت را وارد کنید"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="height">ارتفاع (سانتی‌متر)</Label>
              <Input
                id="height"
                type="number"
                value={height || ''}
                onChange={(e) => setHeight(Number(e.target.value))}
                placeholder="ارتفاع کابینت را وارد کنید"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="depth">عمق (سانتی‌متر)</Label>
              <Input
                id="depth"
                type="number"
                value={depth || ''}
                onChange={(e) => setDepth(Number(e.target.value))}
                placeholder="عمق کابینت را وارد کنید"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>گزینه‌های کابینت</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>نوع کابینت</Label>
              <RadioGroup defaultValue="base" onValueChange={(value: CabinetType) => setCabinetType(value)} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="base" id="base" />
                  <Label htmlFor="base">کابینت زمینی</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wall" id="wall" />
                  <Label htmlFor="wall">کابینت دیواری</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="include-shelf"
                checked={includeShelf}
                onCheckedChange={setIncludeShelf}
              />
              <Label htmlFor="include-shelf">شامل طبقه</Label>
            </div>
            <div>
              <Label htmlFor="doorCount">تعداد دربها</Label>
              <Input
                id="doorCount"
                type="number"
                value={manualDoorCount || doorCount}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  setManualDoorCount(value)
                  setDoorCount(value)
                }}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                {manualDoorCount ? 'دستی' : 'خودکار'} (بر اساس طول)
              </p>
            </div>
            {cabinetType === 'wall' && (
              <div>
                <Label htmlFor="doorOrientation">جهت درب</Label>
                <Select
                  value={doorOrientation}
                  onValueChange={(value: DoorOrientation) => setDoorOrientation(value)}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="جهت درب را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vertical">عمودی</SelectItem>
                    <SelectItem value="horizontal">افقی</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ابعاد محاسبه‌شده</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {dimensions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-2"
                >
                  {Object.entries(dimensions).map(([key, value]) => (
                    <motion.div key={key} layout className="flex justify-between">
                      <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className={key === 'door' ? 'font-bold text-primary' : ''}>{value}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-8 mb-8">
        <Button onClick={storeInHistory} size="lg" className="custom-button w-full max-w-md">
          ذخیره در تاریخچه
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تاریخچه</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {history.map((unit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-4 p-4 border rounded-md bg-white shadow-sm"
              >
                <h3 className="font-semibold mb-2">
                  {unit.type === 'base' ? 'کابینت زمینی' : 'کابینت دیواری'} {unit.length} سانتی‌متر
                </h3>
                <p>کف: {unit.dimensions.کف}</p>
                <p>کناره‌ها: {unit.dimensions.کنارها}</p>
                <p>بالا: {unit.dimensions.سفف}</p>
                <p>پشت: {unit.dimensions.پشت}</p>
                <p>در: {unit.dimensions.درب}</p>
                {unit.dimensions.پارتیشن && <p>پارتیشن میانی: {unit.dimensions.پارتیشن}</p>}
                {unit.dimensions.طبقه && <p>طبقه: {unit.dimensions.طبقه}</p>}
                <p>قید : {unit.dimensions.قید}</p>
                {unit.dimensions.قیددرب && <p>یادداشت درب: {unit.dimensions.قیددرب}</p>}
                {unit.type === 'wall' && <p>جهت درب: {unit.doorOrientation}</p>}
              </motion.div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
);


}
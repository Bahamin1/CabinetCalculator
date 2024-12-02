'use client'

import { Separator } from '@radix-ui/react-select'
import { AnimatePresence, motion } from 'framer-motion'
import { Calculator, DoorOpen, Globe, History, Layers, Ruler } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/lable"
import { RadioGroup, RadioGroupItem } from "./components/ui/radioGroup"
import { ScrollArea } from "./components/ui/scrollArea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Switch } from "./components/ui/switch"

type CabinetType = 'base' | 'wall' | 'full'
type DoorOrientation = 'vertical' | 'horizontal'
type DoorDivision = 'length' | 'height'
type Language = 'EN' | 'FA'

interface Dimensions {
  floor: string
  sides: string
  top: string
  back: string
  door: string
  middlePartition?: string
  shelf?: string
  additionalPiece?: string
  doorQeyd?: string
}

interface CabinetUnit {
  type: CabinetType
  length: number
  height: number
  depth: number
  includeShelf: boolean
  shelfCount: number
  doorCount: number
  doorOrientation: DoorOrientation
  doorDivision: DoorDivision
  dimensions: Dimensions
}

const translations = {
  EN: {
    title: "Kitchen Cabinet Calculator",
    dimensions: "Dimensions",
    length: "Length (cm)",
    height: "Height (cm)",
    depth: "Depth (cm)",
    cabinetOptions: "Cabinet Options",
    cabinetType: "Cabinet Type",
    baseType: "Base Cabinet",
    wallType: "Wall Cabinet",
    fullType: "Full Height Cabinet",
    includeShelf: "Include Shelf",
    shelfCount: "Number of Shelves",
    doorConfiguration: "Door Configuration",
    doorCount: "Number of Doors",
    doorOrientation: "Door Orientation",
    vertical: "Vertical",
    horizontal: "Horizontal",
    doorDivision: "Door Division",
    byLength: "By Length",
    byHeight: "By Height",
    calculatedDimensions: "Calculated Dimensions",
    storeInHistory: "Store in History",
    cabinetHistory: "Cabinet History",
    floor: "Floor",
    sides: "Sides",
    top: "Top",
    back: "Back",
    door: "Door",
    middlePartition: "Middle Partition",
    shelf: "Shelf",
    additionalPiece: "Additional Piece",
    doorQeyd: "Door Qeyd",
    manual: "Manual",
    automatic: "Automatic (based on length)",
  },
  FA: {
    title: "محاسبه‌گر کابینت آشپزخانه",
    dimensions: "ابعاد",
    length: "طول (سانتی‌متر)",
    height: "ارتفاع (سانتی‌متر)",
    depth: "عمق (سانتی‌متر)",
    cabinetOptions: "گزینه‌های کابینت",
    cabinetType: "نوع کابینت",
    baseType: "کابینت زمینی",
    wallType: "کابینت دیواری",
    fullType: "کابینت تمام قد",
    includeShelf: "شامل قفسه",
    shelfCount: "تعداد قفسه‌ها",
    doorConfiguration: "پیکربندی درب",
    doorCount: "تعداد درب‌ها",
    doorOrientation: "جهت درب",
    vertical: "عمودی",
    horizontal: "افقی",
    doorDivision: "تقسیم درب",
    byLength: "بر اساس طول",
    byHeight: "بر اساس ارتفاع",
    calculatedDimensions: "ابعاد محاسبه شده",
    storeInHistory: "ذخیره در تاریخچه",
    cabinetHistory: "تاریخچه کابینت",
    floor: "کف",
    sides: "طرفین",
    top: "بالا",
    back: "پشت",
    door: "درب",
    middlePartition: "پارتیشن میانی",
    shelf: "قفسه",
    additionalPiece: "قطعه اضافی",
    doorQeyd: "قید درب",
    manual: "دستی",
    automatic: "خودکار (بر اساس طول)",
  }
}

export default function CabinetCalculator() {
  const [language, setLanguage] = useState<Language>('EN')
  const [length, setLength] = useState<number>(100)
  const [height, setHeight] = useState<number>(72)
  const [depth, setDepth] = useState<number>(56)
  const [includeShelf, setIncludeShelf] = useState<boolean>(false)
  const [shelfCount, setShelfCount] = useState<number>(1)
  const [cabinetType, setCabinetType] = useState<CabinetType>('base')
  const [doorCount, setDoorCount] = useState<number>(2)
  const [manualDoorCount, setManualDoorCount] = useState<number | null>(null)
  const [doorOrientation, setDoorOrientation] = useState<DoorOrientation>('vertical')
  const [doorDivision, setDoorDivision] = useState<DoorDivision>('length')
  const [dimensions, setDimensions] = useState<Dimensions | null>(null)
  const [history, setHistory] = useState<CabinetUnit[]>([])

  const t = translations[language]

  useEffect(() => {
    if (cabinetType === 'base') {
      setDepth(56)
      setHeight(72)
      setDoorOrientation('vertical')
      setShelfCount(1)
      setDoorDivision('length')
    } else if (cabinetType === 'wall') {
      setDepth(32)
      setHeight(83)
      setShelfCount(1)
      setDoorDivision('length')
    } else if (cabinetType === 'full') {
      setDepth(56)
      setHeight(240)
      setDoorOrientation('vertical')
      setShelfCount(4)
      setDoorDivision('length')
    }
  }, [cabinetType])

  useEffect(() => {
    if (length > 0 && !manualDoorCount) {
      if (cabinetType === 'full' && doorDivision === 'length') {
        setDoorCount(length < 60 ? 1 : 2)
      } else if (cabinetType === 'full' && doorDivision === 'height') {
        setDoorCount(2)
      } else {
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
    }
  }, [length, manualDoorCount, cabinetType, doorDivision])

  useEffect(() => {
    if (length > 0 && height > 0 && depth > 0) {
      calculateDimensions()
    }
  }, [length, height, depth, includeShelf, shelfCount, cabinetType, doorCount, doorOrientation, doorDivision])

  const calculateDimensions = () => {
    let newDimensions: Dimensions = {
      floor: `${length}x${depth} ( x 1 )`,
      sides: `${height}x${depth} ( x 2 )`,
      top: `${length}x${depth} ( x 1 )`,
      back: `${length}x${height} ( x 1 )`,
      door: calculateDoor(),
      additionalPiece: `7x${(length - 3.2).toFixed(1)} ( x 2 )`
    }

    if (cabinetType === 'base') {
      newDimensions.top = `7x${(length - 3.2).toFixed(1)} ( x 2 )`
      newDimensions.back = `${length}x${(height - 2).toFixed(1)} ( x 1 )`
      if (length > 110) {
        newDimensions.middlePartition = `7x${height} ( x 3 )`
      }
    }

    if (includeShelf) {
      newDimensions.shelf = `${(length - 3.2).toFixed(1)}x${(depth - (cabinetType === 'wall' ? 1 : 2)).toFixed(1)} ( x ${shelfCount} )`
    }

    if (cabinetType === 'wall' && doorOrientation === 'horizontal') {
      newDimensions.doorQeyd = calculateDoorQeyd()
    }

    setDimensions(newDimensions)
  }

  const calculateDoor = (): string => {
    if (cabinetType === 'base') {
      const doorWidth = (length / doorCount)
      const doorHeight = height - 2
      return `${doorHeight}x${(doorWidth - 0.6).toFixed(1)} ( x ${doorCount} )`
    } else if (cabinetType === 'wall') {
      if (doorOrientation === 'vertical') {
        const doorWidth = (length / doorCount)
        const doorHeight = height - 0.6
        return `${doorHeight}x${(doorWidth - 0.6).toFixed(1)} ( x ${doorCount} )`
      } else {
        const doorHeight = height / doorCount
        return `${(doorHeight - 0.6).toFixed(1)}x${(length - 0.6).toFixed(1)} ( x ${doorCount} )`
      }
    } else if (cabinetType === 'full') {
      if (doorDivision === 'length') {
        const doorWidth = (length / doorCount)
        const doorHeight = height - 2
        return `${doorHeight}x${(doorWidth - 0.6).toFixed(1)} ( x ${doorCount} )`
      } else {
        const doorWidth = length - 0.6
        const doorHeight = (height / doorCount) - 0.6
        return `${doorHeight.toFixed(1)}x${doorWidth.toFixed(1)} ( x ${doorCount} )`
      }
    }
    return ''
  }

  const calculateDoorQeyd = (): string => {
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
        shelfCount,
        doorCount,
        doorOrientation,
        doorDivision,
        dimensions
      }
      setHistory([...history, newUnit])
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 ${language === 'FA' ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800">{t.title}</h1>
          <Button
            onClick={() => setLanguage(lang => lang === 'EN' ? 'FA' : 'EN')}
            variant="outline"
            size="icon"
          >
            <Globe className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="col-span-1 lg:col-span-2 bg-white shadow-lg">
            <CardHeader className="bg-indigo-600 text-white">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Calculator className="w-6 h-6" />
                <span>{t.cabinetOptions}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
                    <Ruler className="w-5 h-5" />
                    {t.dimensions}
                  </h3>
                  <div>
                    <Label htmlFor="length" className="text-sm font-medium text-gray-700">{t.length}</Label>
                    <Input
                      id="length"
                      type="number"
                      value={length || ''}
                      onChange={(e) => setLength(Number(e.target.value))}
                      className="mt-1 w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-sm font-medium text-gray-700">{t.height}</Label>
                    <Input
                      id="height"
                      type="number"
                      value={height || ''}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="mt-1 w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="depth" className="text-sm font-medium text-gray-700">{t.depth}</Label>
                    <Input
                      id="depth"
                      type="number"
                      value={depth || ''}
                      onChange={(e) => setDepth(Number(e.target.value))}
                      className="mt-1 w-full"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
                    <DoorOpen className="w-5 h-5" />
                    {t.cabinetOptions}
                  </h3>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">{t.cabinetType}</Label>
                    <RadioGroup defaultValue={cabinetType} onValueChange={(value: CabinetType) => setCabinetType(value)} className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="base" id="base" />
                        <Label htmlFor="base">{t.baseType}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="wall" id="wall" />
                        <Label htmlFor="wall">{t.wallType}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="full" id="full" />
                        <Label htmlFor="full">{t.fullType}</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-shelf"
                      checked={includeShelf}
                      onCheckedChange={setIncludeShelf}
                    />
                    <Label htmlFor="include-shelf" className="text-sm font-medium text-gray-700">{t.includeShelf}</Label>
                  </div>
                  {includeShelf && (
                    <div>
                      <Label htmlFor="shelfCount" className="text-sm font-medium text-gray-700">{t.shelfCount}</Label>
                      <Input
                        id="shelfCount"
                        type="number"
                        value={shelfCount}
                        onChange={(e) => setShelfCount(Number(e.target.value))}
                        className="mt-1 w-full"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    {t.doorConfiguration}
                  </h3>
                  <div>
                    <Label htmlFor="doorCount" className="text-sm font-medium text-gray-700">{t.doorCount}</Label>
                    <Input
                      id="doorCount"
                      type="number"
                      value={manualDoorCount || doorCount}
                      onChange={(e) => {
                        const value = Number(e.target.value)
                        setManualDoorCount(value)
                        setDoorCount(value)
                      }}
                      className="mt-1 w-full"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {manualDoorCount ? t.manual : t.automatic}
                    </p>
                  </div>
                  {cabinetType === 'wall' && (
                    <div>
                      <Label htmlFor="doorOrientation" className="text-sm font-medium text-gray-700">{t.doorOrientation}</Label>
                      <Select
                        value={doorOrientation}
                        onValueChange={(value: DoorOrientation) => setDoorOrientation(value)}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder={t.doorOrientation} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vertical">{t.vertical}</SelectItem>
                          <SelectItem value="horizontal">{t.horizontal}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {cabinetType === 'full' && (
                    <div>
                      <Label htmlFor="doorDivision" className="text-sm font-medium text-gray-700">{t.doorDivision}</Label>
                      <Select
                        value={doorDivision}
                        onValueChange={(value: DoorDivision) => setDoorDivision(value)}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder={t.doorDivision} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="length">{t.byLength}</SelectItem>
                          <SelectItem value="height">{t.byHeight}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
              <Separator className="my-6" />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  {t.calculatedDimensions}
                </h3>
                <AnimatePresence>
                  {dimensions && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {Object.entries(dimensions).map(([key, value]) => (
                        <motion.div key={key} layout className="bg-indigo-50 p-3 rounded-md">
                          <span className="capitalize font-medium text-indigo-700">{t[key as keyof typeof t]}:</span>
                          <span className={`block mt-1 ${key === 'door' ? 'font-bold text-indigo-600' : 'text-gray-700'}`}>{value}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="mt-6 flex justify-center">
                <Button onClick={storeInHistory} size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <History className="w-5 h-5 mr-2" />
                  {t.storeInHistory}
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-1 lg:col-span-2 bg-white shadow-lg">
            <CardHeader className="bg-indigo-600 text-white">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <History className="w-6 h-6" />
                <span>{t.cabinetHistory}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                {history.map((unit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="mb-4 p-4 border rounded-md bg-indigo-50 shadow-sm"
                  >
                    <h3 className="font-semibold mb-2 text-indigo-700">
                      {t[unit.type as keyof typeof t]} {unit.length} cm
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><span className="font-medium">{t.floor}:</span> {unit.dimensions.floor}</p>
                      <p><span className="font-medium">{t.sides}:</span> {unit.dimensions.sides}</p>
                      <p><span className="font-medium">{t.top}:</span> {unit.dimensions.top}</p>
                      <p><span className="font-medium">{t.back}:</span> {unit.dimensions.back}</p>
                      <p><span className="font-medium">{t.door}:</span> {unit.dimensions.door}</p>
                      {unit.dimensions.middlePartition && <p><span className="font-medium">{t.middlePartition}:</span> {unit.dimensions.middlePartition}</p>}
                      {unit.dimensions.shelf && <p><span className="font-medium">{t.shelf}:</span> {unit.dimensions.shelf}</p>}
                      <p><span className="font-medium">{t.additionalPiece}:</span> {unit.dimensions.additionalPiece}</p>
                      {unit.dimensions.doorQeyd && <p><span className="font-medium">{t.doorQeyd}:</span> {unit.dimensions.doorQeyd}</p>}
                      {unit.type === 'wall' && <p><span className="font-medium">{t.doorOrientation}:</span> {t[unit.doorOrientation as keyof typeof t]}</p>}
                      {unit.type === 'full' && <p><span className="font-medium">{t.doorDivision}:</span> {t[unit.doorDivision === 'length' ? 'byLength' : 'byHeight']}</p>}
                    </div>
                  </motion.div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
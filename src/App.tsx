'use client'

import { Separator } from '@radix-ui/react-select'
import { AnimatePresence, motion } from 'framer-motion'
import { Calculator, DoorOpen, Eye, Globe, History, Layers, Ruler } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import styles from './CabinetCalculator.module.css'
import { CabinetVisualization } from './components/CabinetVisualization'
import visualizationStyles from './components/CabinetVisualization.module.css'
import { ModelToggle } from './components/ModelToggle'
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { RadioGroup, RadioGroupItem } from "./components/ui/radioGroup"
import { ScrollArea } from "./components/ui/scrollArea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Toggle } from "./components/ui/toggle"


type CabinetType = 'base' | 'wall' | 'full'
type DoorOrientation = 'vertical' | 'horizontal'
type DoorDivision = 'length' | 'height'
type Language = 'EN' | 'FA'
type HandleType = 'modern' | 'classic' | 'magnet'
type BackConnectionType = 'mp-mounted' | 'mp-fitting' | 'mdf-full-fit'

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
  handleType: HandleType
  backConnectionType: BackConnectionType
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
    cabinetVisualization: "Cabinet Visualization",
    handleType: "Handle Type",
    modern: "Modern",
    classic: "Classic",
    magnet: "Magnet",
    backConnectionType: "Back Connection Type",
    mpMounted: "MP (Mounted on the Body)",
    mpFitting: "MP (Fitting/Slot)",
    mdfFullFit: "MDF (Full Fit)",
    showModel: "Show 3D Model",
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
    includeShelf: "شامل قفسه(طبقه)",
    shelfCount: "تعداد قفسه‌ها(طبقه)",
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
    cabinetVisualization: "تجسم کابینت",
    handleType: "نوع دستگیره",
    modern: "مدرن",
    classic: "کلاسیک",
    magnet: "مغناطیسی",
    backConnectionType: "نوع اتصال پشت",
    mpMounted: "MP (نصب شده روی بدنه)",
    mpFitting: "MP (فیتینگ/شیار)",
    mdfFullFit: "MDF (فیت کامل)",
    showModel: "نمایش مدل سه بعدی",
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
  const [handleType, setHandleType] = useState<HandleType>('modern')
  const [backConnectionType, setBackConnectionType] = useState<BackConnectionType>('mp-mounted')
  const [showModel, setShowModel] = useState<boolean>(() => {
    const stored = localStorage.getItem('showModel')
    return stored ? JSON.parse(stored) : true
  })

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
  }, [length, height, depth, includeShelf, shelfCount, cabinetType, doorCount, doorOrientation, doorDivision, handleType, backConnectionType])

  const calculateDimensions = () => {
    let newDimensions: Dimensions = {
      floor: `${length}x${depth} ( x 1 )`,
      sides: `${height - 1.6}x${depth} ( x 2 )`,
      top: `${length}x${depth} ( x 1 )`,
      back: calculateBackDimensions(),
      door: calculateDoor(),
      additionalPiece: `7x${(length - 3.2).toFixed(1)} ( x 2 )`
    }

    if (cabinetType === 'base') {
      newDimensions.top = `7x${(length - 3.2).toFixed(1)} ( x 2 )`
      newDimensions.back = calculateBackDimensions()
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

  const calculateBackDimensions = (): string => {
    let backWidth: number
    let backHeight: number

    switch (backConnectionType) {
      case 'mp-mounted':
        if (cabinetType === 'base') {
          backWidth = length
          backHeight = height + 1.6
        } else {
          backWidth = length
          backHeight = height
        }
        break
      case 'mp-fitting':
        backWidth = length - 1.6
        backHeight = height - 1.6
        break
      case 'mdf-full-fit':
        backWidth = length - 3.3
        backHeight = height
        break
      default:
        backWidth = length
        backHeight = height
    }

    return `${backWidth.toFixed(1)}x${backHeight.toFixed(1)} ( x 1 )`
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
        dimensions,
        handleType,
        backConnectionType
      }
      setHistory([...history, newUnit])
    }
  }

  const handleModelToggle = (checked: boolean) => {
    setShowModel(checked)
    localStorage.setItem('showModel', JSON.stringify(checked))
  }

  return (
    <div className={`${styles.container} ${language === 'FA' ? styles.rtl : styles.ltr}`}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t.title}</h1>
          <Button
            onClick={() => setLanguage(lang => lang === 'EN' ? 'FA' : 'EN')}
            variant="outline"
            size="icon"
            className={styles.languageToggle}
            aria-label={`Switch to ${language === 'EN' ? 'Persian' : 'English'}`}
          >
            <Globe className="h-4 w-4" />
          </Button>
        </div>
        <div className={styles.grid}>
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-6 h-6" />
                <span>{t.cabinetOptions}</span>
              </CardTitle>
            </CardHeader >
            <CardContent className={styles.cardContent}>
              <div className={styles.optionsGrid}>
                <div className={styles.optionSection}>
                  <h3 className={`${styles.sectionTitle} flex justify-center items-center`}>
                    <Ruler className="w-5 h-5" />
                    {t.dimensions}
                  </h3>
                  <div className={styles.inputGroup}>
                    <Label htmlFor="length" className={styles.label}>{t.length}</Label>
                    <Input
                      id="length"
                      type="number"
                      value={length || ''}
                      onChange={(e) => setLength(Number(e.target.value))}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <Label htmlFor="height" className={styles.label}>{t.height}</Label>
                    <Input
                      id="height"
                      type="number"
                      value={height || ''}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <Label htmlFor="depth" className={styles.label}>{t.depth}</Label>
                    <Input
                      id="depth"
                      type="number"
                      value={depth || ''}
                      onChange={(e) => setDepth(Number(e.target.value))}
                      className={styles.input}
                    />
                  </div>
                </div>
                <div className={styles.optionSection}>
                  <h3 className={`${styles.sectionTitle} flex justify-center items-center`}>
                    <DoorOpen className="w-6 h-6" />
                    {t.cabinetOptions}
                  </h3>
                  <div className={styles.radioGroup}>
                    <Label className={styles.label}>{t.cabinetType}</Label>
                    <RadioGroup defaultValue={cabinetType} onValueChange={(value: CabinetType) => setCabinetType(value)} className={styles.radioOptions}>
                      <div>
                        <RadioGroupItem value="base" id="base" />
                        <Label htmlFor="base">{t.baseType}</Label>
                      </div>
                      <div>
                        <RadioGroupItem value="wall" id="wall" />
                        <Label htmlFor="wall">{t.wallType}</Label>
                      </div>
                      <div>
                        <RadioGroupItem value="full" id="full" />
                        <Label htmlFor="full">{t.fullType}</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className={styles.selectGroup}>
                  <Label htmlFor="backConnectionType" className={styles.label}>{t.backConnectionType}</Label>
                  <Select
                    value={backConnectionType}
                    onValueChange={(value: BackConnectionType) => setBackConnectionType(value)}
                  >
                    <SelectTrigger className={`${styles.select} border-2 border-gray-300 rounded-lg`}>
                      <SelectValue placeholder={t.backConnectionType} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-gray-300 rounded-lg shadow-lg">
                      <SelectItem value="mp-mounted" className="hover:bg-gray-100">{t.mpMounted}</SelectItem>
                      <SelectItem value="mp-fitting" className="hover:bg-gray-100">{t.mpFitting}</SelectItem>
                      <SelectItem value="mdf-full-fit" className="hover:bg-gray-100">{t.mdfFullFit}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                  <div>
                    <Toggle
                      className="bg-gray-300 rounded-md p-2 transition-colors data-[state=on]:bg-green-500 data-[state=off]:bg-red-500"
                      pressed={includeShelf}
                      onPressedChange={setIncludeShelf}
                      aria-label="Toggle shelf inclusion"
                    >
                      {t.includeShelf}
                    </Toggle>
                  </div>
                  {includeShelf && (
                    <div>
                      <Label htmlFor="shelfCount">{t.shelfCount}</Label>
                      <Input
                        id="shelfCount"
                        type="number"
                        value={shelfCount}
                        onChange={(e) => setShelfCount(Number(e.target.value))}
                        className={styles.checkbox}
                      />
                    </div>
                  )}
                </div>
                <div className={styles.optionSection}>
                  <h3 className={`${styles.sectionTitle} flex justify-center items-center`}>
                    <Layers className="w-5 h-5" />
                    {t.doorConfiguration}
                  </h3>
                  <div className={styles.inputGroup}>
                    <Label htmlFor="doorCount" className={styles.label}>{t.doorCount}</Label>
                    <Input
                      id="doorCount"
                      type="number"
                      value={manualDoorCount || doorCount}
                      onChange={(e) => {
                        const value = Number(e.target.value)
                        setManualDoorCount(value)
                        setDoorCount(value)
                      }}
                      className={styles.input}
                    />
                    <p className={styles.helperText}>
                      {manualDoorCount ? t.manual : t.automatic}
                    </p>
                  </div>
                  {cabinetType === 'wall' && (
                    <div className={styles.selectGroup}>
                      <Label htmlFor="doorOrientation" className={styles.label}>{t.doorOrientation}</Label>
                      <Select
                        value={doorOrientation}
                        onValueChange={(value: DoorOrientation) => setDoorOrientation(value)}
                      >
                        <SelectTrigger className={styles.select}>
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
                    <div className={styles.selectGroup}>
                      <Label htmlFor="doorDivision" className={styles.label}>{t.doorDivision}</Label>
                      <Select
                        value={doorDivision}
                        onValueChange={(value: DoorDivision) => setDoorDivision(value)}
                      >
                        <SelectTrigger className={styles.select}>
                          <SelectValue placeholder={t.doorDivision} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="length">{t.byLength}</SelectItem>
                          <SelectItem value="height">{t.byHeight}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className={styles.selectGroup}>
                    <Label htmlFor="handleType" className={styles.label}>{t.handleType}</Label>
                    <Select
                      value={handleType}
                      onValueChange={(value: HandleType) => setHandleType(value)}
                    >
                      <SelectTrigger className={styles.select}>
                        <SelectValue placeholder={t.handleType} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">{t.modern}</SelectItem>
                        <SelectItem value="classic">{t.classic}</SelectItem>
                        <SelectItem value="magnet">{t.magnet}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                </div>
              </div>
              <Separator className={styles.separator} />
              <div className={styles.calculatedDimensions}>
              <h3 className={`${styles.sectionTitle} flex justify-center items-center`}>
                <Calculator className="w-5 h-5 mr-2" />
                {t.calculatedDimensions}
              </h3>
                <AnimatePresence>
                  {dimensions && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className={styles.dimensionsGrid}
                    >
                      {Object.entries(dimensions).map(([key, value]) => (
                        <motion.div key={key} layout className={styles.dimensionItem}>
                          <span className={styles.dimensionLabel}>{t[key as keyof typeof t]}:</span>
                          <span className={`${styles.dimensionValue} ${key === 'door' ? styles.doorValue : ''}`}>{value}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className={visualizationStyles.visualizationContainer}>
                <div className={visualizationStyles.visualizationHeader}>
                  <h3 className={styles.sectionTitle}>
                    <Eye className="w-5 h-5" />
                    {t.cabinetVisualization}
                  </h3>
                  <ModelToggle
                    showModel={showModel}
                    onToggle={handleModelToggle}
                    label={t.showModel}
                  />
                </div>
                {showModel && (
                  <CabinetVisualization
                    type={cabinetType}
                    length={length}
                    height={height}
                    depth={depth}
                    doorCount={doorCount}
                    doorOrientation={doorOrientation}
                    doorDivision={doorDivision}
                    handleType={handleType}
                  />
                )}
              </div>
              <div className={styles.storeButtonContainer}>
                <Button onClick={storeInHistory} size="lg" className={styles.storeButton}>
                  <History className="w-5 h-5 mr-2" />
                  {t.storeInHistory}
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className={styles.card}>
          <CardHeader className={`${styles.cardHeader} flex justify-end items-center`}>
            <CardTitle className="flex items-center gap-2">
              <History className="w-6 h-6" />
              <span>{t.cabinetHistory}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <ScrollArea className={styles.historyScrollArea}>
                {history.map((unit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={styles.historyItem}
                  >
                    <h3 className={styles.historyItemTitle}>
                      {t[unit.type as keyof typeof t]} {unit.length} cm
                    </h3>
                    <div className={styles.historyItemGrid}>
                      <p><span className={styles.historyLabel}>{t.floor}:</span> {unit.dimensions.floor}</p>
                      <p><span className={styles.historyLabel}>{t.sides}:</span> {unit.dimensions.sides}</p>
                      <p><span className={styles.historyLabel}>{t.top}:</span> {unit.dimensions.top}</p>
                      <p><span className={styles.historyLabel}>{t.back}:</span> {unit.dimensions.back}</p>
                      <p><span className={styles.historyLabel}>{t.door}:</span> {unit.dimensions.door}</p>
                      {unit.dimensions.middlePartition && <p><span className={styles.historyLabel}>{t.middlePartition}:</span> {unit.dimensions.middlePartition}</p>}
                      {unit.dimensions.shelf && <p><span className={styles.historyLabel}>{t.shelf}:</span> {unit.dimensions.shelf}</p>}
                      <p><span className={styles.historyLabel}>{t.additionalPiece}:</span> {unit.dimensions.additionalPiece}</p>
                      {unit.dimensions.doorQeyd && <p><span className={styles.historyLabel}>{t.doorQeyd}:</span> {unit.dimensions.doorQeyd}</p>}
                      {unit.type === 'wall' && <p><span className={styles.historyLabel}>{t.doorOrientation}:</span> {t[unit.doorOrientation as keyof typeof t]}</p>}
                      {unit.type === 'full' && <p><span className={styles.historyLabel}>{t.doorDivision}:</span> {t[unit.doorDivision === 'length' ? 'byLength' : 'byHeight']}</p>}
                      <p><span className={styles.historyLabel}>{t.handleType}:</span> {t[unit.handleType]}</p>
                      <p><span className={styles.historyLabel}>{t.backConnectionType}:</span> {t[unit.backConnectionType.replace('-', '') as keyof typeof t]}</p>
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


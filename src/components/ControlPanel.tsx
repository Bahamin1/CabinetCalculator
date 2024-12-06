import React from 'react'
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

type CabinetProps = {
        type: 'base' | 'wall' | 'full'
        length: number
        height: number
        depth: number
        doorCount: number
        doorOrientation: 'vertical' | 'horizontal'
        doorDivision: 'length' | 'height'
        backPanelType: 'normal' | 'fitting' | 'mdf'
        handleType: 'classic' | 'modern'
    }
interface ControlPanelProps {
  cabinetProps : CabinetProps
  updateCabinetProps: (newProps: Partial<CabinetProps>) => void
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ cabinetProps, updateCabinetProps }) => {
  return (
    <div className="p-4 bg-gray-100 flex flex-wrap gap-4 items-center">
      <div>
        <Label htmlFor="length">Length (cm)</Label>
        <Input
          id="length"
          type="number"
          value={cabinetProps.length}
          onChange={(e) => updateCabinetProps({ length: Math.max(0.1, Number(e.target.value)) })}
          min="0.1"
          step="0.1"
        />
      </div>
      <div>
        <Label htmlFor="height">Height (cm)</Label>
        <Input
          id="height"
          type="number"
          value={cabinetProps.height}
          onChange={(e) => updateCabinetProps({ height: Math.max(0.1, Number(e.target.value)) })}
          min="0.1"
          step="0.1"
        />
      </div>
      <div>
        <Label htmlFor="depth">Depth (cm)</Label>
        <Input
          id="depth"
          type="number"
          value={cabinetProps.depth}
          onChange={(e) => updateCabinetProps({ depth: Math.max(0.1, Number(e.target.value)) })}
          min="0.1"
          step="0.1"
        />
      </div>
      <div>
        <Label htmlFor="cabinet-type">Cabinet Type</Label>
        <Select
          value={cabinetProps.type}
          onValueChange={(value: 'base' | 'wall' | 'full') => updateCabinetProps({ type: value })}
        >
          <SelectTrigger id="cabinet-type">
            <SelectValue placeholder="Select cabinet type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="base">Base</SelectItem>
            <SelectItem value="wall">Wall</SelectItem>
            <SelectItem value="full">Full</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="door-count">Door Count</Label>
        <Input
          id="door-count"
          type="number"
          value={cabinetProps.doorCount}
          onChange={(e) => updateCabinetProps({ doorCount: Math.max(1, Number(e.target.value)) })}
          min="1"
          step="1"
        />
      </div>
      <div>
        <Label htmlFor="door-orientation">Door Orientation</Label>
        <Select
          value={cabinetProps.doorOrientation}
          onValueChange={(value: 'vertical' | 'horizontal') => updateCabinetProps({ doorOrientation: value })}
        >
          <SelectTrigger id="door-orientation">
            <SelectValue placeholder="Select door orientation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vertical">Vertical</SelectItem>
            <SelectItem value="horizontal">Horizontal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="door-division">Door Division</Label>
        <Select
          value={cabinetProps.doorDivision}
          onValueChange={(value: 'length' | 'height') => updateCabinetProps({ doorDivision: value })}
        >
          <SelectTrigger id="door-division">
            <SelectValue placeholder="Select door division" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="length">By Length</SelectItem>
            <SelectItem value="height">By Height</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Label htmlFor="back-panel-type">Back Panel Type</Label>
              <Select
                value={cabinetProps.backPanelType}
                onValueChange={(value: 'normal' | 'fitting' | 'mdf') => updateCabinetProps({ backPanelType: value })}
              >
                <SelectTrigger id="back-panel-type">
                  <SelectValue placeholder="Select back panel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="fitting">Fitting (Shiyar)</SelectItem>
                  <SelectItem value="mdf">MDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Normal: Standard size</p>
            <p>Fitting: Reduced by 0.8mm on all sides</p>
            <p>MDF: Special dimensions for base and wall cabinets</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Label htmlFor="handle-type">Handle Type</Label>
              <Select
                value={cabinetProps.handleType}
                onValueChange={(value: 'classic' | 'modern') => updateCabinetProps({ handleType: value })}
              >
                <SelectTrigger id="handle-type">
                  <SelectValue placeholder="Select handle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="modern">Modern/Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Classic: Visible handles on doors</p>
            <p>Modern: Hidden handles with modified cabinet design</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}


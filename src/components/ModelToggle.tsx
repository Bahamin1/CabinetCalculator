import { Eye, EyeOff } from 'lucide-react'
import React from 'react'
import { Label } from './ui/label'
import { Toggle } from "./ui/toggle"

interface ModelToggleProps {
  showModel: boolean
  onToggle: (checked: boolean) => void
  label: string
}

export function ModelToggle({ showModel, onToggle, label }: ModelToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Toggle
        pressed={showModel}
        onPressedChange={onToggle}
        aria-label="Toggle 3D model visibility"
      >
        <Label htmlFor="show-model" className="flex items-center space-x-2 cursor-pointer text-sm">
          {showModel ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          <span>{label}</span>
        </Label>
      </Toggle>
    </div>
  )
}


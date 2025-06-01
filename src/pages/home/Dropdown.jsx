import React, { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

export default function Dropdown({ label = "Options", items = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState(label)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const defaultItems = [
    { id: "1", label: "Profile" },
    { id: "2", label: "Settings" },
    { id: "3", label: "Help" },
    { id: "4", label: "Logout" },
  ]

  const dropdownItems = items.length > 0 ? items : defaultItems

  return (
    <div className="relative inline-block p-4 w-full text-left mt-1" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {selectedLabel}
        <ChevronDown className="w-4 h-4 ml-2 -mr-1" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {dropdownItems.map((item) => (
              <button
                key={item.id}
                className="text-left w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                onClick={() => {
                  setSelectedLabel(item.label)
                  if (item.onClick) item.onClick()
                  setIsOpen(false)
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useCallback } from 'react'

function ResizableDivider({ onResize, sidebarWidth }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true)
    e.preventDefault()
    
    const handleMouseMove = (e) => {
      const windowWidth = window.innerWidth
      const newSidebarWidth = windowWidth - e.clientX
      onResize(newSidebarWidth)
    }
    
    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [onResize])

  return (
    <div
      className={`absolute top-0 right-0 w-1 h-full cursor-col-resize transition-colors z-10 ${
        isDragging 
          ? 'bg-blue-500' 
          : 'bg-dark-600 hover:bg-blue-500'
      }`}
      style={{ right: `${sidebarWidth}px` }}
      onMouseDown={handleMouseDown}
    >
      {/* Invisible wider area for easier grabbing */}
      <div className="absolute -left-2 -right-2 top-0 bottom-0" />
    </div>
  )
}

export default ResizableDivider
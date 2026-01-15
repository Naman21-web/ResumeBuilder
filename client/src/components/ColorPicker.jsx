import { Check, Palette } from 'lucide-react';
import React from 'react'

const ColorPicker = ({ selectedColor, onChange }) => {
    const colors = [
        {name: "Blue", value: "#3B82F6"},
        {name: "Indigo", value: "#6366F1"},
        {name: "Purple", value: "#8B5CF6"},        
        {name: "Green", value: "#10B981"},
        {name: "Red", value: "#EF4444"},
        {name: "Orange", value: "#F59E0B"},
        {name: "Teal", value: "#14B8A6"},
        {name: "Pink", value: "#EC4899"},
        {name: "Gray", value: "#6B7280"},
        {name: "Black", value: "#1F2937"},
        // {name: "Yellow", value: "#EAB308"},
        // {name: "Cyan", value: "#06B6D4"},
        // {name: "Lime", value: "#84CC16"},
        // {name: "Fuchsia", value: "#D946EF"},
        // {name: "Rose", value: "#F43F5E"},
        // {name: "Amber", value: "#F59E0B"},
        // {name: "Violet", value: "#8B5CF6"},
        // {name: "Slate", value: "#64748B"},
        // {name: "Emerald", value: "#10B981"},
        // {name: "Sky", value: "#0EA5E9"},
        // {name: "Mint", value: "#3EB489"},
        // {name: "Coral", value: "#FF6F61"},
        // {name: "Navy", value: "#1E3A8A"},
        // {name: "Olive", value: "#6B8E23"},
        // {name: "Maroon", value: "#800000"},
    ]

    const [isOpen,setIsOpen]=React.useState(false);
    const containerRef = React.useRef(null);

    React.useEffect(() => {
        if (!isOpen) return;
        const handleOutsideClick = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        const handleEscape = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

  return (
    <div className='relative' ref={containerRef}>
        <button onClick={()=>setIsOpen(!isOpen)} className='flex items-center gap-2 text-sm text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 ring-purple-300 hover:ring transition-all px-3 py-2 rounded-lg'>
            <Palette size={16} />
            <span className='max-sm:hidden'>Accent</span>
        </button>
        {isOpen && (
            <div className='grid grid-cols-4 w-60 gap-2 absolute top-full left-0 right-0 p-3 mt-2 z-10 bg-white rounded-md border border-gray-200 shadow-sm'>
                {colors.map((color)=>(
                    <div key={color.value} className='relative cursor-pointer group flex flex-col' onClick={()=> {onChange(color.value); setIsOpen(false);}}>
                        <div className='w-12 h-12 rounded-full border-2 border-transparent group-hover:border-black/25 transition-colors' style={{backgroundColor: color.value}}>
                        </div>
                        {selectedColor === color.value && (
                            <div className='absolute top-0 left-0 right-0 bottom-4.5 flex items-center justify-center'>
                                <Check className='size-5 text-white'/>
                            </div>
                        )}
                        <p className='text-xs text-center mt-1 text-gray-600'>{color.name}</p>
                    </div>
                ))}
            </div>
        )}
    </div>
  )
}

export default ColorPicker
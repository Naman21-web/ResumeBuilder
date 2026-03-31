import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'

const TailorExperiences = ({ experiences, skills, onUpdate, onJobDescriptionChange, onHighlightModeChange, onKeywordsExtracted, initialMode='skills+job' }) => {
  const { token } = useSelector(state => state.auth)
  const [jobDesc, setJobDesc] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [mode, setMode] = useState(initialMode)

  const tailor = async () => {
    if(!jobDesc.trim()) return toast.error('Please enter a job description')
    setIsGenerating(true)
    try{
      // Extract keywords from job description using AI
      const keywordsRes = await api.post('api/ai/extract-keywords', { jobDescription: jobDesc }, { headers: { Authorization: token } })
      if(Array.isArray(keywordsRes.data.keywords)){
        onKeywordsExtracted && onKeywordsExtracted(keywordsRes.data.keywords)
      }

      const { data } = await api.post('api/ai/tailor-experiences', { jobDescription: jobDesc, experiences, skills }, { headers: { Authorization: token } })
      if(Array.isArray(data.experiences)){
        onUpdate(data.experiences)
        toast.success('Experiences tailored to job description')
        onJobDescriptionChange && onJobDescriptionChange(jobDesc)
      }
      else{
        toast.error('Unexpected AI response')
      }
    }
    catch(err){
      toast.error(err?.response?.data?.message || err.message)
    }
    finally{ setIsGenerating(false) }
  }

  const clear = () => setJobDesc('')

  return (
    <div className='p-4 border border-gray-200 rounded-lg mb-4'>
      <h4 className='text-sm font-medium mb-2'>Tailor Experiences to a Job</h4>
      <textarea value={jobDesc} onChange={(e) => { setJobDesc(e.target.value); }} placeholder='Paste the job description or key responsibilities here...' className='w-full px-3 py-2 rounded-lg resize-none text-sm mb-3' rows={4} />
      <div className='flex items-center gap-2'>
        <button onClick={async () => { onJobDescriptionChange && onJobDescriptionChange(jobDesc); tailor(); }} disabled={isGenerating} className='px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm disabled:opacity-50'>
          {isGenerating ? 'Tailoring...' : 'Tailor experiences'}
        </button>
        <button onClick={clear} className='px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm'>Clear</button>
      </div>
      <div className='mt-3 flex items-center gap-2'>
        <label className='text-sm font-medium'>Bold mode:</label>
        <button onClick={() => { setMode('skills-only'); onHighlightModeChange && onHighlightModeChange('skills-only'); }} className={`px-2 py-1 rounded text-sm ${mode==='skills-only' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Skills only</button>
        <button onClick={() => { setMode('skills+job'); onHighlightModeChange && onHighlightModeChange('skills+job'); }} className={`px-2 py-1 rounded text-sm ${mode==='skills+job' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Skills + Job</button>
      </div>
      <input type="hidden" value={jobDesc} />
      <p className='text-xs text-gray-500 mt-2'>The AI will adapt your existing experiences to better match the job and highlight your skills.</p>
    </div>
  )
}

export default TailorExperiences

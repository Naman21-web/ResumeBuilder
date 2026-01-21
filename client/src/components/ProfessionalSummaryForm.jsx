import { Loader, Sparkles, RotateCcw } from 'lucide-react';
import React from 'react';
import { useState } from 'react';
import {useSelector} from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';

const ProfessionalSummary = ({data,onChange,setResumeData}) => {

    const {token} = useSelector(state => state.auth);
    const [isGenerating,setIsGenerating] = useState(false);
    const [previousSummary, setPreviousSummary] = useState(null);

    const generateSummary = async() => {
        try{
            setIsGenerating(true);
            const prompt = `Enhance my professional summary "${data}"`;
            const response = await api.post(
                '/api/ai/enhance-pro-sum',
                { userContent: prompt },
                { headers: { Authorization: `${token}` } }
            );
            const enhanced = response.data.enhancedContent?.content ?? response.data.enhancedContent;
            // Store the previous summary only after successful enhancement
            setPreviousSummary(data);
            setResumeData(prev => ({...prev, professional_summary: enhanced }));
            toast.success('Professional summary enhanced!');
        }
        catch(err){
          toast.error(err?.response?.data?.message || err.message);            
        }
        finally{
            setIsGenerating(false);
        }
    }

    const undoEnhancement = () => {
        if (previousSummary !== null) {
            setResumeData(prev => ({...prev, professional_summary: previousSummary}));
            setPreviousSummary(null);
            toast.success('Enhancement undone!');
        }
    }

  return (
    <div className='space-y-4'>
        <div className='flex items-center justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Summary</h3>
                <p className='text-sm text-gray-500'>Add summary for your resume here</p>
            </div>
            <div className='flex items-center gap-2'>
                <button disabled={isGenerating} onClick={generateSummary} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'>
                    {isGenerating ? (<Loader className='size-4 animate-spin'/>) : (<Sparkles className='size-4'/>)}
                    {isGenerating ? 'Enhancing...' : 'AI Enhance'}
                </button>
                {previousSummary !== null && (
                    <button onClick={undoEnhancement} className='flex items-center gap-2 px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors'>
                        <RotateCcw className='size-4'/>
                        Undo
                    </button>
                )}
            </div>
        </div>

        <div className='mt-6'>
            <textarea rows={7} value={data || ""} onChange={(e) => onChange(e.target.value)} className='w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none' placeholder='Write a compelling professional summary that highlights your key strengths and career objectives...'/>
                <p className='text-xs text-gray-500 max-w-4/5 mx-auto text-center'>Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.</p>
        </div>
    </div>
  )
}

export default ProfessionalSummary
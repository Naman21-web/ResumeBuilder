import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate.jsx';
import ModernTemplate from './templates/ModernTemplate.jsx';
import MinimalTemplate from './templates/MinimalTemplate.jsx';
import MinimalImageTemplate from './templates/MinimalImageTemplate.jsx';
import SimpleResume from './templates/SimpleResume.jsx';
import normalizeResumeData from '../utils/normalizeResumeData';

const ResumePreview = ({data,template,accentColor,classes=""}) => {
    const normalized = normalizeResumeData(data);

    const renderTemplate = () => {
        switch(template){
            case 'modern':
                return <ModernTemplate data={normalized} accentColor={accentColor}/>;
            case 'minimal':
                return <MinimalTemplate data={normalized} accentColor={accentColor}/>;
            case 'minimal-image':
                return <MinimalImageTemplate data={normalized} accentColor={accentColor}/>;
            case 'simple':
                return <SimpleResume data={normalized} accentColor={accentColor}/>;
            default:
                return <ClassicTemplate data={normalized} accentColor={accentColor}/>;
        }
    }

  return (
    <div className='w-full bg-gray-100'>
        <div id='resume-preview' className={"border border-gray-200 print:shadow-none print:border-none"+classes}>
            {/* Template rendering logic based on the selected template */}
            {renderTemplate()}
        </div>

        <style jsx>
            {`
                @page{
                    size:letter;
                    margin: 0;
                }
                @media print {
                    html,body{
                        width: 8.5in;
                        height: 11in;
                        overflow: hidden;
                    }
                    body *{
                        visibility: hidden;
                    }
                    #resume-preview, #resume-preview *{
                        visibility: visible;
                    }
                    #resume-preview{
                        position: absolute;
                        left:0;
                        top:0;
                        width: 100%;
                        height: auto;
                        margin:0;
                        padding:0;
                        box-shadow:none !important;
                        border:none !important;
                    }
                }
            `}
        </style>
    </div>
  )
}

export default ResumePreview
import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

//controller for enhancing a resume's professional summary
//POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req,res) => {
    try{
        const {userContent} = req.body;
        if(!userContent){
            return res.status(400).json({message:"Missing required fields"});
        }
        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {   role: "system",
                    content: "You are an expert in resume writing.Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills,experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else." 
                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
        });
        const enhancedContent = response.choices[0].message?.content ?? response.choices[0].message;
        return res.status(200).json({enhancedContent});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}

//controller for enhancing a resume's job description
//POST: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req,res) => {
    try{
        const {userContent} = req.body;
        if(!userContent){
            return res.status(400).json({message:"Missing required fields"});
        }
        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {   role: "system",
                    content: "You are an expert in resume writing.Your task is to enhance the job description of a resume. The job description should be 1-2 sentences also highlighting key responsibilities, and achievements.Use action verbs and quantifiable results where possible. Make it ATS-friendly. and only return text no options or anything else." 
                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
        });
        const enhancedContent = response.choices[0].message?.content ?? response.choices[0].message;
        return res.status(200).json({enhancedContent});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}

//controller for uploading a resume to the database
//POST: /api/ai/upload-resume
export const uploadResume = async (req,res) => {
    try{
        const {resumeText,title} = req.body;
        const userId = req.userId;

        if(!resumeText){
            return res.status(400).json({message:"Missing required fields"})
        }

        const sytemPrompt = "You are an expert AI Agent to extract structured data from a resume.";

        const userPrompt = `Extract relevant resume data from the following resume text and return a single JSON object (no surrounding text) with concrete values for each field. Use simple types: strings for text, arrays for lists, and booleans where required. Example output format:
{
  "professional_summary": "A concise summary string...",
  "skills": ["skill1","skill2"],
  "personal_info": { "image":"", "full_name":"", "email":"", "phone":"", "location":"", "linkedin":"", "website":"" },
  "experience": [{ "company":"","position":"","start_date":"YYYY-MM","end_date":"YYYY-MM","description":"","is_current":false }],
  "project": [{ "name":"","type":"","description":"" }],
  "education": [{ "institution":"","degree":"","field":"","graduation_date":"YYYY-MM","gpa":"" }]
}

Here is the resume to extract from:

${resumeText}
`;

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {   role: "system",
                    content: sytemPrompt
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            response_format: {
                type:  'json_object'
            }
        });
        const extractedData = response.choices?.[0]?.message?.content ?? response.choices?.[0]?.message;
        let parsedData;
        try{
            parsedData = typeof extractedData === 'string' ? JSON.parse(extractedData) : extractedData;
        }
        catch(e){
            console.error('Failed to parse AI extracted data:', e);
            return res.status(400).json({ message: 'AI returned invalid JSON' });
        }

        // sanitize parsedData to expected simple shapes to avoid storing schema-like objects
        const sanitizedData = {
            professional_summary: parsedData.professional_summary || "",
            skills: Array.isArray(parsedData.skills) ? parsedData.skills.map(String) : (parsedData.skills ? [String(parsedData.skills)] : []),
            personal_info: {
                image: parsedData.personal_info?.image || '',
                full_name: parsedData.personal_info?.full_name || '',
                email: parsedData.personal_info?.email || '',
                phone: parsedData.personal_info?.phone || '',
                location: parsedData.personal_info?.location || '',
                linkedin: parsedData.personal_info?.linkedin || '',
                website: parsedData.personal_info?.website || '',
            },
            experience: Array.isArray(parsedData.experience) ? parsedData.experience.map(e => ({
                company: e.company || '',
                position: e.position || '',
                start_date: e.start_date || '',
                end_date: e.end_date || '',
                description: e.description || '',
                is_current: !!e.is_current
            })) : [],
            project: Array.isArray(parsedData.project) ? parsedData.project.map(p => ({
                name: p.name || '',
                type: p.type || '',
                description: p.description || ''
            })) : [],
            education: Array.isArray(parsedData.education) ? parsedData.education.map(ed => ({
                institution: ed.institution || '',
                degree: ed.degree || '',
                field: ed.field || '',
                graduation_date: ed.graduation_date || '',
                gpa: ed.gpa || ''
            })) : []
        };

        const newResume = await Resume.create({
            userId,title,...sanitizedData
        })
        return res.status(200).json({
            resumeId:newResume._id
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}
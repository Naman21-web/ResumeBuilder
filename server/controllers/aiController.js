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

//controller to tailor user's experiences to a given job description and skills
//POST: /api/ai/tailor-experiences
export const tailorExperiences = async (req, res) => {
    try{
        const { jobDescription, experiences, skills } = req.body;
        if(!jobDescription || !Array.isArray(experiences)){
            return res.status(400).json({message:"Missing required fields"});
        }

        const systemPrompt = "You are an expert resume writer and career coach. Your task is to modify the provided list of work experiences so they align closely with the provided job description and highlight the user's skills. Return a JSON array (only the array, no surrounding text) where each element is an object with fields: company, position, start_date (YYYY-MM), end_date (YYYY-MM or empty), description, is_current (boolean). Use action verbs, quantify results when possible, and emphasize the provided skills where relevant. Keep descriptions concise and ATS-friendly.";

        const userPrompt = `Job Description:\n${jobDescription}\n\nExisting Experiences:\n${JSON.stringify(experiences)}\n\nSkills:\n${JSON.stringify(skills || [])}\n\nReturn only the JSON array of modified experiences.`;

        let response;
        try{
            response = await ai.chat.completions.create({
                model: process.env.OPENAI_MODEL,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ]
            });
        }
        catch(apiErr){
            console.error('AI API error in tailorExperiences:', apiErr);
            return res.status(500).json({ message: 'AI service error' });
        }

        const aiContent = response.choices?.[0]?.message?.content ?? response.choices?.[0]?.message;
        let parsed;
        try{
            parsed = typeof aiContent === 'string' ? JSON.parse(aiContent) : aiContent;
        }
        catch(e){
            // If parsing fails, try to extract JSON array substring
            const text = typeof aiContent === 'string' ? aiContent : JSON.stringify(aiContent);
            const match = text.match(/\[.*\]/s);
            if(match){
                try{ parsed = JSON.parse(match[0]); }
                catch(err){
                    console.error('Failed to parse AI response for tailored experiences:', err);
                    return res.status(400).json({ message: 'AI returned invalid JSON' });
                }
            }
            else{
                console.error('No JSON array found in AI response.');
                return res.status(400).json({ message: 'AI returned invalid JSON' });
            }
        }

        // sanitize each experience to expected shape
        const sanitized = Array.isArray(parsed) ? parsed.map(e => ({
            company: e.company || '',
            position: e.position || '',
            start_date: e.start_date || '',
            end_date: e.end_date || '',
            description: e.description || '',
            is_current: !!e.is_current
        })) : [];

        return res.status(200).json({ experiences: sanitized });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

//controller to extract important keywords from a job description
//POST: /api/ai/extract-keywords
export const extractKeywords = async (req, res) => {
    try{
        const { jobDescription } = req.body;
        if(!jobDescription){
            return res.status(400).json({message:"Missing required fields"});
        }

        const systemPrompt = "You are an expert at identifying key technical skills, tools, technologies, and important concepts from job descriptions. Extract the most important keywords that a candidate should highlight in their resume to match this job. Focus on technical skills, frameworks, methodologies, certifications, and business domains mentioned.";

        const userPrompt = `From this job description, extract the 20-30 most important keywords and technical terms (include multi-word phrases like "react.js", "aws lambda", "machine learning") that a candidate should highlight in their resume. Return ONLY a JSON array of strings (lowercase), no other text. Prefer concrete technologies, frameworks, certifications, and domain phrases.

    Job Description:
    ${jobDescription}`;

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ]
        });

        const aiContent = response.choices?.[0]?.message?.content ?? response.choices?.[0]?.message;
        let keywords;
        try{
            keywords = typeof aiContent === 'string' ? JSON.parse(aiContent) : aiContent;
        }
        catch(e){
            // Try to extract JSON array from response
            const text = typeof aiContent === 'string' ? aiContent : JSON.stringify(aiContent);
            const match = text.match(/\[.*\]/s);
            if(match){
                try{ keywords = JSON.parse(match[0]); }
                catch(err){
                    console.error('Failed to parse keywords:', err);
                    return res.status(400).json({ message: 'AI returned invalid JSON' });
                }
            }
            else{
                console.error('No keywords found in AI response.');
                return res.status(400).json({ message: 'AI returned invalid JSON' });
            }
        }

        // ensure it's an array of strings
        const sanitized = Array.isArray(keywords) ? keywords.map(k => String(k).toLowerCase().trim()).filter(Boolean).slice(0,30) : [];
        return res.status(200).json({ keywords: sanitized });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
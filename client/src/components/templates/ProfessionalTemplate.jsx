import { Mail, Phone, MapPin, Linkedin, Globe, Github, Code } from "lucide-react";

const ProfessionalTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    if (!year || !month) return dateStr;
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const summary =
    typeof data.professional_summary === "string"
      ? data.professional_summary
      : data.professional_summary?.content || "";
  const iSummary =
    typeof data.isummary === "string"
      ? data.isummary
      : data.isummary?.content || "";
  const effectiveSummary = summary || iSummary || "";

  const experience = Array.isArray(data.experience) ? data.experience : [];
  const projects = Array.isArray(data.project) ? data.project : [];
  const education = Array.isArray(data.education) ? data.education : [];
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const certifications = Array.isArray(data.certifications) ? data.certifications : [];

  // Normalize skills to objects with string `label` and `classification` to avoid rendering objects
  const normalizedSkills = skills.map((s) => {
    if (!s) return { label: "", classification: "" };
    if (typeof s === "string") return { label: s, classification: "" };
    const label = typeof s.label === "string" ? s.label : (typeof s.name === "string" ? s.name : String(s));
    const classification = typeof s.classification === "string" ? s.classification.trim() : "";
    return { label, classification };
  });

  const headingColor = accentColor || "#0047b3";

  const sectionTitle = (title) => (
    <div className="mb-0.1 border-b" style={{ borderColor: headingColor }}>
      <h6 className="text-base font-bold tracking-widest uppercase mb-0.5" style={{ color: headingColor }}>
        {title}
      </h6>
    </div>
  );

  // Build keyword and phrase list from job description and skills for more accurate matching
  const getKeywordsFromJob = (jobDesc, skillsList) => {
    if(!jobDesc && (!skillsList || skillsList.length === 0)) return [];
    const stopwords = new Set(["the","and","or","for","with","a","an","to","of","in","on","by","at","from","as","is","are","be","will","you","your","that","this","we","our","it","its"]);

    // include skill labels first
    const skillKeywords = (skillsList || []).map(s => (s?.label || s).toString().toLowerCase()).filter(Boolean);

    const text = (jobDesc || '').toLowerCase().replace(/[^a-z0-9\s-]/g,' ');
    const words = text.split(/\s+/).filter(Boolean).filter(w => w.length >= 2 && !stopwords.has(w));

    // generate n-grams (2..4) to capture longer phrases
    const ngrams = new Set();
    const wlen = words.length;
    for(let n=2;n<=4;n++){
      for(let i=0;i<=wlen-n;i++){
        const gram = words.slice(i,i+n).join(' ');
        ngrams.add(gram);
      }
    }

    // frequency for single words
    const freq = {};
    words.forEach(w => { freq[w] = (freq[w]||0) + 1 });
    const singleSorted = Object.keys(freq).sort((a,b)=>freq[b]-freq[a]).slice(0,20);

    // combine: skills (highest priority) -> ngrams -> top single words
    const combined = [...new Set([...(skillKeywords || []), ...Array.from(ngrams).slice(0,20), ...singleSorted])];
    return combined.filter(Boolean).slice(0,40);
  }

  const highlightText = (text, keywords) => {
    if(!text || !keywords || keywords.length === 0) return text;

    // separate phrases (multi-word) and single words, sort phrases by length desc for longest-first matching
    const phrases = keywords.filter(k => k.trim().includes(' ')).sort((a,b)=>b.length-a.length);
    const singles = new Set(keywords.filter(k => !k.includes(' ')).map(s=>s.toLowerCase()));

    // track matched regions to avoid overlapping highlights (no placeholders used)
    const ranges = []; // [{start, end, text}]

    // find phrase matches first (longest first)
    phrases.forEach(ph => {
      const esc = ph.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      const re = new RegExp(`\\b${esc}\\b`, 'gi');
      let m;
      while((m = re.exec(text)) !== null){
        // check no overlap with existing ranges
        if(!ranges.some(r => (m.index >= r.start && m.index < r.end) || (m.index + m[0].length > r.start && m.index + m[0].length <= r.end))){
          ranges.push({start: m.index, end: m.index + m[0].length, text: m[0]});
        }
      }
    });

    // find single-word matches that don't overlap
    let idx = 0;
    while(idx < text.length){
      const m = text.slice(idx).match(/\b[\w'-]+\b/);
      if(!m) break;
      const wordStart = idx + m.index;
      const wordEnd = wordStart + m[0].length;
      if(!ranges.some(r => (wordStart >= r.start && wordStart < r.end) || (wordEnd > r.start && wordEnd <= r.end))){
        if(singles.has(m[0].toLowerCase())){
          ranges.push({start: wordStart, end: wordEnd, text: m[0]});
        }
      }
      idx = wordEnd;
    }

    // sort ranges by start position and build result
    ranges.sort((a,b) => a.start - b.start);
    const result = [];
    let pos = 0;
    ranges.forEach((r, i) => {
      if(pos < r.start){
        result.push(<span key={`t${i}`}>{text.slice(pos, r.start)}</span>);
      }
      result.push(<strong key={`b${i}`}>{r.text}</strong>);
      pos = r.end;
    });
    if(pos < text.length){
      result.push(<span key="end">{text.slice(pos)}</span>);
    }
    return result.length ? result : text;
  }

  // Prefer AI-extracted keywords when available; otherwise fall back to previous logic
  const aiKeywords = Array.isArray(data?.ai_keywords) ? data.ai_keywords.map(k => String(k).toLowerCase().trim()).filter(Boolean) : [];
  const skillLabels = normalizedSkills.map(s => (s.label || '').toString().toLowerCase()).filter(Boolean);

  // Build skill variants to improve matching: original, stripped punctuation, and component words
  const skillVariants = [];
  skillLabels.forEach(lbl => {
    if(!lbl) return;
    const cleaned = lbl.replace(/[^\w\s-]/g, '');
    skillVariants.push(lbl);
    if(cleaned && cleaned !== lbl) skillVariants.push(cleaned);
    cleaned.split(/\s+/).forEach(part => { if(part && part.length>1) skillVariants.push(part); });
  });
  const uniqueSkillVariants = [...new Set(skillVariants)].filter(Boolean);

  const jobKeywords = (data?.highlight_mode === 'skills-only')
    ? uniqueSkillVariants
    : ([...new Set([...(uniqueSkillVariants || []), ...(aiKeywords.length > 0 ? aiKeywords : getKeywordsFromJob(data?.tailor_job_description, normalizedSkills.map(ns => ns.label)) || [])])]);

  // Group skills by classification
  const skillsByClassification = normalizedSkills.reduce((acc, s) => {
    let classification = s?.classification?.trim() || "";

    // If no explicit classification, detect from skill name
    if (!classification) {
      const skillName = (s?.label || s?.name || s).toString().toLowerCase();
      
      if (/python|java|c\+\+|c#|javascript|typescript|golang|rust|php|ruby|swift|kotlin/.test(skillName)) {
        classification = "Programming Languages";
      } else if (/react|vue|angular|html|css|svelte|next|gatsby/.test(skillName)) {
        classification = "Frontend & Frameworks";
      } else if (/node|express|django|flask|spring|fastapi|asp\.net/.test(skillName)) {
        classification = "Backend & Frameworks";
      } else if (/mongodb|postgresql|mysql|sql|redis|elasticsearch|cassandra/.test(skillName)) {
        classification = "Databases & Platforms";
      } else if (/docker|kubernetes|aws|azure|gcp|jenkins|github|gitlab/.test(skillName)) {
        classification = "DevOps & Tools";
      } else if (/pandas|numpy|scikit|tensorflow|pytorch|keras/.test(skillName)) {
        classification = "Machine Learning";
      } else if (/git|npm|webpack|vite|npm|yarn/.test(skillName)) {
        classification = "Tools & Build Systems";
      } else {
        classification = "Other Skills";
      }
    }
    
    const label = (s?.label || s?.name || s).toString();
    if (!acc[classification]) acc[classification] = [];
    acc[classification].push(label);
    return acc;
  }, {});

  // Ensure 'Other Skills' appears last when rendering
  const orderedSkillsEntries = Object.entries(skillsByClassification).sort(([a], [b]) => {
    if (a === 'Other Skills') return 1;
    if (b === 'Other Skills') return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 pt-3 p-5 leading-snug border border-gray-200" style={{ pageBreakAfter: 'avoid', fontSize: '13pt' }}>
      {/* Header */}
      <header className="text-center mb-1 pb-0.5" >
        <h3 className="text-xl font-extrabold tracking-widest" style={{ color: headingColor }}>
          {data.personal_info?.full_name || "YOUR NAME"}
        </h3>
        <p className="text-md font-semibold text-gray-800 my-0.5">
          {data.personal_info?.profession || data.personal_info?.job_title || "Software Engineer"}
        </p>

        <div className="text-xs text-gray-600 flex flex-wrap justify-center gap-2 items-center">
          {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
          {data.personal_info?.email && <span>{data.personal_info.email}</span>}
          {data.personal_info?.linkedin && (
            <a href={data.personal_info.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900" aria-label="LinkedIn profile">
              <Linkedin className="w-3 h-3" />
              <span className="underline">LinkedIn</span>
            </a>
          )}
          {data.personal_info?.github && (
            <a href={data.personal_info.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900" aria-label="GitHub profile">
              <Github className="w-3 h-3" />
              <span className="underline">GitHub</span>
            </a>
          )}
          {data.personal_info?.leetcode && (
            <a href={data.personal_info.leetcode} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900" aria-label="LeetCode profile">
              <Code className="w-3 h-3" />
              <span className="underline">LeetCode</span>
            </a>
          )}
          {data.personal_info?.website && (
            <a href={data.personal_info.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900" aria-label="Website">
              <Globe className="w-3 h-3" />
              <span className="underline">Website</span>
            </a>
          )}
          {data.personal_info?.location && <span>{data.personal_info.location}</span>}
        </div>
      </header>

      {/* Professional Summary */}
      {effectiveSummary && (
        <section className="mb-0.5">
          {sectionTitle("Professional Summary")}
          <p className="text-sm text-gray-700 leading-snug">{effectiveSummary}</p>
        </section>
      )}

      {/* Technical Skills with Classification */}
      {skills.length > 0 && (
        <section className="mb-0.5">
          {sectionTitle("Technical Skills")}
          <div className="space-y-0 text-sm text-gray-700">
            {orderedSkillsEntries.map(([classification, items]) => (
              <div key={classification} className="leading-snug">
                <span className="font-semibold text-gray-800">{classification}:</span> <span className="text-gray-700">{items.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {experience.length > 0 && (
        <section className="mb-0.5">
          {sectionTitle("Professional Experience")}
          <div className="space-y-0.5">
            {experience.map((exp, idx) => (
              <div key={idx} className="text-sm">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className="font-semibold leading-snug" style={{ color: headingColor }}>{exp.position || "Position"}</p>
                    <p className="font-medium text-gray-900">{exp.company || "Company"}</p>
                  </div>
                  <span className="font-semibold whitespace-nowrap text-sm" style={{ color: headingColor }}>
                    {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                {exp.description && (
                  <ul className="list-disc list-inside ml-1 text-gray-700 space-y-0">
                    {exp.description
                      .split(/\.\s+/)
                      .filter((point) => point.trim())
                      .slice(0, 4)
                      .map((point, index) => (
                        <li key={index} className="leading-snug text-sm">{jobKeywords.length ? highlightText(point.trim(), jobKeywords) : point.trim()}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-0.5">
          {sectionTitle("Projects")}
          <div className="space-y-0.5 text-sm">
            {projects.slice(0, 2).map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{proj.name || "Project"}</h4>
                  <span className="text-blue-700 font-semibold whitespace-nowrap text-xs">
                    {proj.start_date && proj.end_date ? `${formatDate(proj.start_date)} - ${formatDate(proj.end_date)}` : ""}
                  </span>
                </div>
                {proj.description && <p className="text-gray-700 leading-snug text-sm">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-0.5">
          {sectionTitle("Education")}
          <div className="space-y-0.5 text-sm">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 leading-snug">{edu.degree || "Degree"}{edu.field ? ` in ${edu.field}` : ""}</p>
                  <p className="text-gray-700 text-sm">{edu.institution || "Institution"}</p>
                  {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                </div>
                <span className="text-blue-700 font-semibold whitespace-nowrap text-sm">{formatDate(edu.graduation_date)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          {sectionTitle("Certifications")}
          <p className="text-sm text-gray-700">{certifications.join(' | ')}</p>
        </section>
      )}
    </div>
  );
};




export default ProfessionalTemplate;

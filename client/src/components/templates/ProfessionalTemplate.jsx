import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

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

  const headingColor = accentColor || "#0047b3";

  const sectionTitle = (title) => (
    <div className="mb-2 border-b" style={{ borderColor: headingColor }}>
      <h2 className="text-base font-bold tracking-widest uppercase mb-2" style={{ color: headingColor }}>
        {title}
      </h2>
    </div>
  );

  // Group skills by classification
  const skillsByClassification = skills.reduce((acc, s) => {
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

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 p-5 leading-snug border border-gray-200" style={{ pageBreakAfter: 'avoid', fontSize: '13pt' }}>
      {/* Header */}
      <header className="text-center mb-1.5 pb-0.5" style={{ borderBottom: `2px solid ${headingColor}` }}>
        <h1 className="text-3xl font-extrabold tracking-widest" style={{ color: headingColor }}>
          {data.personal_info?.full_name || "YOUR NAME"}
        </h1>
        <p className="text-lg font-semibold text-gray-800 my-0.5">
          {data.personal_info?.profession || data.personal_info?.job_title || "Software Engineer"}
        </p>

        <div className="text-xs text-gray-600 flex flex-wrap justify-center gap-2 items-center">
          {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
          {data.personal_info?.email && <span>{data.personal_info.email}</span>}
          {data.personal_info?.linkedin && <span>{data.personal_info.linkedin}</span>}
          {data.personal_info?.website && <span>{data.personal_info.website}</span>}
          {data.personal_info?.location && <span>{data.personal_info.location}</span>}
        </div>
      </header>

      {/* Professional Summary */}
      {effectiveSummary && (
        <section className="mb-1">
          {sectionTitle("Professional Summary")}
          <p className="text-sm text-gray-700 leading-snug">{effectiveSummary}</p>
        </section>
      )}

      {/* Technical Skills with Classification */}
      {skills.length > 0 && (
        <section className="mb-1">
          {sectionTitle("Technical Skills")}
          <div className="space-y-0 text-sm text-gray-700">
            {Object.entries(skillsByClassification).map(([classification, items]) => (
              <div key={classification} className="leading-snug">
                <span className="font-semibold text-gray-800">{classification}:</span> <span className="text-gray-700">{items.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {experience.length > 0 && (
        <section className="mb-1">
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
                        <li key={index} className="leading-snug text-sm">{point.trim()}</li>
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
        <section className="mb-1">
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
        <section className="mb-1">
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

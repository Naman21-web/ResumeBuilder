import React, { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const SimpleResume = ({ data, accentColor }) => {
  const containerRef = useRef(null);
  const [fontSize, setFontSize] = useState(14); // base font size in px
  const [containerPadding, setContainerPadding] = useState(28); // px (reduced default)
  const [sectionSpacing, setSectionSpacing] = useState(20); // px (reduced default)
  const [itemSpacing, setItemSpacing] = useState(10); // px (reduced default)
  const [contactGap, setContactGap] = useState(12); // px (reduced default)
  const [contactMargin, setContactMargin] = useState(8); // px (reduced default)
  const [skillsFontSize, setSkillsFontSize] = useState(14); // match base font by default

  // Header specific compacting
  const [headerFontSize, setHeaderFontSize] = useState(22); // px
  const [headerSpacing, setHeaderSpacing] = useState(8); // px (margin-bottom)
  const [headingSpacing, setHeadingSpacing] = useState(6); // px (gap below section headings)
  const [skillInlineGap, setSkillInlineGap] = useState(10); // horizontal gap between inline skill items
  const minPadding = 8;
  const minSectionSpacing = 6;
  const minItemSpacing = 6;
  const minContactGap = 4;
  const minContactMargin = 4;
  const minSkillInlineGap = 4;
  const minHeaderFont = 14;
  const minHeaderSpacing = 4;
  const minHeadingSpacing = 4;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  useEffect(() => {
    // Page measurement for letter size (8.5 x 11 in at 96dpi)
    const PAGE_PX = 11 * 96; // height in px
    const marginAllowance = 40; // tighter margin allowance to maximize usable area
    const usableHeight = PAGE_PX - marginAllowance;
    const minFont = 8; // allow slightly smaller minimum
    const maxIterations = 80;

    function adjustFont() {
      const node = containerRef.current;
      if (!node) return;

      // Reset transforms and box sizing before measurement
      node.style.transform = 'none';
      node.style.transformOrigin = 'top left';
      node.style.boxSizing = 'border-box';

      // Local working values
      let currentFont = 14;
      let currentPadding = containerPadding;
      let currentSection = sectionSpacing;
      let currentItem = itemSpacing;
      let currentContactGap = contactGap;
      let currentContactMargin = contactMargin;
      // keep skills font in sync with body font for parity
      let currentSkillsFont = currentFont;
      let currentHeaderFont = headerFontSize;
      let currentHeaderSpacing = headerSpacing;
      let currentHeadingSpacing = headingSpacing;
      let currentSkillInlineGap = skillInlineGap;

      // Apply initial styles synchronously
      node.style.fontSize = currentFont + 'px';
      node.style.padding = currentPadding + 'px';
      node.querySelectorAll('section').forEach(s => { s.style.marginBottom = currentSection + 'px'; });
      // ensure all section headings have consistent bottom margin
      node.querySelectorAll('section h2').forEach(h => { h.style.marginBottom = currentHeadingSpacing + 'px'; h.style.marginTop = '0px'; });
      const hr = node.querySelector('hr'); if (hr) hr.style.marginBottom = currentSection + 'px';
      node.querySelectorAll('.exp-item, .edu-item, .proj-item').forEach(e => { e.style.marginBottom = currentItem + 'px'; });
      const contact = node.querySelector('.contact-area'); if (contact) { contact.style.gap = currentContactGap + 'px'; contact.style.marginTop = currentContactMargin + 'px'; contact.style.fontSize = Math.max(11, currentFont - 1) + 'px'; }
      const skills = node.querySelector('.skills'); if (skills) { skills.style.fontSize = currentSkillsFont + 'px'; skills.querySelectorAll('li').forEach(li => { li.style.display = 'inline-block'; li.style.marginRight = currentSkillInlineGap + 'px'; li.style.marginBottom = '0px'; li.style.overflowWrap = 'break-word'; li.style.wordBreak = 'break-word'; }); }

      // Header sizing
      const headerEl = node.querySelector('header');
      const headerName = headerEl?.querySelector('h1');
      if (headerName) {
        headerName.style.fontSize = currentHeaderFont + 'px';
        headerEl.style.marginBottom = currentHeaderSpacing + 'px';
      }

      // Use bounding rect so margins and transforms are accounted for
      let measured = node.getBoundingClientRect().height;

      // Quick success
      if (measured <= usableHeight) {
        setFontSize(currentFont);
        node.style.transform = 'none';
        return;
      }

      // First: reduce paddings and spacing as much as possible (to preserve font)
      let sIter = 0;
      const maxSpacingIterations = 80;
      while (measured > usableHeight && sIter < maxSpacingIterations) {
        let changed = false;

        if (currentPadding > minPadding) { currentPadding = Math.max(minPadding, currentPadding - 2); node.style.padding = currentPadding + 'px'; changed = true; }
        if (currentSection > minSectionSpacing) { currentSection = Math.max(minSectionSpacing, currentSection - 2); node.querySelectorAll('section').forEach(s => { s.style.marginBottom = currentSection + 'px'; }); if (hr) hr.style.marginBottom = currentSection + 'px'; changed = true; }
        if (currentItem > minItemSpacing) { currentItem = Math.max(minItemSpacing, currentItem - 1); node.querySelectorAll('.exp-item, .edu-item, .proj-item').forEach(e => { e.style.marginBottom = currentItem + 'px'; }); // update skills list item spacing
        node.querySelectorAll('.skills li').forEach(li => { li.style.marginBottom = currentItem + 'px'; }); changed = true; }
        if (currentContactGap > minContactGap) { currentContactGap = Math.max(minContactGap, currentContactGap - 1); if (contact) contact.style.gap = currentContactGap + 'px'; changed = true; }
        if (currentContactMargin > minContactMargin) { currentContactMargin = Math.max(minContactMargin, currentContactMargin - 1); if (contact) contact.style.marginTop = currentContactMargin + 'px'; changed = true; }
        if (currentSkillInlineGap > minSkillInlineGap) { currentSkillInlineGap = Math.max(minSkillInlineGap, currentSkillInlineGap - 1); node.querySelectorAll('.skills li').forEach(li => { li.style.marginRight = currentSkillInlineGap + 'px'; }); changed = true; }

        if (currentHeadingSpacing > minHeadingSpacing) { currentHeadingSpacing = Math.max(minHeadingSpacing, currentHeadingSpacing - 1); node.querySelectorAll('section h2').forEach(h => { h.style.marginBottom = currentHeadingSpacing + 'px'; h.style.marginTop = '0px'; }); changed = true; }

        if (!changed) break;
        measured = node.getBoundingClientRect().height;
        sIter++;
      }
      // Also shrink header font / spacing while we are reducing spacing (to save more room)
      if (measured > usableHeight) {
        if (currentHeaderFont > minHeaderFont) { currentHeaderFont = Math.max(minHeaderFont, currentHeaderFont - 1); if (headerName) headerName.style.fontSize = currentHeaderFont + 'px'; }
        if (currentHeaderSpacing > minHeaderSpacing) { currentHeaderSpacing = Math.max(minHeaderSpacing, currentHeaderSpacing - 1); if (headerEl) headerEl.style.marginBottom = currentHeaderSpacing + 'px'; }
        measured = node.getBoundingClientRect().height;
      }
      // If still overflowing, shrink font as last resort
      if (measured > usableHeight) {
        let fIter = 0;
        while (measured > usableHeight && currentFont > minFont && fIter < maxIterations) {
          currentFont = Math.max(minFont, currentFont - 0.5);
          node.style.fontSize = currentFont + 'px';
          // keep skills same size as body text so they match other sections
          if (skills) skills.style.fontSize = currentFont + 'px';
          currentSkillsFont = currentFont;
          measured = node.getBoundingClientRect().height;
          fIter++;
        }
      }

      // Final fallback: scale down the whole container so it fits (keeps proportions)
      if (measured > usableHeight) {
        const scale = usableHeight / measured;
        node.style.transform = `scale(${scale})`;
        node.style.transformOrigin = 'top left';
      } else {
        node.style.transform = 'none';
      }

      // Persist final values to state
      setFontSize(currentFont);
      setContainerPadding(currentPadding);
      setSectionSpacing(currentSection);
      setItemSpacing(currentItem);
      setContactGap(currentContactGap);
      setContactMargin(currentContactMargin);
      setHeaderFontSize(currentHeaderFont);
      setHeaderSpacing(currentHeaderSpacing);
      setHeadingSpacing(currentHeadingSpacing);
      setSkillInlineGap(currentSkillInlineGap);
      setSkillsFontSize(currentSkillsFont);
    }

    adjustFont();

    // Re-run on resize or when content changes
    const ro = new ResizeObserver(adjustFont);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', adjustFont);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', adjustFont);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto bg-white text-gray-800 leading-relaxed" style={{ fontSize: fontSize + 'px', lineHeight: 1.25, padding: containerPadding + 'px', maxWidth: '8.5in', boxSizing: 'border-box', overflowWrap: 'break-word', wordBreak: 'break-word', overflowX: 'hidden' }}>
      {/* Header */}
      <header className="text-center" style={{ marginBottom: headerSpacing + 'px' }}> 
        <h1 className="font-bold mb-1" style={{ color: accentColor, fontSize: headerFontSize + 'px', lineHeight: 1.05, marginBottom: '4px' }}>
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <p className="text-gray-600" style={{ fontSize: Math.max(11, fontSize - 1) + 'px', margin:0 }}>
          {data.personal_info?.profession || data.personal_info?.title}
        </p>

        <div className="contact-area flex flex-wrap justify-center text-sm text-gray-600" style={{ gap: contactGap + 'px', marginTop: contactMargin + 'px' }}>
          {data.personal_info?.email && (
            <div className="flex items-center gap-1">
              <Mail className="size-4" />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-1">
              <Phone className="size-4" />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="size-4" />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="size-4" />
              <span className="break-all">{data.personal_info.linkedin}</span>
            </div>
          )}
          {data.personal_info?.website && (
            <div className="flex items-center gap-1">
              <Globe className="size-4" />
              <span className="break-all">{data.personal_info.website}</span>
            </div>
          )}
        </div>
      </header>

      <hr className="border-gray-200" style={{ marginBottom: sectionSpacing + 'px' }} />

      {/* Summary */}
      {data.professional_summary && (
        <section style={{ marginBottom: sectionSpacing + 'px' }}>
          <h2 className="text-sm font-semibold" style={{ color: accentColor, marginBottom: headingSpacing + 'px' }}>
            SUMMARY
          </h2>
          <p className="text-gray-700 whitespace-pre-line" style={{overflowWrap: 'break-word', wordBreak: 'break-word', hyphens: 'auto'}}>{data.professional_summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section style={{ marginBottom: sectionSpacing + 'px' }}>
          <h2 className="text-sm font-semibold" style={{ color: accentColor, marginBottom: headingSpacing + 'px' }}>
            EXPERIENCE
          </h2>

          <div>
            {data.experience.map((exp, index) => (
              <div key={index} className="exp-item flex justify-between items-start" style={{ marginBottom: itemSpacing + 'px' }}>
                <div>
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-gray-700">{exp.company}</p>
                  {exp.description && (
                    <p className="text-gray-700 mt-1 whitespace-pre-line" style={{overflowWrap: 'break-word', wordBreak: 'break-word', hyphens: 'auto'}}>{exp.description}</p>
                  )}
                </div>
                <div className="text-sm text-gray-600 text-right">
                  <p>{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section style={{ marginBottom: sectionSpacing + 'px' }}>
          <h2 className="text-sm font-semibold" style={{ color: accentColor, marginBottom: headingSpacing + 'px' }}>
            EDUCATION
          </h2>

          <div>
            {data.education.map((edu, index) => (
              <div key={index} className="edu-item flex justify-between items-start" style={{ marginBottom: itemSpacing + 'px' }}>
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                  <p className="text-gray-700">{edu.institution}</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{formatDate(edu.graduation_date)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.project && data.project.length > 0 && (
        <section style={{ marginBottom: sectionSpacing + 'px' }}>
          <h2 className="text-sm font-semibold" style={{ color: accentColor, marginBottom: headingSpacing + 'px' }}>
            PROJECTS
          </h2>

          <div>
            {data.project.map((proj, index) => (
              <div key={index} className="proj-item" style={{ marginBottom: itemSpacing + 'px' }}>
                <h4 className="font-semibold text-gray-800">{proj.name}</h4>
                <p className="text-gray-600" style={{overflowWrap: 'break-word', wordBreak: 'break-word', hyphens: 'auto'}}>{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section style={{ marginBottom: sectionSpacing + 'px' }}>
          <h2 className="text-sm font-semibold" style={{ color: accentColor, marginBottom: headingSpacing + 'px' }}>
            SKILLS
          </h2>

          <ul className="skills list-disc pl-5 text-gray-700" style={{ fontSize: skillsFontSize + 'px', margin: 0 }}>
            {data.skills.map((skill, index) => (
              <li key={index} style={{ display: 'inline-block', marginRight: skillInlineGap + 'px', marginBottom: '0px', overflowWrap: 'break-word', wordBreak: 'break-word' }}><span style={{ marginRight: '6px' }}>•</span>{skill}</li>
            ))}
          </ul> 
        </section>
      )}

      {/* Achievements / Training */}
      {((data.key_achievements && data.key_achievements.length > 0) || (data.training && data.training.length > 0)) && (
        <section style={{ marginBottom: sectionSpacing + 'px' }}>
          <h2 className="text-sm font-semibold" style={{ color: accentColor, marginBottom: headingSpacing + 'px' }}>
            ADDITIONAL
          </h2>

          {data.training && data.training.length > 0 && (
            <div className="" style={{ marginBottom: itemSpacing + 'px' }}>
              <h4 className="font-medium">Training / Courses</h4>
              <ul className="list-disc pl-5 text-gray-700">
                {data.training.map((t, i) => (
                  <li key={i} style={{overflowWrap: 'break-word', wordBreak: 'break-word'}}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          {data.key_achievements && data.key_achievements.length > 0 && (
            <div>
              <h4 className="font-medium">Key Achievements</h4>
              <ul className="list-disc pl-5 text-gray-700">
                {data.key_achievements.map((k, i) => (
                  <li key={i} style={{overflowWrap: 'break-word', wordBreak: 'break-word'}}>{k}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default SimpleResume;

export default function normalizeResumeData(data = {}) {
  // Ensure we return a shallow clone with safe primitive values and arrays
  const normalized = {
    _id: data._id || '',
    title: data.title || '',
    template: typeof data.template === 'string' ? data.template : 'classic',
    public: !!data.public,
    accent_colour: data.accent_colour || '#3B82F6',
    personal_info: {
      image: (data.personal_info && typeof data.personal_info.image === 'string') ? data.personal_info.image : (data.personal_info?.image?.url || '') || '',
      full_name: data.personal_info?.full_name || '',
      email: data.personal_info?.email || '',
      phone: data.personal_info?.phone || '',
      location: data.personal_info?.location || '',
      linkedin: data.personal_info?.linkedin || '',
      website: data.personal_info?.website || '',
    },
    professional_summary: (typeof data.professional_summary === 'string') ? data.professional_summary : (data.professional_summary?.content ?? ''),
    experience: Array.isArray(data.experience) ? data.experience.map(e => ({
      company: e?.company || '',
      position: e?.position || '',
      start_date: e?.start_date || '',
      end_date: e?.end_date || '',
      description: e?.description || '',
      is_current: !!e?.is_current
    })) : [],
    project: Array.isArray(data.project) ? data.project.map(p => ({
      name: p?.name || '',
      type: p?.type || '',
      description: p?.description || ''
    })) : [],
    education: Array.isArray(data.education) ? data.education.map(ed => ({
      institution: ed?.institution || '',
      degree: ed?.degree || '',
      field: ed?.field || '',
      graduation_date: ed?.graduation_date || '',
      gpa: ed?.gpa || ''
    })) : [],
    skills: Array.isArray(data.skills) ? data.skills.map(s => String(s)) : (data.skills ? [String(data.skills)] : []),
  };

  return normalized;
}
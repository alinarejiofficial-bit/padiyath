window.PADIYATH_DEPARTMENTS = [
  {
    slug: "cardiology",
    name: "Cardiology",
    shortDescription: "Advanced heart care, diagnostics, and interventional procedures.",
    image: "images/hero.png",
    mediaClass: "dept-card-media--cardiology",
    description:
      "The Cardiology department at Padiyath Hospital provides comprehensive cardiovascular care — from preventive screenings and non-invasive diagnostics to advanced interventional procedures. Our board-certified cardiologists use state-of-the-art technology to diagnose and treat heart conditions with precision, compassion, and outstanding clinical outcomes.",
    services: [
      "ECG, Echocardiography & Stress Testing",
      "Angiography & Angioplasty",
      "Pacemaker Implantation",
      "Heart Failure Management",
      "Preventive Cardiology Programs",
      "24/7 Cardiac Emergency Care",
    ],
    doctors: [
      {
        name: "Dr. Ananya Menon",
        specialty: "Senior Cardiologist",
        years: "18 Years",
        qualifications: "MD, DM Cardiology",
        description: "Expert in interventional cardiology and preventive heart health.",
        initials: "AM",
        portrait: "spec-portrait--1",
      },
    ],
  },
  {
    slug: "orthopedics",
    name: "Orthopedics",
    shortDescription: "Joint care, sports medicine, and minimally invasive surgery.",
    image: "images/hero.png",
    mediaClass: "dept-card-media--orthopedics",
    description:
      "Our Orthopedics department specializes in the diagnosis and treatment of musculoskeletal conditions. From sports injuries and joint replacements to spine care and rehabilitation, our surgeons combine advanced techniques with personalized recovery plans to restore mobility and quality of life.",
    services: [
      "Joint Replacement Surgery",
      "Arthroscopy & Sports Medicine",
      "Spine & Back Pain Treatment",
      "Fracture & Trauma Care",
      "Physiotherapy & Rehabilitation",
      "Pediatric Orthopedics",
    ],
    doctors: [
      {
        name: "Dr. Nivedita Rao",
        specialty: "Orthopedic Surgeon",
        years: "14 Years",
        qualifications: "MS Orthopedics",
        description: "Focused on arthroscopy, sports medicine, and joint preservation.",
        initials: "NR",
        portrait: "spec-portrait--3",
      },
    ],
  },
  {
    slug: "pediatrics",
    name: "Pediatrics",
    shortDescription: "Compassionate care for infants, children, and adolescents.",
    image: "images/hero.png",
    mediaClass: "dept-card-media--pediatrics",
    description:
      "The Pediatrics department offers gentle, family-centered care for children at every stage of growth. Our pediatricians provide vaccinations, developmental assessments, acute illness management, and specialized care in a warm environment designed to put young patients and parents at ease.",
    services: [
      "Well-Baby & Child Check-ups",
      "Vaccination Programs",
      "Neonatal & Newborn Care",
      "Growth & Development Monitoring",
      "Pediatric Emergency Services",
      "Nutrition & Adolescent Health",
    ],
    doctors: [
      {
        name: "Dr. Rahul Pillai",
        specialty: "Pediatrician",
        years: "12 Years",
        qualifications: "MD Pediatrics",
        description: "Compassionate care for infants, children, and adolescents.",
        initials: "RP",
        portrait: "spec-portrait--4",
      },
    ],
  },
  {
    slug: "neurology",
    name: "Neurology",
    shortDescription: "Expert diagnosis and treatment for neurological conditions.",
    image: "images/hero.png",
    mediaClass: "dept-card-media--neurology",
    description:
      "Our Neurology department delivers expert care for disorders of the brain, spine, and nervous system. With advanced neuro-imaging and a multidisciplinary approach, we treat stroke, epilepsy, movement disorders, headaches, and complex neurological conditions with precision and compassion.",
    services: [
      "Stroke & Neurocritical Care",
      "EEG & EMG Diagnostics",
      "Epilepsy Management",
      "Movement Disorder Treatment",
      "Headache & Migraine Clinic",
      "Neuro Rehabilitation Support",
    ],
    doctors: [
      {
        name: "Dr. Joseph Mathew",
        specialty: "Consultant Neurologist",
        years: "16 Years",
        qualifications: "MD, DM Neurology",
        description: "Specialist in stroke care, epilepsy, and neuro-critical medicine.",
        initials: "JM",
        portrait: "spec-portrait--2",
      },
    ],
  },
  {
    slug: "general-medicine",
    name: "General Medicine",
    shortDescription: "Comprehensive primary care and preventive health services.",
    image: "images/hero.png",
    mediaClass: "dept-card-media--general",
    description:
      "The General Medicine department serves as the foundation of patient care at Padiyath Hospital. Our physicians provide comprehensive primary care, chronic disease management, preventive health screenings, and coordinated referrals to specialists — ensuring continuity of care for every patient.",
    services: [
      "General Health Check-ups",
      "Diabetes & Hypertension Care",
      "Infectious Disease Management",
      "Preventive Health Screenings",
      "Geriatric Care",
      "Lifestyle & Wellness Counseling",
    ],
    doctors: [
      {
        name: "Dr. Arun Das",
        specialty: "General Physician",
        years: "20 Years",
        qualifications: "MD Internal Medicine",
        description: "Comprehensive primary care and chronic disease management.",
        initials: "AD",
        portrait: "spec-portrait--6",
      },
    ],
  },
  {
    slug: "gynecology",
    name: "Gynecology",
    shortDescription: "Women's health, maternity care, and reproductive wellness.",
    image: "images/hero.png",
    mediaClass: "dept-card-media--gynecology",
    description:
      "Our Gynecology department provides comprehensive women's healthcare across all life stages — from adolescent health and family planning to maternity care and menopause management. We offer a private, supportive environment with experienced specialists dedicated to women's wellness.",
    services: [
      "Antenatal & Postnatal Care",
      "High-Risk Pregnancy Management",
      "Laparoscopic Gynec Surgery",
      "Fertility Evaluation",
      "Menstrual & Hormonal Disorders",
      "Women's Wellness Screenings",
    ],
    doctors: [
      {
        name: "Dr. Meera Thomas",
        specialty: "Gynecologist",
        years: "15 Years",
        qualifications: "MD, DGO",
        description: "Women's health, maternity care, and reproductive wellness.",
        initials: "MT",
        portrait: "spec-portrait--5",
      },
    ],
  },
];

window.getDepartmentBySlug = function (slug) {
  return window.PADIYATH_DEPARTMENTS.find((d) => d.slug === slug) || null;
};

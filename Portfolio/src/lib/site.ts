import { marked } from 'marked'

export const profile = {
  name: 'Muckund Sharma',
  shortName: 'Muckund',
  role: 'Mechanical Engineering Student',
  school: 'University of Waterloo',
  tagline: 'Driven to advance and redefine the next era of flight.',
  location: 'Waterloo, ON',
  email: 'm269shar@uwaterloo.ca',
  linkedin: 'https://ca.linkedin.com/in/muckund-sharma-aa3717363',
  // File name in public/img/ for the University of Waterloo logo; shown next to the title when set.
  schoolLogo: 'uwaterloo-logo.png' as string | undefined,
  resumeFile: '/Muckund-Sharma-Resume.pdf',
}

export const skillGroups = [
  {
    title: 'CAD, Simulation & Analysis',
    items: [
      'SolidWorks (CSWA Certified)',
      'AutoCAD',
      'CATIA 3DEXPERIENCE (Mechanical Designer Certified)',
      'ANSYS Mechanical / Fluent',
      'XFLR5',
      'FEA',
      'CFD',
      'GD&T',
      'DFM / DFA',
      'Tolerance Analysis',
      '2D Manufacturing Drawings',
      'DXF Generation',
    ],
  },
  {
    title: 'Manufacturing & Fabrication',
    items: [
      'CNC Machining (Milling, Lathe)',
      'CNC Waterjet',
      'Manual Milling & Lathe',
      'Laser Cutting',
      '3D Printing (FDM)',
      'Horizontal Bandsaw',
      'Composite Layup (Vacuum Infusion)',
      'Mechanical Assembly',
      'Soldering',
      'Precision Measurement',
    ],
  },
  {
    title: 'Programming & Software',
    items: ['Python', 'MATLAB (Onramp Certified)', 'C++', 'Microsoft Excel, Word, PowerPoint'],
  },
  {
    title: 'Electronics',
    items: ['Arduino', 'RC Systems', 'Brushless Motors / ESCs', 'Servos'],
  },
  {
    title: 'Project Management & Documentation',
    items: [
      'Procurement Coordination',
      'Stakeholder Communication',
      'Jira',
      'Construction Drawing / Spec Interpretation',
      'Formwork Design',
      'Rebar Detailing',
    ],
  },
  {
    title: 'Languages',
    items: ['English (Fluent)', 'French (Intermediate, DELF B1 Certified)'],
  },
]

/** Path to a file in /public/img. */
export function img(file: string) {
  return `/img/${file}`
}

/** Content bodies are short markdown bullet lists; render them to HTML. */
export function md(source: string) {
  return marked.parse(source, { async: false })
}

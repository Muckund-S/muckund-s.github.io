import { marked } from 'marked'

export const profile = {
  name: 'Muckund Sharma',
  shortName: 'Muckund',
  role: 'Mechanical Engineering Student',
  school: 'University of Waterloo',
  tagline: 'Driven to advance and redefine the next era of flight.',
  location: 'Waterloo, ON',
  linkedin: 'https://ca.linkedin.com/in/muckund-sharma-aa3717363',
  resume:
    'https://drive.google.com/file/d/18nwD31N6SlahTynJUpXiKJqP8qIkoO65/view?usp=sharing',
}

export const stats = [
  { value: '4.0', label: 'GPA · 1A' },
  { value: '5', label: 'Hands-on builds' },
  { value: '250+', label: 'Club members led' },
  { value: '100+', label: 'Families supported' },
]

export const skillGroups = [
  { title: 'CAD', items: ['SolidWorks', 'AutoCAD'] },
  {
    title: 'Design & Analysis',
    items: [
      'SolidWorks Simulation (FEA)',
      'Design for Manufacturing',
      'Engineering Drawings (GD&T)',
    ],
  },
  { title: 'Programming', items: ['MATLAB', 'C++', 'Python', 'Java'] },
  {
    title: 'Fabrication',
    items: [
      'CNC & Manual Machining',
      'Electrical Fabrication',
      '3D Printing',
      'Woodworking',
    ],
  },
]

/** Route a /public/img asset through the Netlify Image CDN when on Netlify. */
export function img(file: string, width: number) {
  if (import.meta.env.VITE_NETLIFY) {
    return `/.netlify/images?url=/img/${file}&w=${width}&fm=webp`
  }
  return `/img/${file}`
}

/** Content bodies are short markdown bullet lists; render them to HTML. */
export function md(source: string) {
  return marked.parse(source, { async: false })
}

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
  resumeFile: '/Muckund-Sharma-Resume.pdf',
}

export const skillGroups = [
  {
    title: 'CAD & Simulation',
    items: ['SolidWorks (CSWA Certified)', 'AutoCAD', 'Ansys Mechanical/Fluent', 'CATIA', 'FEA', 'CFD'],
  },
  { title: 'Programming & Data', items: ['Python', 'MATLAB', 'C++', 'Java', 'Git'] },
  {
    title: 'Manufacturing & Fabrication',
    items: ['CNC Machining', 'Milling', 'Lathe', '3D Printing', 'Laser Cutting', 'GD&T', 'Soldering'],
  },
  {
    title: 'Electronics',
    items: ['Arduino', 'RC Systems', 'Brushless Motors/ESCs', 'Servos'],
  },
]

/** Path to a file in /public/img. */
export function img(file: string, _width?: number) {
  return `/img/${file}`
}

/** Content bodies are short markdown bullet lists; render them to HTML. */
export function md(source: string) {
  return marked.parse(source, { async: false })
}

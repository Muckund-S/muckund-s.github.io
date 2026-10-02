---
title: RC Aircraft Design, CFD & Fabrication
subtitle: Cessna 172-Inspired RC Aircraft
description: A complete RC aircraft designed in SolidWorks, analyzed with 3D CFD in ANSYS Fluent, and hand-built and flight-tested.
category: Aerospace
order: 1
featured: true
image: rc-aircraft.jpg
gallery:
  - file: rc-drawing.jpg
    caption: Engineering drawings of the airframe (SolidWorks)
  - file: rc-ld-plot.jpg
    caption: CL, CD and L/D versus angle of attack
  - file: rc-cfd.jpg
    caption: Turbulence kinetic energy contour around the wing (ANSYS Fluent)
  - file: rc-flight.jpg
    caption: Flight test of the finished aircraft
problem:
  - Design and build a lightweight Cessna 172-inspired RC aircraft balancing aerodynamic efficiency, structural integrity, and manufacturability.
  - Determine a wing operating condition that maximizes aerodynamic efficiency without introducing unnecessary structural complexity.
approach:
  - Designed the complete airframe in SolidWorks and fabricated the aircraft by hand.
  - Performed 3D CFD analysis in ANSYS Fluent across five angles of attack, calculating CL, CD, and L/D.
  - Used aerodynamic performance trends to guide selection of the 2.26° wing incidence.
result:
  - Achieved a maximum simulated L/D of 13.9 at the selected design condition, with CL = 1.294 and CD = 0.0932.
  - Higher angles of attack produced substantially greater drag with limited lift gains, supporting the selected configuration as the most efficient condition tested.
  - Successfully built, integrated, and flight-tested the aircraft.
metrics:
  - value: "13.9"
    label: Max simulated L/D
  - value: "2.26°"
    label: Wing incidence
  - value: "1.294"
    label: CL at design point
tags: ["SolidWorks", "ANSYS Fluent", "CFD", "Brushless Motors", "RC Systems"]
---

- Designed and fabricated a complete Cessna 172-inspired RC aircraft, from engineering drawings in SolidWorks to a hand-built functional prototype.
- Ran 3D CFD on the wing geometry in ANSYS Fluent and used the results to select a 2.26° wing incidence.
- Integrated a 1400-kV brushless motor, 30-A ESC, propeller, servos, receiver, and control surfaces into the airframe.

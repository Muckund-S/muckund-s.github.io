---
dates: Aug 2026 – Present
videos:
  - youtube: oaQr4G5Oavw
    title: MX-01 controls test
  - youtube: dkwkGfQDkbQ
    title: MX-01 maiden test flight
title: "MX-01 RC Aircraft: Design, CFD & Fabrication"
subtitle: MX-01, a Cessna 172-inspired RC aircraft
description: MX-01, a complete RC aircraft designed in SolidWorks, analyzed with 3D CFD in ANSYS Fluent, and hand-built and flight-tested.
category: Aerospace
order: 1
featured: true
image: rc-aircraft.jpg
gallery:
  - file: rc-preflight.jpg
    caption: Pre-flight with the finished aircraft
  - file: rc-flight.jpg
    caption: Flight test
  - file: rc-drawing.jpg
    caption: Engineering drawings of the airframe (SolidWorks)
  - file: rc-fuselage-build.jpg
    caption: Fuselage structure during fabrication
  - file: rc-fuselage-electronics.jpg
    caption: Battery, ESC and wiring installed in the fuselage
  - file: rc-cfd.jpg
    caption: Turbulence kinetic energy contour around the wing section (ANSYS Fluent)
  - file: rc-ld-plot.jpg
    caption: CL, CD and L/D versus angle of attack
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

## Design and fabrication

I designed MX-01, a Cessna 172-inspired RC aircraft, end to end. The airframe and its engineering drawings were developed in SolidWorks, and the CAD was then translated into a hand-built, functional prototype. The goal was an aircraft that balances aerodynamic efficiency, structural integrity, and manufacturability, without adding structural complexity that the wing does not need.

## CFD analysis

I ran 3D CFD on the wing geometry in ANSYS Fluent across five angles of attack and extracted the lift and drag forces to calculate CL, CD, and L/D at each condition. Pressure, velocity, turbulence, and wall-shear distributions were used to understand where the lift and drag come from, not just how large they are.

Comparing L/D trends across the sweep, I selected a **2.26° wing incidence** as the design point. It gave a peak simulated **L/D of 13.9** (CL = 1.294, CD = 0.0932). Higher angles of attack produced a disproportionate rise in drag for limited lift gain, which is what supported the selection.

## Propulsion and flight control

I selected, wired, and commissioned the full propulsion and control system: a 1400-kV brushless motor, a 30-A ESC, propeller, servos, receiver, and control surfaces.

## Controls test and maiden flight

The videos at the top of this page show MX-01's controls test and its maiden test flight.

## Result

The aircraft was built, integrated, and flight-tested. The flight validated the airframe structure, the propulsion integration, and the CFD-informed wing design under real flight conditions.
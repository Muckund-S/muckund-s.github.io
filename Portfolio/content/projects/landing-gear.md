---
dates: Sep 2026 – Present
title: Pegasus 1 Landing Gear & FEA
subtitle: Waterloo Aerial Robotics Group
description: A lightweight carbon-fiber landing gear with an intentional breakaway section, validated with orthotropic linear-static FEA.
category: Aerospace
order: 2
featured: true
image: gear-cover.jpg
problem:
  - Design a lightweight landing gear assembly for Pegasus 1 while maintaining structural integrity under landing loads.
  - Incorporate a controlled breakaway feature to protect the aircraft structure during high-impact landings.
approach:
  - Designed the complete landing gear assembly in SolidWorks using 22 mm OD carbon-fiber tubes and a 3D-printed PETG-CF bracket.
  - Modeled the bracket in isolation and ran orthotropic linear-static FEA across a 1-4g load sweep.
  - Analyzed stress and deformation to identify critical regions and validate the controlled breakaway joint.
result:
  - Achieved a 3.81 factor of safety at 1g normal landing loads.
  - Predicted tensile-failure onset at the hourglass neck at 4g, confirming the joint fails before the primary carbon-fiber tubes are overloaded.
  - Mesh refinement around bolt interfaces changed peak stress by only 1.22% (37.33 to 37.79 MPa), confirming convergence.
metrics:
  - value: "3.81"
    label: FOS at 1g
  - value: "1.22%"
    label: Stress change on refinement
tags: ["SolidWorks", "FEA", "Carbon Fiber", "3D Printing", "Design for Failure"]
---

## Design

The Pegasus 1 landing gear uses 22 mm OD carbon-fiber tubes and a 3D-printed PETG-CF bracket. The bracket includes an intentional breakaway section with an hourglass neck, so that in a hard crash the sacrificial joint fails before the primary airframe or carbon-fiber tubes are overloaded.

<figure>
<img src="/img/gear-leg.jpg" alt="SolidWorks render of one Pegasus 1 landing-gear leg: carbon-fiber tubes, clamps and a T-shaped foot" loading="lazy" />
<figcaption>One landing-gear leg: carbon-fiber tubes, clamped joints and a T-shaped foot (SolidWorks).</figcaption>
</figure>

## FEA validation

I modeled the bracket in isolation and ran orthotropic linear-static FEA under a 1–4g load sweep (4g = 196.2 N). At 1g normal landing loads the bracket has a **3.81 factor of safety**. At 4g the analysis predicts tensile-failure onset at the hourglass neck, which is the intended sacrificial failure.

<figure>
<img src="/img/gear-fea.jpg" alt="Stress contour on the landing-gear bracket at 4g in ANSYS" loading="lazy" />
<figcaption>4g (196.2 N) stress contour on the bracket.</figcaption>
</figure>

## Mesh convergence

I refined the mesh around the bolt interfaces and the breakaway region. Peak maximum principal stress moved from 37.33 to 37.79 MPa, a change of only **1.22%**, which confirms the result is mesh-converged.

## Related work

I also designed a 3D-printable protective enclosure for an APD 120F3 ESC, with M3 mounting interfaces, component clearances, passive ventilation, and terminal protection.
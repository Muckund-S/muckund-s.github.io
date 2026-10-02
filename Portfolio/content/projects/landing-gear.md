---
title: Pegasus 1 Landing Gear & FEA
subtitle: Waterloo Aerial Robotics Group
description: A lightweight carbon-fiber landing gear with an intentional breakaway section, validated with orthotropic linear-static FEA.
category: Aerospace
order: 2
featured: true
image: gear-assembly.jpg
gallery:
  - file: gear-bracket.jpg
    caption: 3D-printed PETG-CF breakaway bracket (SolidWorks)
  - file: gear-fea.jpg
    caption: 4g (196.2 N) stress contour on the bracket
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

- Designed a lightweight landing gear with an intentional breakaway section to protect the airframe in hard crashes.
- Validated the bracket with orthotropic linear-static FEA under 1-4g loading.

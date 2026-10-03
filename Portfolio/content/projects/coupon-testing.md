---
dates: Sep 2025 – May 2026
title: Coupon Compression Testing
subtitle: Waterloo Rocketry
description: Standardized compression testing of six fiberglass laminates to select the Polaris rocket airframe material.
category: Materials
order: 3
featured: true
image: coupon-test.jpg
gallery:
  - file: coupon-plot.jpg
    caption: Stress vs. strain comparison of the six laminates
  - file: coupon-fixture.jpg
    caption: Compression-testing fixture drawing (Boeing BSS 7260)
problem:
  - Select a fiberglass laminate for the Polaris rocket airframe based on compression performance and material cost.
  - Compare six laminate configurations under standardized mechanical testing conditions.
approach:
  - Machined a Boeing BSS 7260 fixture and prepared test coupons.
  - Performed standardized compression testing (ASTM D695 / DIN EN 2850) on six fiberglass laminates using a 15 kN-capacity system.
  - Developed a Python pipeline to convert load/displacement data into stress-strain curves and extract failure properties.
result:
  - Generated quantitative compression data for six laminate configurations, enabling comparison of their mechanical performance for airframe material selection.
metrics:
  - value: "6"
    label: Laminates tested
  - value: "15 kN"
    label: Test system capacity
tags: ["Python", "Composites", "Machining", "ASTM D695", "Data Analysis"]
---

## Testing

I compression-tested six fiberglass laminate configurations for the Polaris rocket airframe, following ASTM D695 / DIN EN 2850 procedures on a 15 kN-capacity testing system. The aim was to compare their mechanical performance so a laminate could be selected on compression performance and material cost.

## Fixture and specimens

I machined a Boeing BSS 7260 compression-testing fixture from technical drawings using manual milling and lathe operations, holding tight tolerances so coupons align consistently. I also manufactured precision aluminum alignment tabs on a CNC waterjet to support standardized testing.

## Data pipeline

I wrote a Python pipeline that converts raw load and displacement data into stress-strain curves and extracts key failure properties, so all six laminates can be compared quantitatively and repeatably.

## Related composites work

I executed a full vacuum-infusion layup for composite plate stock: fabric sequencing, mould preparation, bag assembly, leak testing, and resin-flow monitoring.
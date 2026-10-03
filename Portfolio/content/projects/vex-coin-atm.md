---
title: VEX IQ Automated Coin Management System
subtitle: Multi-user coin ATM with embedded control
description: A multi-user automated coin ATM built from VEX IQ parts, a laser-cut HDF frame and 3D-printed drivetrain parts, controlled by a 700+ line C++ program.
category: Robotics & Embedded
order: 5
dates: Jan 2026 – Apr 2026
image: atm-model.jpg
youtube: sn-0u3_LIF4
tags: ["C++", "Embedded Control", "Laser Cutting", "3D Printing", "Sensor Calibration"]
metrics:
  - value: "96.7%"
    label: Coin-detection accuracy
  - value: "100%"
    label: Withdrawal accuracy
  - value: "0.41 s"
    label: Avg. jam-detection response
---

## Overview

I designed and fabricated a multi-user automated coin ATM using VEX IQ components, a laser-cut HDF frame, and 3D-printed drivetrain parts, managing the build and the software integration across a 4-person team.

<figure>
<img src="/img/atm-closeup.jpg" alt="Close-up of the SolidWorks model of the coin ATM mechanism" loading="lazy" />
<figcaption>Close-up of the SolidWorks model.</figcaption>
</figure>

## Software architecture

I architected a 700+ line C++ embedded program around a centralized state struct. It runs 7 operating modes at about 50 Hz and provides PIN authentication, tamper detection, overdraw prevention, and session timeout, with deterministic control behaviour.

## Results

Optical-sensor calibration gave **96.7% coin-detection accuracy**, with **100% withdrawal accuracy** across all test trials and a **0.41 s** average jam-detection response, all verified against ASTM-style test procedures.

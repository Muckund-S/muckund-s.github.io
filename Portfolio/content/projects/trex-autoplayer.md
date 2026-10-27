---
title: Chrome T-Rex Autoplayer
subtitle: An Arduino light sensor and servo that play Chrome's offline dino game
description: An Arduino Uno R3 plays Chrome's offline T-Rex game on its own. A photoresistor detects approaching cacti and a servo presses the space bar, with the trigger threshold calibrated automatically at startup.
category: Robotics & Embedded
summary: "Arduino photoresistor and servo that jump cacti automatically, with self-calibrating detection."
role: "Solo project, covering the circuit, the mechanical mounting and the Arduino code."
order: 8
dates: Oct 2026
image: trex-autoplayer.jpg
youtube: pqEjfyg5scQ
tags: ["Arduino", "C++", "Sensors", "Servo", "Circuit Design", "Calibration"]
metrics:
  - value: "75%"
    label: Trigger threshold, of the calibrated baseline
  - value: "120 ms"
    label: Servo key press
  - value: "300 ms"
    label: Cooldown between jumps
problem:
  - Play Chrome's offline T-Rex game automatically, using a light sensor to detect obstacles and a servo to press the jump key.
  - Keep detection reliable across different screen brightness and room lighting.
approach:
  - Wired a photoresistor and a 10 kΩ resistor as a voltage divider into analog pin A0, aimed at a fixed point ahead of the dinosaur.
  - Mounted a servo above the space bar, driven from pin 9, with 180° as the rest position and 140° as the press position.
  - Calibrated at startup by averaging 50 readings and setting the trigger at 75% of the baseline, then tuned the timing through testing.
result:
  - The autoplayer reliably jumps cacti in the game's light mode.
  - Its fixed timing does not adapt as the game speeds up, it cannot duck under birds, and night mode inverts the colors and breaks the detection.
---

## Overview

An Arduino Uno R3 plays Chrome's offline T-Rex game by itself. A photoresistor watches for obstacles on the screen and a servo taps the space bar to jump. Dark cacti pass over a fixed point on a light background, so a light sensor aimed at that point can detect them.

Parts: Arduino Uno R3, photoresistor, 10 kΩ resistor, servo motor, breadboard, jumper wires, tape and a paper light shield.

## Sensing

The photoresistor and the 10 kΩ resistor form a voltage divider, with the midpoint connected to analog pin A0. When a dark cactus passes the sensor, the photoresistor's resistance rises and the A0 reading drops. That drop is the trigger.

The sensor is taped to the screen just ahead of the dinosaur, at ground level, where the cacti travel. A small paper shroud blocks ambient light and screen glare so the reading stays consistent.

## Actuation

The servo signal is connected to pin 9, and the servo is mounted above the laptop's space bar. In code, 180° is the rest position and 140° is the press position, so a small swing taps the key.

## Calibration and control

On startup the Arduino averages 50 sensor readings, taking about 0.5 s, to establish a baseline for the blank background. It sets the trigger threshold at 75% of that baseline, so the system adapts to different screen brightness and room lighting without hard-coded values.

The control loop compares the live reading with the threshold. When the reading falls below it, the servo presses for 120 ms and returns to rest, then waits 300 ms before it can trigger again. This prevents a double jump on a single obstacle. The threshold multiplier, press angle, press duration and cooldown were tuned through testing, using Serial Monitor output of the baseline and threshold values to debug.

## Limitations and improvements

- The fixed delays do not adapt as the game speeds up, and the system cannot duck under birds.
- The game's night mode inverts the colors, which breaks the detection logic.
- A second sensor would allow obstacle speed to be measured so the jump can be timed dynamically.
- A second servo would allow ducking.
- Detecting the light and dark inversion would allow the trigger logic to be flipped automatically.

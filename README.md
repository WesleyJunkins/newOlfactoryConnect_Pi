# Raspberry Pi Fan Controller

A simple terminal-based application to control a fan connected to a Raspberry Pi 5.

## Hardware Requirements

- Raspberry Pi 5
- 5V DC Fan
- Transistor (e.g., 2N2222) for controlling the fan
- 1kΩ resistor
- Jumper wires

## Wiring Instructions

1. Connect the fan's positive wire to the 5V pin on the Raspberry Pi
2. Connect the fan's negative wire to the collector of the transistor
3. Connect the emitter of the transistor to ground
4. Connect GPIO18 (or your chosen pin) to the base of the transistor through a 1kΩ resistor

## Software Setup

1. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Make the script executable:
   ```bash
   chmod +x fan_controller.py
   ```

## Usage

Run the program:
```bash
python3 fan_controller.py
```

The program provides a simple menu interface:
1. Turn ON fan - Turn on the fan at a specified speed
2. Turn OFF fan - Turn off the fan
3. Set fan speed - Adjust the fan speed (0-100%)
4. Show current status - Display the current fan state
5. Exit - Safely exit the program

## Notes

- The program uses GPIO18 by default. You can change this by modifying the `fan_pin` parameter in the `FanController` class.
- The fan speed is controlled using PWM (Pulse Width Modulation).
- The program includes proper cleanup of GPIO pins when exiting.
- You can exit the program at any time using Ctrl+C. 
#!/usr/bin/env python3

import RPi.GPIO as GPIO
import time
import sys

class FanController:
    def __init__(self, fan_pin=18):  # Using GPIO18 as default
        self.fan_pin = fan_pin
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.fan_pin, GPIO.OUT)
        self.pwm = GPIO.PWM(self.fan_pin, 100)  # 100 Hz frequency
        self.pwm.start(0)  # Start with 0% duty cycle
        self.is_running = False
        self.speed = 0

    def turn_on(self, speed=100):
        """Turn on the fan at specified speed (0-100)"""
        if 0 <= speed <= 100:
            self.pwm.ChangeDutyCycle(speed)
            self.is_running = True
            self.speed = speed
            print(f"Fan turned ON at {speed}% speed")
        else:
            print("Speed must be between 0 and 100")

    def turn_off(self):
        """Turn off the fan"""
        self.pwm.ChangeDutyCycle(0)
        self.is_running = False
        self.speed = 0
        print("Fan turned OFF")

    def set_speed(self, speed):
        """Set fan speed (0-100)"""
        if 0 <= speed <= 100:
            self.pwm.ChangeDutyCycle(speed)
            self.speed = speed
            print(f"Fan speed set to {speed}%")
        else:
            print("Speed must be between 0 and 100")

    def cleanup(self):
        """Clean up GPIO settings"""
        self.pwm.stop()
        GPIO.cleanup()
        print("GPIO cleanup completed")

def print_menu():
    """Print the control menu"""
    print("\nFan Control Menu:")
    print("1. Turn ON fan")
    print("2. Turn OFF fan")
    print("3. Set fan speed")
    print("4. Show current status")
    print("5. Exit")
    print("Enter your choice (1-5): ", end='')

def main():
    try:
        fan = FanController()
        print("Fan Controller initialized")
        
        while True:
            print_menu()
            choice = input().strip()
            
            if choice == '1':
                speed = int(input("Enter speed (0-100): "))
                fan.turn_on(speed)
            elif choice == '2':
                fan.turn_off()
            elif choice == '3':
                speed = int(input("Enter new speed (0-100): "))
                fan.set_speed(speed)
            elif choice == '4':
                status = "ON" if fan.is_running else "OFF"
                print(f"Fan is {status} at {fan.speed}% speed")
            elif choice == '5':
                print("Exiting...")
                fan.cleanup()
                break
            else:
                print("Invalid choice. Please try again.")
            
            time.sleep(0.5)  # Small delay for stability

    except KeyboardInterrupt:
        print("\nProgram terminated by user")
        fan.cleanup()
    except Exception as e:
        print(f"An error occurred: {e}")
        fan.cleanup()

if __name__ == "__main__":
    main() 
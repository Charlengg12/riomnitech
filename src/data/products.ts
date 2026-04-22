export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "Microcontrollers" | "Sensors" | "Robotics Kits" | "Components" | "Tools";
  price: number;
  image: string;
  description: string;
  badge?: string;
  inStock: boolean;
  stockCount?: number;
  sku?: string;
  highlights?: string[];
  specs?: Record<string, string>;
};

export const products: Product[] = [
  {
    id: "1",
    slug: "rio-arm-v2",
    name: "RIO Arm v2 — 6DOF Robotic Arm",
    category: "Robotics Kits",
    price: 289,
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=800&q=80",
    description: "Programmable 6-degree-of-freedom robotic arm with metal servos and Python SDK.",
    badge: "New",
    inStock: true,
  },
  {
    id: "2",
    slug: "esp32-devkit",
    name: "ESP32-S3 DevKit",
    category: "Microcontrollers",
    price: 14,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    description: "Dual-core Wi-Fi + Bluetooth microcontroller with USB-C and integrated antenna.",
    inStock: true,
  },
  {
    id: "3",
    slug: "lidar-tof-200",
    name: "LiDAR ToF-200 Sensor",
    category: "Sensors",
    price: 79,
    image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80",
    description: "Time-of-flight ranging sensor with 200cm range and I²C interface.",
    inStock: true,
  },
  {
    id: "4",
    slug: "rio-rover-chassis",
    name: "RIO Rover Chassis",
    category: "Robotics Kits",
    price: 119,
    image: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=800&q=80",
    description: "Aluminum 4WD rover chassis with encoder motors and shock absorbers.",
    badge: "Best seller",
    inStock: true,
  },
  {
    id: "5",
    slug: "imu-9dof",
    name: "9-DOF IMU Module",
    category: "Sensors",
    price: 24,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80",
    description: "Accelerometer, gyroscope and magnetometer with sensor fusion firmware.",
    inStock: true,
  },
  {
    id: "6",
    slug: "soldering-station-pro",
    name: "Soldering Station Pro",
    category: "Tools",
    price: 95,
    image: "https://images.unsplash.com/photo-1612886623239-9bea7c5d4e4f?w=800&q=80",
    description: "Temperature-controlled 80W soldering station with OLED display.",
    inStock: false,
  },
  {
    id: "7",
    slug: "raspberry-pi-5",
    name: "Raspberry Pi 5 — 8GB",
    category: "Microcontrollers",
    price: 89,
    image: "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=800&q=80",
    description: "Quad-core Cortex-A76 SBC with PCIe and dual 4K display output.",
    inStock: true,
  },
  {
    id: "8",
    slug: "stepper-driver-kit",
    name: "Stepper Driver Kit",
    category: "Components",
    price: 32,
    image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&q=80",
    description: "TMC2209 silent stepper drivers, pack of 4, with heatsinks.",
    inStock: true,
  },
];

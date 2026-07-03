import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

type CollegeSeed = {
  name: string;
  location: string;
  state: string;
  type: "Government" | "Private" | "Deemed";
  category: string;
  fees: number;
  rating: number;
  established: number;
  website?: string;
  description: string;
  imageUrl?: string;
  courses: { name: string; duration: string; seats: number; fees: number }[];
  placements: {
    year: number;
    avgPackage: number;
    highestPackage: number;
    placementRate: number;
    topRecruiters: string;
  }[];
  reviews: {
    userName: string;
    rating: number;
    comment: string;
    pros?: string;
    cons?: string;
  }[];
  cutoffs: { exam: "JEE" | "NEET" | "CUET"; maxRank: number }[];
};

const colleges: CollegeSeed[] = [
  {
    name: "Indian Institute of Technology Bombay",
    location: "Mumbai",
    state: "Maharashtra",
    type: "Government",
    category: "Engineering",
    fees: 250000,
    rating: 4.8,
    established: 1958,
    website: "https://www.iitb.ac.in",
    description:
      "One of India's premier engineering institutes, known for its rigorous academics, research output, and strong industry connections.",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", seats: 120, fees: 250000 },
      { name: "B.Tech Mechanical Engineering", duration: "4 years", seats: 100, fees: 230000 },
      { name: "B.Tech Electrical Engineering", duration: "4 years", seats: 90, fees: 230000 },
    ],
    placements: [
      { year: 2025, avgPackage: 22, highestPackage: 210, placementRate: 96, topRecruiters: "Google, Microsoft, Goldman Sachs, JP Morgan, Qualcomm" },
      { year: 2024, avgPackage: 20, highestPackage: 190, placementRate: 95, topRecruiters: "Google, Amazon, Sequoia, McKinsey, Adobe" },
    ],
    reviews: [
      { userName: "Aarav Sharma", rating: 5, comment: "Incredible peer group and faculty. The workload is intense but worth it.", pros: "Placements, alumni network", cons: "High stress environment" },
      { userName: "Priya Nair", rating: 4.5, comment: "Great research opportunities, especially in CS and robotics." },
    ],
    cutoffs: [{ exam: "JEE", maxRank: 500 }],
  },
  {
    name: "Indian Institute of Technology Delhi",
    location: "New Delhi",
    state: "Delhi",
    type: "Government",
    category: "Engineering",
    fees: 245000,
    rating: 4.7,
    established: 1961,
    website: "https://home.iitd.ac.in",
    description:
      "A top-ranked engineering institute with strong programs in computer science, electrical engineering, and design.",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", seats: 110, fees: 245000 },
      { name: "B.Tech Civil Engineering", duration: "4 years", seats: 80, fees: 220000 },
    ],
    placements: [
      { year: 2025, avgPackage: 21, highestPackage: 200, placementRate: 95, topRecruiters: "Microsoft, Google, Uber, Bain & Co, Samsung" },
    ],
    reviews: [
      { userName: "Rohan Gupta", rating: 4.5, comment: "Excellent campus life and access to top recruiters.", pros: "Location in Delhi, strong CS dept" },
    ],
    cutoffs: [{ exam: "JEE", maxRank: 600 }],
  },
  {
    name: "Indian Institute of Technology Madras",
    location: "Chennai",
    state: "Tamil Nadu",
    type: "Government",
    category: "Engineering",
    fees: 240000,
    rating: 4.7,
    established: 1959,
    website: "https://www.iitm.ac.in",
    description:
      "Consistently ranked India's #1 engineering institute, with a large green campus and thriving startup ecosystem.",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", seats: 115, fees: 240000 },
      { name: "B.Tech Aerospace Engineering", duration: "4 years", seats: 60, fees: 220000 },
    ],
    placements: [
      { year: 2025, avgPackage: 21, highestPackage: 180, placementRate: 94, topRecruiters: "Intel, Texas Instruments, Google, Flipkart, ZS Associates" },
    ],
    reviews: [
      { userName: "Meera Iyer", rating: 5, comment: "The research culture here is unmatched. Loved every bit of it.", pros: "Campus size, research labs" },
    ],
    cutoffs: [{ exam: "JEE", maxRank: 700 }],
  },
  {
    name: "Birla Institute of Technology and Science, Pilani",
    location: "Pilani",
    state: "Rajasthan",
    type: "Private",
    category: "Engineering",
    fees: 210000,
    rating: 4.4,
    established: 1964,
    website: "https://www.bits-pilani.ac.in",
    description:
      "A leading private engineering institute known for its flexible curriculum and dual-degree programs.",
    imageUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a",
    courses: [
      { name: "B.E. Computer Science", duration: "4 years", seats: 180, fees: 210000 },
      { name: "B.E. Electronics & Instrumentation", duration: "4 years", seats: 90, fees: 200000 },
    ],
    placements: [
      { year: 2025, avgPackage: 18, highestPackage: 120, placementRate: 92, topRecruiters: "Adobe, Amazon, Deloitte, Texas Instruments" },
    ],
    reviews: [
      { userName: "Karan Mehta", rating: 4, comment: "Great flexibility with dual degrees, though the desert location takes getting used to." },
    ],
    cutoffs: [{ exam: "JEE", maxRank: 4000 }],
  },
  {
    name: "Vellore Institute of Technology",
    location: "Vellore",
    state: "Tamil Nadu",
    type: "Private",
    category: "Engineering",
    fees: 198000,
    rating: 4.1,
    established: 1984,
    website: "https://vit.ac.in",
    description:
      "A large private university with a diverse student base and strong international exchange programs.",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", seats: 400, fees: 198000 },
      { name: "B.Tech Information Technology", duration: "4 years", seats: 240, fees: 190000 },
    ],
    placements: [
      { year: 2025, avgPackage: 8, highestPackage: 90, placementRate: 88, topRecruiters: "TCS, Infosys, Cognizant, Amazon, Wipro" },
    ],
    reviews: [
      { userName: "Sneha Reddy", rating: 4, comment: "Good infrastructure and lots of clubs and events." },
    ],
    cutoffs: [{ exam: "JEE", maxRank: 25000 }],
  },
  {
    name: "All India Institute of Medical Sciences, Delhi",
    location: "New Delhi",
    state: "Delhi",
    type: "Government",
    category: "Medical",
    fees: 6000,
    rating: 4.9,
    established: 1956,
    website: "https://www.aiims.edu",
    description:
      "India's foremost medical institution, offering world-class clinical training and research facilities.",
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d",
    courses: [
      { name: "MBBS", duration: "5.5 years", seats: 125, fees: 6000 },
      { name: "B.Sc. Nursing", duration: "4 years", seats: 60, fees: 5000 },
    ],
    placements: [
      { year: 2025, avgPackage: 12, highestPackage: 40, placementRate: 99, topRecruiters: "AIIMS Hospitals, Apollo, Fortis, Max Healthcare" },
    ],
    reviews: [
      { userName: "Dr. Ananya Das", rating: 5, comment: "Unparalleled clinical exposure from the very first year.", pros: "Faculty, patient volume" },
    ],
    cutoffs: [{ exam: "NEET", maxRank: 100 }],
  },
  {
    name: "Christian Medical College, Vellore",
    location: "Vellore",
    state: "Tamil Nadu",
    type: "Private",
    category: "Medical",
    fees: 55000,
    rating: 4.7,
    established: 1900,
    website: "https://www.cmch-vellore.edu",
    description:
      "A historic medical college renowned for its patient care ethos and strong postgraduate programs.",
    imageUrl: "https://images.unsplash.com/photo-1580281657702-257584239a55",
    courses: [
      { name: "MBBS", duration: "5.5 years", seats: 100, fees: 55000 },
    ],
    placements: [
      { year: 2025, avgPackage: 10, highestPackage: 30, placementRate: 98, topRecruiters: "CMC Hospital, Christian Fellowship Hospitals" },
    ],
    reviews: [
      { userName: "Vikram Rao", rating: 4.5, comment: "Strong community service focus alongside excellent academics." },
    ],
    cutoffs: [{ exam: "NEET", maxRank: 300 }],
  },
  {
    name: "Maulana Azad Medical College",
    location: "New Delhi",
    state: "Delhi",
    type: "Government",
    category: "Medical",
    fees: 15000,
    rating: 4.5,
    established: 1958,
    website: "https://www.mamc.ac.in",
    description:
      "A well-established government medical college affiliated with several major Delhi hospitals.",
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514",
    courses: [{ name: "MBBS", duration: "5.5 years", seats: 250, fees: 15000 }],
    placements: [
      { year: 2025, avgPackage: 9, highestPackage: 25, placementRate: 97, topRecruiters: "Lok Nayak Hospital, GB Pant Hospital" },
    ],
    reviews: [
      { userName: "Ishaan Kapoor", rating: 4, comment: "Huge patient inflow gives fantastic hands-on experience." },
    ],
    cutoffs: [{ exam: "NEET", maxRank: 1500 }],
  },
  {
    name: "Indian Institute of Management Ahmedabad",
    location: "Ahmedabad",
    state: "Gujarat",
    type: "Government",
    category: "Management",
    fees: 2500000,
    rating: 4.8,
    established: 1961,
    website: "https://www.iima.ac.in",
    description:
      "India's top business school, famous for its case-study pedagogy and elite corporate placements.",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
    courses: [{ name: "MBA / PGP", duration: "2 years", seats: 400, fees: 2500000 }],
    placements: [
      { year: 2025, avgPackage: 34, highestPackage: 120, placementRate: 100, topRecruiters: "McKinsey, BCG, Bain, Google, Goldman Sachs" },
    ],
    reviews: [
      { userName: "Neha Joshi", rating: 5, comment: "Life-changing peer learning experience and unmatched brand value." },
    ],
    cutoffs: [{ exam: "CUET", maxRank: 200 }],
  },
  {
    name: "Indian Institute of Management Bangalore",
    location: "Bangalore",
    state: "Karnataka",
    type: "Government",
    category: "Management",
    fees: 2400000,
    rating: 4.7,
    established: 1973,
    website: "https://www.iimb.ac.in",
    description:
      "A leading management institute with strong ties to Bangalore's startup and tech ecosystem.",
    imageUrl: "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a",
    courses: [{ name: "MBA / PGP", duration: "2 years", seats: 480, fees: 2400000 }],
    placements: [
      { year: 2025, avgPackage: 32, highestPackage: 110, placementRate: 99, topRecruiters: "Amazon, Flipkart, BCG, Deloitte, Microsoft" },
    ],
    reviews: [
      { userName: "Arjun Verma", rating: 4.5, comment: "Great access to VC and startup networks in Bangalore." },
    ],
    cutoffs: [{ exam: "CUET", maxRank: 350 }],
  },
  {
    name: "Xavier School of Management (XLRI)",
    location: "Jamshedpur",
    state: "Jharkhand",
    type: "Private",
    category: "Management",
    fees: 2600000,
    rating: 4.5,
    established: 1949,
    website: "https://www.xlri.ac.in",
    description:
      "One of India's oldest B-schools, especially renowned for its human resource management program.",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
    courses: [{ name: "MBA - HRM", duration: "2 years", seats: 180, fees: 2600000 }],
    placements: [
      { year: 2025, avgPackage: 28, highestPackage: 80, placementRate: 100, topRecruiters: "Tata Group, HUL, ITC, Accenture, EY" },
    ],
    reviews: [
      { userName: "Divya Menon", rating: 4.5, comment: "Best in India for HR specialization, very close alumni network." },
    ],
    cutoffs: [{ exam: "CUET", maxRank: 500 }],
  },
  {
    name: "National Law School of India University",
    location: "Bangalore",
    state: "Karnataka",
    type: "Government",
    category: "Law",
    fees: 320000,
    rating: 4.6,
    established: 1987,
    website: "https://www.nls.ac.in",
    description:
      "India's premier national law school, producing many of the country's leading lawyers and judges.",
    imageUrl: "https://images.unsplash.com/photo-1568792923760-d70635a89fdc",
    courses: [{ name: "BA LLB (Hons)", duration: "5 years", seats: 80, fees: 320000 }],
    placements: [
      { year: 2025, avgPackage: 18, highestPackage: 40, placementRate: 96, topRecruiters: "AZB & Partners, Cyril Amarchand, Trilegal, Khaitan & Co" },
    ],
    reviews: [
      { userName: "Ritika Malhotra", rating: 4.5, comment: "Exceptional mooting culture and faculty mentorship." },
    ],
    cutoffs: [{ exam: "CUET", maxRank: 100 }],
  },
  {
    name: "St. Stephen's College",
    location: "New Delhi",
    state: "Delhi",
    type: "Government",
    category: "Arts & Science",
    fees: 45000,
    rating: 4.6,
    established: 1881,
    website: "https://www.ststephens.edu",
    description:
      "One of India's most prestigious liberal arts colleges, affiliated with the University of Delhi.",
    imageUrl: "https://images.unsplash.com/photo-1607013251379-e6eecfffe234",
    courses: [
      { name: "B.A. (Hons) Economics", duration: "3 years", seats: 45, fees: 45000 },
      { name: "B.Sc. (Hons) Physics", duration: "3 years", seats: 30, fees: 40000 },
    ],
    placements: [
      { year: 2025, avgPackage: 7, highestPackage: 25, placementRate: 80, topRecruiters: "Deloitte, EY, Teach For India, Various Civil Services" },
    ],
    reviews: [
      { userName: "Tanvi Chawla", rating: 4.5, comment: "Rich history and a fantastic debating and academic culture." },
    ],
    cutoffs: [{ exam: "CUET", maxRank: 1000 }],
  },
  {
    name: "Manipal Institute of Technology",
    location: "Manipal",
    state: "Karnataka",
    type: "Deemed",
    category: "Engineering",
    fees: 450000,
    rating: 4.0,
    established: 1957,
    website: "https://manipal.edu/mit.html",
    description:
      "A well-known deemed university offering a vibrant, multicultural campus experience with modern infrastructure.",
    imageUrl: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", seats: 300, fees: 450000 },
      { name: "B.Tech Biotechnology", duration: "4 years", seats: 80, fees: 400000 },
    ],
    placements: [
      { year: 2025, avgPackage: 9, highestPackage: 60, placementRate: 85, topRecruiters: "Bosch, Cisco, Cognizant, Infosys" },
    ],
    reviews: [
      { userName: "Yash Kulkarni", rating: 4, comment: "Amazing campus life, though fees are on the higher side." },
    ],
    cutoffs: [{ exam: "JEE", maxRank: 35000 }],
  },
  {
    name: "SRM Institute of Science and Technology",
    location: "Chennai",
    state: "Tamil Nadu",
    type: "Deemed",
    category: "Engineering",
    fees: 285000,
    rating: 3.9,
    established: 1985,
    website: "https://www.srmist.edu.in",
    description:
      "One of India's largest private deemed universities, with a wide range of engineering and allied programs.",
    imageUrl: "https://images.unsplash.com/photo-1607013251379-e6eecfffe234",
    courses: [
      { name: "B.Tech Computer Science", duration: "4 years", seats: 600, fees: 285000 },
      { name: "B.Tech Mechanical Engineering", duration: "4 years", seats: 200, fees: 250000 },
    ],
    placements: [
      { year: 2025, avgPackage: 7, highestPackage: 50, placementRate: 82, topRecruiters: "TCS, Wipro, Zoho, Amazon" },
    ],
    reviews: [
      { userName: "Gautam Iyer", rating: 3.5, comment: "Huge campus with lots of options, but class sizes can be large." },
    ],
    cutoffs: [{ exam: "JEE", maxRank: 60000 }],
  },
];

async function main() {
  console.log("Seeding database...");

  // Demo user referenced in the README and login screen
  const demoPasswordHash = await bcrypt.hash("password123", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo User",
      password: demoPasswordHash,
    },
  });
  console.log(`Upserted demo user: ${demoUser.email}`);

  for (const c of colleges) {
    // College has no unique field besides id, so check by name before creating
    // to keep the seed script safely re-runnable.
    const existing = await prisma.college.findFirst({ where: { name: c.name } });
    if (existing) {
      console.log(`Skipped (already exists): ${c.name}`);
      continue;
    }

    const created = await prisma.college.create({
      data: {
        name: c.name,
        location: c.location,
        state: c.state,
        type: c.type,
        category: c.category,
        fees: c.fees,
        rating: c.rating,
        established: c.established,
        website: c.website,
        description: c.description,
        imageUrl: c.imageUrl,
        courses: { create: c.courses },
        placements: { create: c.placements },
        reviews: { create: c.reviews },
        cutoffs: { create: c.cutoffs },
      },
    });
    console.log(`Created college: ${created.name}`);
  }

  // Seed a sample discussion so the Q&A page isn't empty on first run
  const existingQuestion = await prisma.question.findFirst({
    where: { title: "Which is better for CS: IIT Bombay or IIT Delhi?" },
  });
  if (!existingQuestion) {
    const question = await prisma.question.create({
      data: {
        userId: demoUser.id,
        title: "Which is better for CS: IIT Bombay or IIT Delhi?",
        body: "I've got a rank that qualifies for both. Looking for advice on placements, campus life, and research opportunities in Computer Science.",
      },
    });
    await prisma.answer.create({
      data: {
        questionId: question.id,
        userId: demoUser.id,
        body: "Both are excellent — IIT Bombay has a slight edge in CS placements and startup exposure, while IIT Delhi benefits from its Delhi location for internships. You can't go wrong with either.",
      },
    });
    console.log("Seeded a sample discussion thread.");
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

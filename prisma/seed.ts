import { PrismaClient, Role, PartnershipType, CollegeStatus, ProgramType } from '@prisma/client'
// Using require to avoid module issues if tsconfig isn't set up perfectly for node yet
const { hash } = require('bcryptjs')

const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding the database...')

  // Clean up existing data (in a specific order to avoid foreign key constraints)
  await prisma.placement.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.program.deleteMany()
  await prisma.student.deleteMany()
  await prisma.mou.deleteMany()
  await prisma.communication.deleteMany()
  await prisma.user.deleteMany()
  await prisma.college.deleteMany()

  const passwordHash = await hash('password123', 10)

  // 1. Create a Super Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@skilltank.com',
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  })
  console.log(`Created admin user: ${admin.email}`)

  // 2. Create Colleges
  const c1 = await prisma.college.create({
    data: {
      name: 'Global Tech University',
      university: 'GTU',
      partnershipType: PartnershipType.CRT,
      revenueSharePercentage: 20.0,
      status: CollegeStatus.APPROVED,
    },
  })

  const c2 = await prisma.college.create({
    data: {
      name: 'National Institute of Engineering',
      university: 'NIE',
      partnershipType: PartnershipType.FDP,
      revenueSharePercentage: 15.0,
      status: CollegeStatus.APPROVED,
    },
  })

  const c3 = await prisma.college.create({
    data: {
      name: 'Future Sciences College',
      university: 'FSC',
      partnershipType: PartnershipType.EXTERNAL,
      revenueSharePercentage: 10.0,
      status: CollegeStatus.APPROVED,
    },
  })
  console.log('Created 3 dummy colleges')

  // 3. Create TPO Admins
  await prisma.user.create({
    data: {
      name: 'TPO Admin 1',
      email: 'tpo1@gtu.edu',
      passwordHash,
      role: Role.TPO_ADMIN,
      collegeId: c1.id,
    },
  })

  await prisma.user.create({
    data: {
      name: 'TPO Admin 2',
      email: 'tpo2@nie.edu',
      passwordHash,
      role: Role.TPO_ADMIN,
      collegeId: c2.id,
    },
  })

  await prisma.user.create({
    data: {
      name: 'TPO Admin 3',
      email: 'tpo3@fsc.edu',
      passwordHash,
      role: Role.TPO_ADMIN,
      collegeId: c3.id,
    },
  })
  console.log('Created 3 TPO Admins')

  // 4. Create FDP and Student Programs
  const p1 = await prisma.program.create({
    data: {
      name: 'Full Stack Web Development Bootcamp',
      type: ProgramType.STUDENT,
    },
  })

  const p2 = await prisma.program.create({
    data: {
      name: 'Advanced AI and Machine Learning',
      type: ProgramType.STUDENT,
    },
  })

  const p3 = await prisma.program.create({
    data: {
      name: 'Faculty Pedagogy Enhancement Program',
      type: ProgramType.FDP,
    },
  })
  console.log('Created 3 dummy programs')

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

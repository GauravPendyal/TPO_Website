import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { hash } from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})
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
      role: 'SUPER_ADMIN',
    },
  })
  console.log(`Created admin user: ${admin.email}`)

  // 2. Create Colleges
  const c1 = await prisma.college.create({
    data: {
      name: 'Global Tech University',
      university: 'GTU',
      partnershipType: 'CRT',
      revenueSharePercentage: 20.0,
      status: 'APPROVED',
    },
  })

  const c2 = await prisma.college.create({
    data: {
      name: 'National Institute of Engineering',
      university: 'NIE',
      partnershipType: 'FDP',
      revenueSharePercentage: 15.0,
      status: 'APPROVED',
    },
  })

  const c3 = await prisma.college.create({
    data: {
      name: 'Future Sciences College',
      university: 'FSC',
      partnershipType: 'EXTERNAL',
      revenueSharePercentage: 10.0,
      status: 'APPROVED',
    },
  })
  console.log('Created 3 dummy colleges')

  // 3. Create TPO Admins
  await prisma.user.create({
    data: {
      name: 'TPO Admin 1',
      email: 'tpo1@gtu.edu',
      passwordHash,
      role: 'TPO_ADMIN',
      collegeId: c1.id,
    },
  })

  await prisma.user.create({
    data: {
      name: 'TPO Admin 2',
      email: 'tpo2@nie.edu',
      passwordHash,
      role: 'TPO_ADMIN',
      collegeId: c2.id,
    },
  })

  await prisma.user.create({
    data: {
      name: 'TPO Admin 3',
      email: 'tpo3@fsc.edu',
      passwordHash,
      role: 'TPO_ADMIN',
      collegeId: c3.id,
    },
  })
  console.log('Created 3 TPO Admins')

  // 4. Create FDP and Student Programs
  const p1 = await prisma.program.create({
    data: {
      name: 'Full Stack Web Development Bootcamp',
      type: 'STUDENT',
    },
  })

  const p2 = await prisma.program.create({
    data: {
      name: 'Advanced AI and Machine Learning',
      type: 'STUDENT',
    },
  })

  const p3 = await prisma.program.create({
    data: {
      name: 'Faculty Pedagogy Enhancement Program',
      type: 'FDP',
    },
  })
  console.log('Created 3 dummy programs')

  const colleges = [c1, c2, c3]
  const programs = [p1, p2, p3]
  const departments = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Business Analytics']
  const firstNames = ['Aarav', 'Ananya', 'Ishaan', 'Meera', 'Kabir', 'Diya', 'Vivaan', 'Riya', 'Arjun', 'Sara']
  const lastNames = ['Sharma', 'Reddy', 'Patel', 'Nair', 'Gupta', 'Iyer', 'Khan', 'Mehta', 'Pillai', 'Rao']
  const companies = ['Infosys', 'TCS Digital', 'Accenture', 'Zoho', 'Freshworks', 'Deloitte', 'Wipro', 'Cognizant']
  const roles = ['Software Engineer', 'Data Analyst', 'Cloud Associate', 'QA Engineer', 'Business Analyst']
  const createdStudents: { id: string; name: string; collegeId: string }[] = []

  for (let i = 0; i < 60; i++) {
    const college = colleges[i % colleges.length]
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length]
    const student = await prisma.student.create({
      data: {
        collegeId: college.id,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@example.edu`,
        gradYear: 2025 + (i % 3),
        department: departments[i % departments.length],
      },
    })

    createdStudents.push({ id: student.id, name: student.name, collegeId: student.collegeId })

    await prisma.enrollment.create({
      data: {
        studentId: student.id,
        programId: programs[i % programs.length].id,
        progressPercentage: 35 + ((i * 7) % 66),
        status: i % 4 === 0 ? 'COMPLETED' : 'ENROLLED',
      },
    })
  }
  console.log('Created 60 students with enrollments')

  for (let i = 0; i < 24; i++) {
    const student = createdStudents[i]
    await prisma.placement.create({
      data: {
        studentId: student.id,
        companyName: companies[i % companies.length],
        role: roles[i % roles.length],
        salary: 4.5 + (i % 10) * 0.8,
        dateOffered: new Date(2026, i % 6, 3 + i),
      },
    })
  }
  console.log('Created 24 placement records')

  for (let i = 0; i < colleges.length; i++) {
    await prisma.mou.create({
      data: {
        collegeId: colleges[i].id,
        documentUrl: `https://example.com/mous/${colleges[i].id}.pdf`,
        startDate: new Date(2026, 0, 1 + i),
        endDate: new Date(2026, i === 0 ? 6 : 11, 15 + i),
        status: i === 0 ? 'RENEWAL_DUE' : 'ACTIVE',
      },
    })

    await prisma.communication.create({
      data: {
        collegeId: colleges[i].id,
        adminId: admin.id,
        note: `Quarterly partnership review completed for ${colleges[i].name}.`,
        meetingDate: new Date(2026, 5, 5 + i),
      },
    })
  }
  console.log('Created MOUs and communication logs')

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

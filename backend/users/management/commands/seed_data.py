"""
Management command: python manage.py seed_data
Seeds the SQLite database with sample users, companies and jobs.
"""
import os
from django.core.management.base import BaseCommand
from django.db import transaction
from users.models import User, CompanyProfile, ApplicantProfile
from jobs.models import Job


COMPANIES = [
    {'name': 'Priya Nair',      'email': 'priya@techcorp.in',  'company': 'TechCorp India',  'industry': 'Technology'},
    {'name': 'Rohan Mehta',     'email': 'rohan@zomato.com',   'company': 'Zomato',          'industry': 'Food Tech'},
    {'name': 'Siddharth Kumar', 'email': 'sid@razorpay.com',   'company': 'Razorpay',        'industry': 'Fintech'},
]

APPLICANTS = [
    {'name': 'Arjun Sharma',  'email': 'arjun@email.com',  'bio': 'Full-stack developer with 3 years experience.'},
    {'name': 'Meera Patel',   'email': 'meera@email.com',  'bio': 'Vue.js and React developer.'},
    {'name': 'Rahul Singh',   'email': 'rahul@email.com',  'bio': 'Product strategist with 5 years experience.'},
]

SAMPLE_JOBS = [
    {
        'title': 'Senior Frontend Developer',
        'description': 'We are looking for a Senior Frontend Developer to join our growing engineering team. You will be responsible for building and maintaining high-quality web applications.',
        'location': 'Bangalore, Karnataka',
        'salary': '₹18,00,000 – ₹24,00,000/yr',
        'salary_min': 1800000,
        'salary_max': 2400000,
        'job_type': 'Full-time',
        'category': 'Technology',
        'skills': ['React', 'TypeScript', 'Tailwind CSS'],
        'requirements': ['5+ years React experience', 'Strong JavaScript skills', 'REST API experience'],
        'openings': 2,
    },
    {
        'title': 'Product Manager',
        'description': 'Drive the vision and roadmap for our core products. You will define product strategy and work cross-functionally.',
        'location': 'Gurugram, Haryana',
        'salary': '₹20,00,000 – ₹30,00,000/yr',
        'salary_min': 2000000,
        'salary_max': 3000000,
        'job_type': 'Full-time',
        'category': 'Management',
        'skills': ['Product Strategy', 'Agile', 'Data Analysis'],
        'requirements': ['3+ years PM experience', 'Strong analytical skills', 'Agile methodology'],
        'openings': 1,
    },
    {
        'title': 'Backend Engineer (Python)',
        'description': 'Build infrastructure that powers our payment gateway. Work on high-throughput, low-latency systems.',
        'location': 'Bangalore, Karnataka',
        'salary': '₹22,00,000 – ₹32,00,000/yr',
        'salary_min': 2200000,
        'salary_max': 3200000,
        'job_type': 'Full-time',
        'category': 'Technology',
        'skills': ['Python', 'Django', 'PostgreSQL', 'Redis'],
        'requirements': ['3+ years Python/Django', 'Distributed systems knowledge', 'SQL/NoSQL databases'],
        'openings': 3,
    },
]


class Command(BaseCommand):
    help = 'Seed the database with sample data for development'

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write('🌱 Seeding database...')

        # Create companies
        company_users = []
        for c in COMPANIES:
            user, created = User.objects.get_or_create(
                email=c['email'],
                defaults={'name': c['name'], 'role': 'company'},
            )
            if created:
                user.set_password('password123')
                user.save()
                CompanyProfile.objects.create(
                    user=user,
                    company_name=c['company'],
                    industry=c['industry'],
                    description=f'{c["company"]} is a leading company in {c["industry"]}.',
                )
                self.stdout.write(f'  ✅ Company: {c["company"]}')
            company_users.append(user)

        # Create applicants
        for a in APPLICANTS:
            user, created = User.objects.get_or_create(
                email=a['email'],
                defaults={'name': a['name'], 'role': 'applicant', 'bio': a['bio']},
            )
            if created:
                user.set_password('password123')
                user.save()
                ApplicantProfile.objects.create(user=user, skills=['React', 'Python'])
                self.stdout.write(f'  ✅ Applicant: {a["name"]}')

        # Create jobs
        for i, j in enumerate(SAMPLE_JOBS):
            company_user = company_users[i % len(company_users)]
            job, created = Job.objects.get_or_create(
                title=j['title'],
                company=company_user,
                defaults=j,
            )
            if created:
                self.stdout.write(f'  ✅ Job: {j["title"]}')

        # Create superuser
        if not User.objects.filter(email='admin@talentbridge.in').exists():
            User.objects.create_superuser(
                email='admin@talentbridge.in',
                name='Admin',
                password='admin123',
            )
            self.stdout.write('  ✅ Superuser: admin@talentbridge.in / admin123')

        self.stdout.write(self.style.SUCCESS('\n🚀 Database seeded successfully!'))
        self.stdout.write('\nDemo accounts (password: password123):')
        self.stdout.write('  Applicant : arjun@email.com')
        self.stdout.write('  Company   : priya@techcorp.in')
        self.stdout.write('  Admin     : admin@talentbridge.in (password: admin123)')

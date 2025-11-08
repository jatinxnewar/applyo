-- Create users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  phone TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  user_type TEXT CHECK (user_type IN ('student', 'professional', 'admin')),
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'pro', 'enterprise')) DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create resume templates table
CREATE TABLE resume_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template_type TEXT CHECK (template_type IN ('modern', 'classic', 'minimalist', 'creative')) DEFAULT 'modern',
  content JSONB NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create resumes table
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  template_id UUID REFERENCES resume_templates(id) ON DELETE SET NULL,
  content JSONB NOT NULL,
  pdf_url TEXT,
  ats_score FLOAT,
  last_generated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create job postings table
CREATE TABLE job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  salary_range JSONB,
  location TEXT,
  job_type TEXT CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship')),
  status TEXT CHECK (status IN ('open', 'closed', 'filled')) DEFAULT 'open',
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
  cover_letter TEXT,
  status TEXT CHECK (status IN ('draft', 'submitted', 'reviewed', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'draft',
  ats_match_score FLOAT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create applicant tracking table
CREATE TABLE applicant_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  employer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT CHECK (event_type IN ('viewed', 'shortlisted', 'rejected', 'offer_extended', 'offer_accepted')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE applicant_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Allow public read of user profiles for job listings" ON users FOR SELECT USING (true);

-- RLS Policies for resumes table
CREATE POLICY "Users can view their own resumes" ON resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create resumes" ON resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own resumes" ON resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own resumes" ON resumes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for resume templates table
CREATE POLICY "Users can view their own templates" ON resume_templates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create templates" ON resume_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own templates" ON resume_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own templates" ON resume_templates FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for job postings table
CREATE POLICY "Employers can view their own job postings" ON job_postings FOR SELECT USING (auth.uid() = employer_id);
CREATE POLICY "Anyone can view published job postings" ON job_postings FOR SELECT USING (status = 'open');
CREATE POLICY "Employers can create job postings" ON job_postings FOR INSERT WITH CHECK (auth.uid() = employer_id);
CREATE POLICY "Employers can update their own job postings" ON job_postings FOR UPDATE USING (auth.uid() = employer_id);
CREATE POLICY "Employers can delete their own job postings" ON job_postings FOR DELETE USING (auth.uid() = employer_id);

-- RLS Policies for applications table
CREATE POLICY "Users can view their own applications" ON applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Employers can view applications to their jobs" ON applications FOR SELECT 
  USING (EXISTS (SELECT 1 FROM job_postings WHERE job_postings.id = applications.job_id AND job_postings.employer_id = auth.uid()));
CREATE POLICY "Users can create applications" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own applications" ON applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own applications" ON applications FOR DELETE USING (auth.uid() = user_id);

-- Fixed applicant tracking RLS policy - changed applications.id to a.id for correct reference
CREATE POLICY "Employers can view tracking for their applications" ON applicant_tracking FOR SELECT 
  USING (EXISTS (SELECT 1 FROM applications a 
    JOIN job_postings j ON a.job_id = j.id 
    WHERE j.employer_id = auth.uid()));
CREATE POLICY "Employers can create tracking events" ON applicant_tracking FOR INSERT 
  WITH CHECK (auth.uid() = employer_id);
